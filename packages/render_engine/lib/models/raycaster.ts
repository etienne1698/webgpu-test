import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Camera } from "./camera";
import { Node } from "./node";

export class Raycaster {
  origin?: vec3;
  direction?: vec3;

  isRayIntersect(node: Node): boolean {
    if (!this.origin || !this.direction) return false;
    const { boxMin, boxMax } = node.computeAABB();

    let tmin = (boxMin[0] - this.origin[0]) / this.direction[0];
    let tmax = (boxMax[0] - this.origin[0]) / this.direction[0];
    if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

    let tymin = (boxMin[1] - this.origin[1]) / this.direction[1];
    let tymax = (boxMax[1] - this.origin[1]) / this.direction[1];
    if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

    if (tmin > tymax || tymin > tmax) return false;
    tmin = Math.max(tmin, tymin);
    tmax = Math.min(tmax, tymax);

    let tzmin = (boxMin[2] - this.origin[2]) / this.direction[2];
    let tzmax = (boxMax[2] - this.origin[2]) / this.direction[2];
    if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

    if (tmin > tzmax || tzmin > tmax) return false;
    return true;
  }

  /**
   *
   * @param coords normalized coords on -1 1
   * @param camera
   * @returns
   */
  setFromCamera(coords: vec2, camera: Camera) {
    const [normalizedX, normalizedY] = coords;

    /* const normalizedX = ((x - canvasRect.left) / canvasRect.width) * 2 - 1;
    const normalizedY = -(((y - canvasRect.top) / canvasRect.height) * 2 - 1); */

    // Convertir en espace de vue
    const inverseProjectionView = camera.viewProjectionMatrix;
    mat4.invert(inverseProjectionView, inverseProjectionView);

    const nearPoint = vec4.fromValues(normalizedX, normalizedY, -1.0, 1.0);
    const farPoint = vec4.fromValues(normalizedX, normalizedY, 1.0, 1.0);

    vec4.transformMat4(nearPoint, nearPoint, inverseProjectionView);
    vec4.transformMat4(farPoint, farPoint, inverseProjectionView);

    // Passer en coordonnées homogènes
    // @ts-ignore
    vec3.scale(nearPoint, nearPoint, 1 / nearPoint[3]);
    // @ts-ignore
    vec3.scale(farPoint, farPoint, 1 / farPoint[3]);

    this.origin = nearPoint as vec3;
    this.direction = vec3.normalize(
      vec3.create(),
      // @ts-ignore
      vec3.subtract(vec3.create(), farPoint, nearPoint)
    );
  }

  static fromCamera(coords: vec2, camera: Camera) {
    const r = new Raycaster();
    r.setFromCamera(coords, camera);
    return r;
  }
}
