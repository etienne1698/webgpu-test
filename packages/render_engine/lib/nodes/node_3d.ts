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

  rotateZ(rad: number) {
    mat4.rotateZ(this.transform, this.transform, rad);
    if (this.children) {
      this.children.forEach((node) => {
        if (!(node instanceof Node3D)) return;
        node.rotateZ(rad);
      });
    }
  }
  rotateX(rad: number) {
    mat4.rotateX(this.transform, this.transform, rad);
    if (this.children) {
      this.children.forEach((node) => {
        if (!(node instanceof Node3D)) return;
        node.rotateX(rad);
      });
    }
  }
  rotateY(rad: number) {
    mat4.rotateY(this.transform, this.transform, rad);
    if (this.children) {
      this.children.forEach((node) => {
        if (!(node instanceof Node3D)) return;
        node.rotateY(rad);
      });
    }
  }
}
