import { vec4 } from "gl-matrix";

export function randomVec4RGBAColor(): vec4 {
  return [Math.random() * 255, Math.random() * 255, Math.random() * 255, 255];
}

export const colorsRGBA = {
  black: [0, 0, 0, 255],
  white: [255, 255, 255, 255],
};
