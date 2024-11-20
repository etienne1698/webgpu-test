import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

type ClickControlAction = (block: Block, mesh: Mesh, event: MouseEvent) => void;

export class ClickControl extends Control {
  onClick?: ClickControlAction = () => {};

  constructor(onClick: ClickControlAction) {
    super();
    this.onClick = onClick;

    this.handleMouseUp = this.handleMouseUp.bind(this);
  }

  private handleMouseUp(e: MouseEvent) {
    if (!this.onClick) return;
    const ray = getRayFromMouse(e.clientX, e.clientY, this.canvas, this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        const { boxMin, boxMax } = mesh.computeAABB();
        if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
          this.onClick(block, mesh, e);
        }
      }
    }
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
  }

  async destroy() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUp, false);
  }

  update() {}
}
