import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import shaderCode from "../shaders/shader.wgsl?raw";
import { Renderer } from "../models/renderer";
import { MeshInstance } from "../nodes/mesh_instance";

export class Webgpu3DRenderer extends Renderer {
  device!: GPUDevice;
  context!: GPUCanvasContext;
  cameraBuffer!: GPUBuffer;

  depthTexture!: GPUTexture;
  multisampleTexture!: GPUTexture;
  pipeline!: GPURenderPipeline;
  vertexBufferLayout = {
    arrayStride: 12 + 16 + 64,
    attributes: [
      {
        format: "float32x3" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 0,
      },
      {
        format: "float32x4" as GPUVertexFormat,
        offset: 12,
        shaderLocation: 1,
      },
      {
        format: "float32x4", // Matrice - Ligne 1
        offset: 28,
        shaderLocation: 2,
      },
      {
        format: "float32x4", // Matrice - Ligne 2
        offset: 44,
        shaderLocation: 3,
      },
      {
        format: "float32x4", // Matrice - Ligne 3
        offset: 60,
        shaderLocation: 4,
      },
      {
        format: "float32x4", // Matrice - Ligne 4
        offset: 76,
        shaderLocation: 5,
      },
    ],
  };

  constructor(canvas: HTMLCanvasElement) {
    super(canvas);
  }

  async init() {
    if (!navigator.gpu) {
      throw new Error("WebGPU not supported on this browser.");
    }

    const adapter = await navigator.gpu.requestAdapter();
    if (!adapter) {
      throw new Error("No appropriate GPUAdapter found.");
    }

    this.device = await adapter.requestDevice();

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
      label: "Cell pipeline",
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
        ],
      })
    );

    this.device.queue.writeBuffer(
      this.cameraBuffer,
      0,
      new Float32Array(camera.viewProjectionMatrix)
    );

    const vertexData: number[] = [];
    let verticesLength = 0;

    scene.traverseNodeTree((node) => {
      if (!(node instanceof MeshInstance)) return;
      for (const [i, v] of node.mesh.vertices.entries()) {
        verticesLength++;
        vertexData.push(...v);
        vertexData.push(...node.mesh.verticiesColors[i]);
        vertexData.push(...node.transform);
      }
    });
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

    pass.draw(verticesLength);

    pass.end();

    this.device.queue.submit([encoder.finish()]);
  }
}
