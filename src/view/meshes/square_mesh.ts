import { vec3 } from "gl-matrix";
import { Mesh } from "../../models/mesh";

export class SquareMesh extends Mesh {
  vertices: vec3[] = [
    [-0.5, -0.5, 0], // top left
    [0.5, -0.5, 0], // bottom left
    [0.5, 0.5, 0], // bottom right
    [-0.5, -0.5, 0], // top left
    [0.5, 0.5, 0], // bottom right
    [-0.5, 0.5, 0], // top right
  ];
  
}
