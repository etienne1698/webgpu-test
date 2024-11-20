import { vec4 } from "gl-matrix";

export const colors: { [color: string]: vec4 } = {
  red: [1, 0, 0, 1],
  purple: [1, 0, 1, 1],
};

export function randomColor(): vec4 {
  return [Math.random(), Math.random(), Math.random(), 1];
}