import { Mesh } from "../../models/mesh";

export class SquareMesh extends Mesh {
  vertexBuffer!: GPUBuffer;
  vertices = new Float32Array([
    -0.4, -0.4, 0.4, -0.4, 0.4, 0.4,

    -0.4, -0.4, 0.4, 0.4, -0.4, 0.4,
  ]);
  vertexBufferLayout = {
    arrayStride: 8,
    attributes: [
      {
        format: "float32x2" as GPUVertexFormat,
        offset: 0,
        shaderLocation: 0, // Position. Matches @location(0) in the @vertex shader.
      },
    ],
  };

  async init(device: GPUDevice) {
    this.vertexBuffer = device.createBuffer({
      label: "Cell vertices",
      size: this.vertices.byteLength,
      usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
    });
  }
}
