import { mat4 } from "gl-matrix";
import { Geometry } from "../models/geometry";
import { Node3D } from "./node_3d";

export type MeshOptions = {
  geometry: Geometry;
  transform?: mat4;
};

export class Mesh extends Node3D {
  geometry!: Geometry;

  constructor(options: MeshOptions) {
    super();
    Object.assign(this, options);
  }
}
