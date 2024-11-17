import { Scene } from "../models/scene";

export class Renderer {
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;

  pipeline!: GPURenderPipeline;
  uniformBuffer!: GPUBuffer;
  bindGroup!: GPUBindGroup;

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

                    @vertex
                    fn main(
                        @location(0) position : vec4<f32>
                    ) -> @builtin(position) vec4<f32> {
                        return uniforms.modelMatrix * position;
                    }
                        
                      @fragment
                      fn fragmentMain() -> @location(0) vec4f {
                        return vec4f(1, 0, 1, 0);
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
            ],
          }),
        ],
      }),
      vertex: {
        module: shaderModule,
        entryPoint: "main",
        buffers: [
          {
            arrayStride: 8,
            attributes: [
              {
                format: "float32x2",
                offset: 0,
                shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
              },
            ],
          },
        ],
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

    this.uniformBuffer = this.device.createBuffer({
      size: 64, // Taille d'une matrice 4x4 (4x4 floats, 4 bytes par float)
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });

    this.bindGroup = this.device.createBindGroup({
      layout: this.pipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: {
            buffer: this.uniformBuffer,
          },
        },
      ],
    });
  }

  async render() {
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
    pass.end();
    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        await mesh.init(this.device);
        const pass = encoder.beginRenderPass({
          colorAttachments: [
            {
              view: this.context.getCurrentTexture().createView(),
              loadOp: "load",
              clearValue: { r: 0, g: 0, b: 0.4, a: 1.0 },
              storeOp: "store",
            },
          ],
        });
        pass.setPipeline(this.pipeline);
        pass.setVertexBuffer(0, mesh.vertexBuffer);
        this.device.queue.writeBuffer(mesh.vertexBuffer, 0, mesh.vertices);

        pass.setBindGroup(0, this.bindGroup);
        this.device.queue.writeBuffer(
          this.uniformBuffer,
          0,
          new Float32Array(mesh.transform)
        );

        pass.draw(mesh.vertices.length / 2);
        pass.end();
      }
    }

    this.device.queue.submit([encoder.finish()]);
  }
}
