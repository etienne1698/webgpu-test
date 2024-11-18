import { vec3 } from "gl-matrix";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

export class Renderer {
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;

  pipeline!: GPURenderPipeline;
  vertexBufferLayout = {
    arrayStride: 12,
    attributes: [
      {
        format: "float32x3" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
      },
    ],
  };

  constructor(public canvas: HTMLCanvasElement, public scene: Scene) {
    this.canvas = canvas;
  }

  async init() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No appropriate GPUAdapter found.");
    }
    this.adapter = adapter;

    this.device = await this.adapter.requestDevice();

    const context = this.canvas.getContext("webgpu");
    if (!context) {
      throw new Error("No context.");
    }
    this.context = context;
    const canvasFormat = navigator.gpu.getPreferredCanvasFormat();
    this.context.configure({
      device: this.device,
      format: canvasFormat,
    });

    const shaderModule = this.device.createShaderModule({
      label: "shader",
      // code: shaderWgsl,
      code: `
                    struct Uniforms {
                        modelMatrix : mat4x4<f32>
                    };
                    @binding(0) @group(0) var<uniform> uniforms : Uniforms;
                    @binding(1) @group(0) var<uniform> cameraPos : vec3<f32>;

                    @vertex
                    fn main(
                        @location(0) position : vec3<f32>
                    ) -> @builtin(position) vec4<f32> {
                        return uniforms.modelMatrix * vec4(position - cameraPos, 1);
                    }
                        
                      @fragment
                      fn fragmentMain() -> @location(0) vec4f {
                      
                        return vec4f(1, 0, 0, 0);
                      }`,
    });

    this.pipeline = this.device.createRenderPipeline({
      label: "Cell pipeline",
      layout: this.device.createPipelineLayout({
        label: "vertexLayout",
        bindGroupLayouts: [
          this.device.createBindGroupLayout({
            label: "Cell Bind Group Layout",
            entries: [
              {
                binding: 0,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
                buffer: {},
              },
              {
                binding: 1,
                visibility: GPUShaderStage.VERTEX | GPUShaderStage.COMPUTE,
                buffer: {},
              },
            ],
          }),
        ],
      }),
      vertex: {
        module: shaderModule,
        entryPoint: "main",
        buffers: [this.vertexBufferLayout],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragmentMain",
        targets: [
          {
            format: canvasFormat,
          },
        ],
      },
    });
  }

  async render(camera: Camera) {
    const encoder = this.device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.context.getCurrentTexture().createView(),
          loadOp: "clear",
          clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
          storeOp: "store",
        },
      ],
    });
    pass.setPipeline(this.pipeline);

    let vertices: vec3[] = [];
    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes.values()) {
        for (const vertex of mesh.vertices) {
          vertices.push(vertex);
        }
      }
    }

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes.values()) {
        const uniformBuffer = this.device.createBuffer({
          size: 64, // Taille d'une matrice 4x4 (4x4 floats, 4 bytes par float)
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        const cameraPosBuffer = this.device.createBuffer({
          size: 4 * 3,
          usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
        });

        pass.setBindGroup(
          0,
          this.device.createBindGroup({
            layout: this.pipeline.getBindGroupLayout(0),
            entries: [
              {
                binding: 0,
                resource: {
                  buffer: uniformBuffer,
                },
              },
              {
                binding: 1,
                resource: {
                  buffer: cameraPosBuffer,
                },
              },
            ],
          })
        );

        this.device.queue.writeBuffer(
          uniformBuffer,
          0,
          new Float32Array(mesh.transform)
        );
        this.device.queue.writeBuffer(
          cameraPosBuffer,
          0,
          new Float32Array(camera.position)
        );

        const vertices = mesh.vertices.map((v) => [v[0], v[1], v[2]]).flat(); // Transformer en tableau plat [x, y, z, ...]
        const vertexBuffer = this.device.createBuffer({
          label: "Mesh vertices",
          size: 4 * vertices.length, // Taille du buffer (taille float * nombre de floats)
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        this.device.queue.writeBuffer(
          vertexBuffer,
          0,
          new Float32Array(vertices)
        );
        pass.setVertexBuffer(0, vertexBuffer);

        pass.draw(mesh.vertices.length);
      }
    }

    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
