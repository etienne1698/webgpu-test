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
}
