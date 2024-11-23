import { mat4, vec2, vec3, vec4 } from "gl-matrix";
import { Node } from "./node";
import { Camera } from "./camera";
import { Shape } from "../nodes/shape";

export class Ray {
  origin?: vec3;
  direction?: vec3;

  isIntersect(node: Node): boolean {
    if (!(node instanceof Shape)) return false;
    return node.isRayIntersect(this);
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
    const r = new Ray();
    r.setFromCamera(coords, camera);
    return r;
  }
}
