import { Control } from "../nodes/control";
import { Node } from "../models/node";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import { Ray } from "../models/ray";

type ClickControlAction = (node: Node, event: MouseEvent) => void;

export class ClickControl extends Control {
  onClick: ClickControlAction = () => {};

  constructor(onClick: ClickControlAction) {
    super();
    this.onClick = onClick;

    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.onClick) return;

    const canvasRect = this.canvas.getBoundingClientRect();
    const normalizedX =
      ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const normalizedY = -(
      ((e.clientY - canvasRect.top) / canvasRect.height) * 2 -
      1
    );
    const ray = Ray.fromCamera([normalizedX, normalizedY], this.camera);

    this.scene.traverseTree((node) => {
      if (ray.isIntersect(node)) {
        this.onClick(node.parent!, e);
      }
    });
  }

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.connect(scene, camera, canvas);
    this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
  }

  async disconnect() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  update() {}
}
