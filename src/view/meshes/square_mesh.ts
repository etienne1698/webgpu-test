import { Mesh } from "../../models/mesh";

export class SquareMesh extends Mesh {
  vertexBuffer!: GPUBuffer;
  vertices = new Float32Array([
    -0.4, -0.4, 0.4, -0.4, 0.4, 0.4,

    -0.4, -0.4, 0.4, 0.4, -0.4, 0.4,
  ]);
  

  async init(device: GPUDevice) {
    this.vertexBuffer = device.createBuffer({
      label: "Cell vertices",
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }
}
