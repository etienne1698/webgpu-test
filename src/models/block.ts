import { vec3 } from "gl-matrix";
import { Mesh } from "./mesh";

export class Block {
  constructor(public meshes: Mesh[]) {
    this.meshes = meshes;
  }

  translate(vector: vec3) {
    for (const mesh of this.meshes) {
      mesh.translate(vector);
    }
  }
}
