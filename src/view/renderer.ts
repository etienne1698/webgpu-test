import { vec3 } from "gl-matrix";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import shaderCode from "./shaders/shader.wgsl?raw";

export class Renderer {
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;

  pipeline!: GPURenderPipeline;
  vertexBufferLayout = {
    arrayStride: 12 + 16,
    attributes: [
      {
        format: "float32x3" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
      },
      {
        format: "float32x4" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 1, // Position. Matches @location(0) in the @vertex shader.
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
      code: shaderCode,
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

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes.values()) {
        const cameraBuffer = this.device.createBuffer({
          size: 64,
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
                  buffer: cameraBuffer,
                },
              },
            ],
          })
        );

        this.device.queue.writeBuffer(
          cameraBuffer,
          0,
          new Float32Array(camera.viewProjectionMatrix)
        );

        const vertexData = mesh.vertices
          .map((v, index) => [v[0], v[1], v[2], ...mesh.verticiesColors[index]])
          .flat();

        const vertexBuffer = this.device.createBuffer({
          label: "Mesh vertices",
          size: 4 * vertexData.length,
          usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
        });

        this.device.queue.writeBuffer(
          vertexBuffer,
          0,
          new Float32Array(vertexData)
        );
        pass.setVertexBuffer(0, vertexBuffer);

        pass.draw(mesh.vertices.length);
      }
    }

    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
