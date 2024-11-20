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

  rotateX(rad: number) {
    for (const mesh of this.meshes) {
      mesh.rotateX(rad);
    }
  }

  rotateY(rad: number) {
    for (const mesh of this.meshes) {
      mesh.rotateY(rad);
    }
  }

  rotateZ(rad: number) {
    for (const mesh of this.meshes) {
      mesh.rotateZ(rad);
    }
  }

  scale(s: vec3 | number) {
    for (const mesh of this.meshes) {
      mesh.scale(typeof s === "number" ? [s, s, s] : s);
    }
  }
}
