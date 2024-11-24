import { mat4, vec3, vec4 } from "gl-matrix";

export class Frustum {
  planes: vec4[] = [];

  constructor(viewProjectionMatrix: mat4) {
    this.extractPlanes(viewProjectionMatrix);
  }

  extractPlanes(viewProjectionMatrix: mat4) {
    const m = viewProjectionMatrix;
    this.planes = [
      vec4.fromValues(m[3] + m[0], m[7] + m[4], m[11] + m[8], m[15] + m[12]), // Left
      vec4.fromValues(m[3] - m[0], m[7] - m[4], m[11] - m[8], m[15] - m[12]), // Right
      vec4.fromValues(m[3] + m[1], m[7] + m[5], m[11] + m[9], m[15] + m[13]), // Bottom
      vec4.fromValues(m[3] - m[1], m[7] - m[5], m[11] - m[9], m[15] - m[13]), // Top
      vec4.fromValues(m[3] + m[2], m[7] + m[6], m[11] + m[10], m[15] + m[14]), // Near
      vec4.fromValues(m[3] - m[2], m[7] - m[6], m[11] - m[10], m[15] - m[14]), // Far
    ];

    for (let i = 0; i < this.planes.length; i++) {
      const length = Math.sqrt(
        this.planes[i][0] ** 2 + this.planes[i][1] ** 2 + this.planes[i][2] ** 2
      );
      vec4.scale(this.planes[i], this.planes[i], 1 / length);
    }
  }

  isSphereIn(
    center: vec3,
    radius: number,
  ): boolean {
    for (const plane of this.planes) {
      const distance =
        vec3.dot(center, [plane[0], plane[1], plane[2]]) + plane[3];
      if (distance < -radius) {
        return false;
      }
    }
    return true;
  }
}
