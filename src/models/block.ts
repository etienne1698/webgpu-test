import { Mesh } from "./mesh";

export class Block {
  constructor(public meshes: Mesh[]) {
    this.meshes = meshes;
  }
}
