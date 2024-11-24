import { vec2, vec3 } from "gl-matrix";
import { Geometry } from "../models/geometry";

export class CubeGeometry extends Geometry {
  vertices: vec3[] = [
    [-1, -1, 1],
    [1, -1, 1],
    [1, 1, 1],
    [-1, -1, 1],
    [1, 1, 1],
    [-1, 1, 1],

    [-1, -1, -1],
    [-1, 1, -1],
    [1, 1, -1],
    [-1, -1, -1],
    [1, 1, -1],
    [1, -1, -1],

    [-1, -1, -1],
    [-1, -1, 1],
    [-1, 1, 1],
    [-1, -1, -1],
    [-1, 1, 1],
    [-1, 1, -1],

    [1, -1, -1],
    [1, 1, 1],
    [1, -1, 1],
    [1, -1, -1],
    [1, 1, -1],
    [1, 1, 1],

    [-1, 1, -1],
    [-1, 1, 1],
    [1, 1, 1],
    [-1, 1, -1],
    [1, 1, 1],
    [1, 1, -1],

    [-1, -1, -1],
    [1, -1, 1],
    [-1, -1, 1],
    [-1, -1, -1],
    [1, -1, -1],
    [1, -1, 1],
  ];

  uvMap: vec2[] = [
    // FRONT
    [0, 0],
    [0, 0.5],
    [0.5, 0],
    [0, 0],
    [0, 0.5],
    [0.5, 0],

    // BACK
    [0, 0],
    [0, 0.5],
    [0.5, 0],
    [0, 0],
    [0, 0.5],
    [0.5, 0],

    //LEFT
    [0.51, 0.51],
    [0.51, 1],
    [1, 0.51],
    [0.51, 0.51],
    [0.51, 1],
    [1, 0.51],

    // RIGHT
    [0, 0.51],
    [0.51, 0.51],
    [0.51, 1],
    [0, 0.51],
    [0.51, 0.51],
    [0.5, 1],

    // TOP
    [0.5, 0],
    [1, 0],
    [1, 0.5],
    [0.5, 0],
    [1, 0],
    [1, 0.5],

    // BOTTOM
    [0.5, 0],
    [1, 0],
    [1, 0.5],
    [0.5, 0],
    [1, 0],
    [1, 0.5],
  ];
}