import { vec3 } from "gl-matrix";
import { Mesh } from "./mesh";

export class Block {
  constructor(public meshes: Mesh[]) {
    this.meshes = meshes;
  }

  translate(vector: vec3) {
    this.meshes.forEach((mesh) => {
      mesh.translate(vector);
    });
  }
}
