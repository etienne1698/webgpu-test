import { vec3, vec4, mat4 } from "gl-matrix";
import { Camera } from "../models/camera";

export const degeesToRadiant = (deg: number) => deg * (Math.PI / 180);
export const radiantToDegrees = (rad: number) => (rad / Math.PI) * 180;

export function isEqual(var1: any, var2: any): boolean {
  if (var1 == null || var2 == null) return var1 == var2;
  if (typeof var1 != typeof var2) return false;
  if (
    typeof var1 === "string" ||
    typeof var1 === "boolean" ||
    typeof var1 === "number" ||
    typeof var1 === "bigint" ||
    typeof var1 === "undefined"
  ) {
    return var1 === var2;
  }
  if (typeof var1 === "object") {
    return Object.entries(var1).reduce((prev, [key, value]) => {
      return prev && isEqual(value, var2[key]);
    }, true);
  }
  return false;
}
