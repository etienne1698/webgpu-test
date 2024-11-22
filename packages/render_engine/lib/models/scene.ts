import { Camera } from "./camera";
import { Control } from "./control";
import { Node } from "./node";

export class Scene {
  constructor(
    public nodes = new Map<string, Node>([]),
    public controls: Control[] = []
  ) {}

  connectControls(camera: Camera, canvas: HTMLCanvasElement) {
    this.controls.forEach((control) => {
      control.connect(this, camera, canvas);
    });
  }

  disconnectControls() {
    this.controls.forEach((control) => {
      control.disconnect();
    });
  }

  update() {
    this.controls.forEach((control) => control.update());
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
