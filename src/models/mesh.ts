import { mat4, vec3 } from "gl-matrix";

export abstract class Mesh {
  abstract vertices: vec3[];

  constructor(position: vec3) {
    setTimeout(() => {
      this.translate(position);
    }, 0);
  }

  computeAABB(): { boxMin: vec3; boxMax: vec3 } {
    const boxMin: vec3 = [Infinity, Infinity, Infinity];
    const boxMax: vec3 = [-Infinity, -Infinity, -Infinity];
  
    for (const vertex of this.vertices) {
      for (let i = 0; i < 3; i++) { // X, Y, Z
        boxMin[i] = Math.min(boxMin[i], vertex[i]);
        boxMax[i] = Math.max(boxMax[i], vertex[i]);
      }
    }
  
    return { boxMin, boxMax };
  }

  translate(vector: vec3) {
    const m = mat4.translate(mat4.create(), mat4.create(), vector);
    this.vertices.forEach((v) => {
      vec3.transformMat4(v, v, m);
    });
  }

  rotateX(rad: number) {
    const m = mat4.rotateX(mat4.create(), mat4.create(), rad);
    this.vertices.forEach((v) => {
      vec3.transformMat4(v, v, m);
    });
  }

  rotateY(rad: number) {
    const m = mat4.rotateY(mat4.create(), mat4.create(), rad);
    this.vertices.forEach((v) => {
      vec3.transformMat4(v, v, m);
    });
  }

  rotateZ(rad: number) {
    const m = mat4.rotateZ(mat4.create(), mat4.create(), rad);
    this.vertices.forEach((v) => {
      vec3.transformMat4(v, v, m);
    });
  }

  scale(vector: vec3) {
    const m = mat4.scale(mat4.create(), mat4.create(), vector);
    this.vertices.forEach((v) => {
      vec3.transformMat4(v, v, m);
    });
  }
}
