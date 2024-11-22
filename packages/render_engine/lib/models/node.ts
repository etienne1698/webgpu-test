import { vec3 } from "gl-matrix";
import { Mesh } from "./mesh";

export class Node {
  constructor(public mesh: Mesh) {}

  translate(vector: vec3) {
    this.mesh.translate(vector);
  }

  rotateX(rad: number) {
    this.mesh.rotateX(rad);
  }

  rotateY(rad: number) {
    this.mesh.rotateY(rad);
  }

  rotateZ(rad: number) {
    this.mesh.rotateZ(rad);
  }

  scale(s: vec3 | number) {
    this.mesh.scale(typeof s === "number" ? [s, s, s] : s);
  }
}
