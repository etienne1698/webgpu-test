import { mat4, vec3 } from "gl-matrix";
import { Node } from "../models/node";

export abstract class Node3D extends Node {
  transform: mat4 = mat4.create();

  translate(translation: vec3) {
    mat4.translate(this.transform, this.transform, translation);
    if (this.children) {
      this.children.forEach((node) => {
        if (!(node instanceof Node3D)) return;
        node.translate(translation);
      });
    }
  }
}
