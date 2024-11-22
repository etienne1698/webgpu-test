import { Camera } from "./camera";
import { Control } from "../nodes/control";
import { Node } from "./node";

export class Scene {
  constructor(public nodes = new Map<string, Node>([])) {}

  traverseNodeTree(callback: (node: Node) => void) {
    for (const node of this.nodes.values()) {
      node.traverseTree(callback);
    }
  }

  connectControls(camera: Camera, canvas: HTMLCanvasElement) {
    this.nodes.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.connect(this, camera, canvas);
    });
  }

  disconnectControls() {
    this.nodes.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.disconnect();
    });
  }

  update() {
    this.nodes.forEach((node) => {
      if (!(node instanceof Control)) return;
      node.update();
    });
  }

  add(nodeName: string, node: Node) {
    this.nodes.set(nodeName, node);
  }

  remove(nodeName: string) {
    this.nodes.delete(nodeName);
  }

  get(nodeName: string) {
    return this.nodes.get(nodeName);
  }
}
