import { Camera } from "./camera";
import { Control } from "../nodes/control";
import { Node } from "./node";

export class Scene extends Node {
  connectControls(camera: Camera, canvas: HTMLCanvasElement) {
    this.children.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.connect(this, camera, canvas);
    });
  }

  disconnectControls() {
    this.children.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.disconnect();
    });
  }

  update() {
    this.children.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.update();
    });
  }
}
