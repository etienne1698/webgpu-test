import { mat4 } from "gl-matrix";
import { Mesh } from "../models/mesh";
import { Node3D } from "./node_3d";

export type MeshInstanceOptions = {
  mesh: Mesh;
  transform?: mat4;
};

export class MeshInstance extends Node3D {
  mesh!: Mesh;

  constructor(options: MeshInstanceOptions) {
    super();
    Object.assign(this, options);
  }
}
