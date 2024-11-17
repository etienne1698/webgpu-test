import { mat4 } from "gl-matrix";

export abstract class Mesh {
  abstract vertexBuffer: GPUBuffer;
  abstract vertexBufferLayout: GPUVertexBufferLayout;
  abstract vertices: Float32Array;

  constructor(public transform: mat4 = mat4.create()) {
    this.transform = transform;
  }

  abstract init(device: GPUDevice): Promise<void>;
}
