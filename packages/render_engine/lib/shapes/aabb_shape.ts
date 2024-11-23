import { vec3 } from "gl-matrix";
import { Shape } from "../nodes/shape";
import { MeshInstance } from "../nodes/mesh_instance";
import { Ray } from "../main";

export class AABBShape extends Shape {
  computeAABB(): { boxMin: vec3; boxMax: vec3 } {
    if (!this.parent || !(this.parent instanceof MeshInstance))
      throw new Error("parent is not MeshInstance");

    const boxMin: vec3 = [Infinity, Infinity, Infinity];
    const boxMax: vec3 = [-Infinity, -Infinity, -Infinity];

    for (const vertex of this.parent.mesh.vertices) {
      const vertexTransformed = vec3.transformMat4(
        vec3.create(),
        vertex,
        this.parent.transform
      );
      for (let i = 0; i < 3; i++) {
        // X, Y, Z
        boxMin[i] = Math.min(boxMin[i], vertexTransformed[i]);
        boxMax[i] = Math.max(boxMax[i], vertexTransformed[i]);
      }
    }

    return { boxMin, boxMax };
  }

  isRayIntersect(ray: Ray): boolean {
    if (!ray.origin || !ray.direction) return false;
    const { boxMin, boxMax } = this.computeAABB();

    let tmin = (boxMin[0] - ray.origin[0]) / ray.direction[0];
    let tmax = (boxMax[0] - ray.origin[0]) / ray.direction[0];
    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (boxMin[1] - ray.origin[1]) / ray.direction[1];
    let tymax = (boxMax[1] - ray.origin[1]) / ray.direction[1];
    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if (tmin > tymax || tymin > tmax) return false;
    tmin = Math.max(tmin, tymin);
    tmax = Math.min(tmax, tymax);

    let tzmin = (boxMin[2] - ray.origin[2]) / ray.direction[2];
    let tzmax = (boxMax[2] - ray.origin[2]) / ray.direction[2];
    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if (tmin > tzmax || tzmin > tmax) return false;
    return true;
  }
}
