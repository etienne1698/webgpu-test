import { mat4, vec3 } from "gl-matrix";

export abstract class Mesh {
  abstract vertices: vec3[];

  transform = mat4.create();

  constructor(position: vec3) {
    this.translate(position);
  }

  translate(vector: vec3) {
    mat4.translate(this.transform, this.transform, vector);
  }

  rotateX(rad: number) {
    mat4.rotateX(this.transform, this.transform, rad);
  }

  rotateY(rad: number) {
    mat4.rotateY(this.transform, this.transform, rad);
  }

  rotateZ(rad: number) {
    mat4.rotateZ(this.transform, this.transform, rad);
  }

  scale(vector: vec3) {
    mat4.scale(this.transform, this.transform, vector);
  }
}
