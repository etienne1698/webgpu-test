import { mat4, vec2, vec3 } from "gl-matrix";

export class Geometry {
  vertices: vec3[] = [];
  uvMap: vec2[] = [];

  constructor() {
    this.computeBoundingSphere();
  }

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

  getTransformedBoundingSphere(transform: mat4) {
    if (!this.boundingSphere) {
      this.computeBoundingSphere();
    }
    const center = vec3.add(
      vec3.create(),
      this.boundingSphere!.center,
      mat4.getTranslation(vec3.create(), transform)
    );

    /* const scaleX = vec3.length([transform[0], transform[1], transform[2]]);
    const scaleY = vec3.length([transform[4], transform[5], transform[6]]);
    const scaleZ = vec3.length([transform[8], transform[9], transform[10]]);
    const maxScale = Math.max(scaleX, scaleY, scaleZ);

    const radius = this.boundingSphere!.radius * maxScale;
  */
    return { center, radius: this.boundingSphere!.radius };
  }
}
