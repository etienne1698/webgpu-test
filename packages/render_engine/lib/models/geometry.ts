import { vec3, vec4 } from "gl-matrix";
import { colors } from "../helpers/vec4_colots";

export abstract class Geometry {
  constructor(
    public vertices: vec3[],
    public colors: vec4[] = [[0, 0, 0, 0]]
  ) {}

  get verticiesColors() {
    if (this.colors.length === 1) {
      return this.vertices.map(() => this.colors[0]);
    }
    if (this.colors.length == this.vertices.length) {
      return this.colors;
    }
    return this.vertices.map(() => colors.red);
  }
}
