import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Renderer {
  adapter!: GPUAdapter;
  device!: GPUDevice;
  context!: GPUCanvasContext;

  constructor(public canvas: HTMLCanvasElement) {}

  
  abstract render(scene: Scene, camera: Camera): Promise<void>;

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
  }
}
