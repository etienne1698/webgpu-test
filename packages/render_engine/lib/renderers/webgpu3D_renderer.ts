import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import shaderCode from "../shaders/shader.wgsl?raw";
import { Renderer } from "../models/renderer";
import { Mesh } from "../nodes/mesh";

export class Webgpu3DRenderer extends Renderer {
  context!: GPUCanvasContext;
  cameraBuffer!: GPUBuffer;

  depthTexture!: GPUTexture;
  multisampleTexture!: GPUTexture;

  pipeline!: GPURenderPipeline;

  vertexBufferLayout = {
    arrayStride: 12 + 8,
    attributes: [
      {
        format: "float32x3" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 0,
      },
      {
        format: "float32x2" as GPUVertexFormat,
        offset: 12,
        shaderLocation: 1,
      },
    ],
  };

  constructor(public device: GPUDevice, public canvas: HTMLCanvasElement) {
    super();
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
      code: shaderCode,
    });

    this.multisampleTexture = this.device.createTexture({
      format: this.context.getCurrentTexture().format,
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      size: [
        this.context.getCurrentTexture().width,
        this.context.getCurrentTexture().height,
      ],
      sampleCount: 4,
    });

    this.depthTexture = this.device.createTexture({
      size: [
        this.context.getCurrentTexture().width,
        this.context.getCurrentTexture().height,
      ],
      format: "depth24plus",
      usage: GPUTextureUsage.RENDER_ATTACHMENT,
      sampleCount: 4,
    });

    this.pipeline = this.device.createRenderPipeline({
      label: "pipeline",
      depthStencil: {
        format: "depth24plus",
        depthWriteEnabled: true,
        depthCompare: "less",
      },
      multisample: {
        count: 4,
      },
      layout: this.device.createPipelineLayout({
        label: "vertexLayout",
        bindGroupLayouts: [
          this.device.createBindGroupLayout({
            label: "Bind Group Layout",
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
              {
                binding: 2,
                visibility: GPUShaderStage.FRAGMENT,
                sampler: {},
              },
              {
                binding: 3,
                visibility: GPUShaderStage.FRAGMENT,
                texture: {},
              },
            ],
          }),
        ],
      }),
      vertex: {
        module: shaderModule,
        entryPoint: "main",
        buffers: [this.vertexBufferLayout as GPUVertexBufferLayout],
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fragmentMain",
        targets: [
          {
            format: canvasFormat,
            blend: undefined,
          },
        ],
      },
      primitive: {
        cullMode: "back",
      },
    });

    this.cameraBuffer = this.device.createBuffer({
      size: 64,
      usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
    });
  }

  static async getDefaultDevice() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No appropriate GPUAdapter found.");
    }

    return await adapter.requestDevice();
  }

  async render(scene: Scene, camera: Camera) {
    const encoder = this.device.createCommandEncoder();

    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          view: this.multisampleTexture.createView(),
          loadOp: "clear",
          clearValue: { r: 115 / 255, g: 186 / 255, b: 194 / 255, a: 1.0 },
          storeOp: "store",
          resolveTarget: this.context.getCurrentTexture().createView(),
        },
      ],
      depthStencilAttachment: {
        view: this.depthTexture.createView(),
        depthLoadOp: "clear",
        depthClearValue: 1.0, // Z maximum (le plus loin)
        depthStoreOp: "store",
      },
    });
    pass.setPipeline(this.pipeline);

    this.device.queue.writeBuffer(
      this.cameraBuffer,
      0,
      new Float32Array(camera.viewProjectionMatrix)
    );

    scene.traverseNodeTree((node) => {
      if (!(node instanceof Mesh)) return;
      if (!node.material.isVisible) return;
      if (!node.geometry.vertices) return;

      const vertexData: number[] = [];
      let verticesLength = 0;

      for (const [i, v] of node.geometry.vertices.entries()) {
        verticesLength++;
        vertexData.push(...v);
        vertexData.push(...node.geometry.uvMap[i]);
      }
      const vertexBuffer = this.device.createBuffer({
        label: "Geometry vertices",
        size: 4 * vertexData.length,
        usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
      });

      const meshBuffer = this.device.createBuffer({
        size: 64,
        usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
      });

      const texture = this.device.createTexture({
        label: "node texture",
        size: [node.material.texture.width, node.material.texture.height],
        format: "rgba8unorm",
        usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST,
      });

      const sampler = this.device.createSampler({});

      this.device.queue.writeTexture(
        { texture },
        node.material.texture.data,
        { bytesPerRow: node.material.texture.width * 4 },
        {
          width: node.material.texture.width,
          height: node.material.texture.height,
        }
      );

      pass.setBindGroup(
        0,
        this.device.createBindGroup({
          layout: this.pipeline.getBindGroupLayout(0),
          entries: [
            {
              binding: 0,
              resource: {
                buffer: this.cameraBuffer,
              },
            },
            {
              binding: 1,
              resource: {
                buffer: meshBuffer,
              },
            },
            { binding: 2, resource: sampler },
            { binding: 3, resource: texture.createView() },
          ],
        })
      );

      this.device.queue.writeBuffer(
        meshBuffer,
        0,
        new Float32Array(node.transform)
      );

      this.device.queue.writeBuffer(
        vertexBuffer,
        0,
        new Float32Array(vertexData)
      );
      pass.setVertexBuffer(0, vertexBuffer);

      pass.draw(verticesLength);
    });

    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
