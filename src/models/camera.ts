import { mat4, vec3 } from "gl-matrix";
import { degeesToRadiant } from "../helpers/math";

export class Camera {
  view: mat4 = mat4.create();
  projection: mat4 = mat4.create();

  constructor() {
    this.projection = mat4.perspective(
      this.projection,
      degeesToRadiant(45),
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }

  translate(v: vec3) {
    mat4.translate(this.view, this.view, v);
  }

  rotateX(rad: number) {
    mat4.rotateX(this.view, this.view, rad);
  }

  rotateY(rad: number) {
    mat4.rotateY(this.view, this.view, rad);
  }

  rotateZ(rad: number) {
    mat4.rotateZ(this.view, this.view, rad);
  }

  get viewProjectionMatrix() {
    return mat4.multiply(mat4.create(), this.projection, this.view);
  }
}
