import { vec2, vec3 } from "gl-matrix";

export abstract class Geometry {
  vertices: vec3[] = [];
  uvMap: vec2[] = [];
}
