import { Control } from "../nodes/control";
import { Node } from "../models/node";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import { Ray } from "../models/ray";
import { vec3 } from "gl-matrix";
import { Mesh } from "../main";

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
    const intersectedNodes: { node: Node; distance: number }[] = [];

    this.scene.traverseTree((node) => {
      if (ray.isIntersect(node)) {
        if (!(node.parent instanceof Mesh)) return;
        const distance = vec3.distance(
          this.camera.getPosition(),
          vec3.transformMat4(vec3.create(), [0, 0, 0], node.parent.transform)
        );

        intersectedNodes.push({ node: node.parent, distance });
      }
    });
    if (intersectedNodes.length > 0) {
      const closestNode = intersectedNodes.reduce((closest, current) =>
        current.distance < closest.distance ? current : closest
      );

      this.onClick(closestNode.node, e);
    }
  }

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement, node: Node) {
    super.connect(scene, camera, canvas, node);
    this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
  }

  async disconnect() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  update() {}
}
