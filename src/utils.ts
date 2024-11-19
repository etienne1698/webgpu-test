export const degeesToRadiant = (deg: number) => deg * (Math.PI / 180);

import { vec3, vec4, mat4 } from "gl-matrix";
import { Camera } from "./models/camera";

export function getRayFromMouse(
  x: number,
  y: number,
  canvas: HTMLCanvasElement,
  camera: Camera
) {

  const canvasRect = canvas.getBoundingClientRect();
  const normalizedX = ((x - canvasRect.left) / canvasRect.width) * 2 - 1;
  const normalizedY = -(((y - canvasRect.top) / canvasRect.height) * 2 - 1);
  
  // Convertir en espace de vue
  const inverseProjectionView = camera.viewProjectionMatrix;
  mat4.invert(inverseProjectionView, inverseProjectionView);

  const nearPoint = vec4.fromValues(normalizedX, normalizedY, -1.0, 1.0);
  const farPoint = vec4.fromValues(normalizedX, normalizedY, 1.0, 1.0);

  vec4.transformMat4(nearPoint, nearPoint, inverseProjectionView);
  vec4.transformMat4(farPoint, farPoint, inverseProjectionView);

  // Passer en coordonnées homogènes
  vec3.scale(nearPoint, nearPoint, 1 / nearPoint[3]);
  vec3.scale(farPoint, farPoint, 1 / farPoint[3]);

  return {
    origin: nearPoint as vec3,
    direction: vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), farPoint, nearPoint)
    ),
  };
}

export function isRayIntersectsBox(
  rayOrigin: vec3,
  rayDirection: vec3,
  boxMin: vec3,
  boxMax: vec3
): boolean {
  let tmin = (boxMin[0] - rayOrigin[0]) / rayDirection[0];
  let tmax = (boxMax[0] - rayOrigin[0]) / rayDirection[0];
  if (tmin > tmax) [tmin, tmax] = [tmax, tmin];

  let tymin = (boxMin[1] - rayOrigin[1]) / rayDirection[1];
  let tymax = (boxMax[1] - rayOrigin[1]) / rayDirection[1];
  if (tymin > tymax) [tymin, tymax] = [tymax, tymin];

  if (tmin > tymax || tymin > tmax) return false;
  tmin = Math.max(tmin, tymin);
  tmax = Math.min(tmax, tymax);

  let tzmin = (boxMin[2] - rayOrigin[2]) / rayDirection[2];
  let tzmax = (boxMax[2] - rayOrigin[2]) / rayDirection[2];
  if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];

  if (tmin > tzmax || tzmin > tmax) return false;
  return true;
}
