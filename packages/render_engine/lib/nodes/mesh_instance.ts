import { mat4, vec3 } from "gl-matrix";
import { Mesh } from "../models/mesh";
import { Node } from "../models/node";

export type MeshInstanceOptions = {
  mesh: Mesh;
  transform?: mat4;
};

export class MeshInstance extends Node {
  mesh!: Mesh;
  transform: mat4 = mat4.create();
  

  constructor(options: MeshInstanceOptions) {
    super();
    Object.assign(this, options);
  }

  computeAABB(): { boxMin: vec3; boxMax: vec3 } {
    if (!this.mesh) throw new Error("No mesh, cannot compute");
    const boxMin: vec3 = [Infinity, Infinity, Infinity];
    const boxMax: vec3 = [-Infinity, -Infinity, -Infinity];

    for (const vertex of this.mesh.vertices) {
      const vertexTransformed = vec3.transformMat4(
        vec3.create(),
        vertex,
        this.transform
      );
      for (let i = 0; i < 3; i++) {
        // X, Y, Z
        boxMin[i] = Math.min(boxMin[i], vertexTransformed[i]);
        boxMax[i] = Math.max(boxMax[i], vertexTransformed[i]);
      }
    }

    return { boxMin, boxMax };
  }

  translate(translation: vec3) {
    mat4.translate(this.transform, this.transform, translation);
    if (this.children) {
      this.children.forEach((node) => {
        if (!(node instanceof MeshInstance)) return;
        node.translate(translation)
      });
    }
  }
}
