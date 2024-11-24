import { vec2, vec3 } from "gl-matrix";

export class Geometry {
  vertices: vec3[] = [];
  uvMap: vec2[] = [];

  boundingSphere?: { center: vec3; radius: number };

  computeBoundingSphere(): { center: vec3; radius: number } {
    const center: vec3 = [0, 0, 0];
    for (const v of this.vertices) {
      vec3.add(center, center, v);
    }
    vec3.scale(center, center, 1 / this.vertices.length);

    let radius = 0;
    for (const v of this.vertices) {
      const dist = vec3.distance(center, v);
      if (dist > radius) {
        radius = dist;
      }
    }

    this.boundingSphere = { center, radius };
    return this.boundingSphere;
  }
}
