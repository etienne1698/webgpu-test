import { vec4 } from "gl-matrix";

export function randomVec4RGBAColor(): vec4 {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255];
}