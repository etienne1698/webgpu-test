import { vec3 } from "gl-matrix";
import { Mesh } from "../models/mesh";

export class SquareMesh extends Mesh {
  vertices: vec3[] = [
    [-0.5, -0.5, 0],
    [0.5, -0.5, 0],
    [0.5, 0.5, 0],
    
    [-0.5, -0.5, 0],
    [0.5, 0.5, 0],
    [-0.5, 0.5, 0],
  ];
}
