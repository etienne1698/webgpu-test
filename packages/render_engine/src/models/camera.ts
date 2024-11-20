import { mat4, vec3 } from "gl-matrix";
import { degeesToRadiant } from "../helpers/math";

export class Camera {
  view: mat4 = mat4.create();
  projection: mat4 = mat4.create();

  constructor() {
    this.projection = mat4.perspective(
      this.projection,
      degeesToRadiant(25),
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
  }

  translate(v: vec3) {
    /*   const rotation = this.getRotation();
    const direction = this.getDirection();
    
    console.error("rotation", ...Object.values(rotation));
    console.error("direction", ...Object.values(direction)); 

    // TODO: translate should take in account the anglesNormalized
    const t: vec3 = [v[0] * (direction[1] - direction[2]), v[1], v[2]];
    mat4.translate(this.view, this.view, t); */

    mat4.translate(this.view, this.view, v);
  }

  getDirection(): vec3 {
    return [
      -this.view[8], // m31
      -this.view[9], // m32
      -this.view[10], // m33
    ];
  }
  getRotation(): vec3 {
    const rotationX = Math.atan2(-this.view[6], this.view[10]);
    const rotationY = Math.atan2(this.view[2], this.view[0]);
    const rotationZ = Math.atan2(this.view[4], this.view[0]);
    return [rotationX, rotationY, rotationZ];
  }

  getPosition() {
    return mat4.getTranslation([0, 0, 0], this.view);
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
    return mat4.multiply(
      mat4.create(),
      this.projection,
      mat4.invert(mat4.create(), this.view)
    );
  }
}
