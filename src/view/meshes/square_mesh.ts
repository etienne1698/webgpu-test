import { vec3 } from "gl-matrix";
import { Mesh } from "../../models/mesh";

export class SquareMesh extends Mesh {
  vertices: vec3[] = [
    [-1, -1, 0],
    [1, -1, 0],
    [1, 1, 0],
    
    [-1, -1, 0],
    [1, 1, 0],
    [-1, 1, 0],
  ];
}
