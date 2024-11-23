import { vec3 } from "gl-matrix";

export abstract class Geometry {
  constructor(public vertices: vec3[]) {}
}
