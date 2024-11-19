import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

export class MouseControl extends Control {
  onClick: (block: Block, mesh: Mesh) => void = () => {};
  pressed = false;

  handleClick(e: MouseEvent) {
    const ray = getRayFromMouse(e.clientX, e.clientY, this.canvas, this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        const { boxMin, boxMax } = mesh.computeAABB();
        if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
          this.onClick(block, mesh);
        }
      }
    }
  }

  handleMouseUp(e: MouseEvent) {
    this.handleClick(e);
    this.pressed = true;
  }

  handleMouseDown(e: MouseEvent) {
    this.pressed = false;
  }

  constructor({ onClick }: { onClick: (block: Block, mesh: Mesh) => void }) {
    super();
    this.onClick = onClick;
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    canvas.addEventListener("mouseup", this.handleMouseUp.bind(this), false);
    canvas.addEventListener("mousedown", this.handleMouseUp.bind(this), false);
  }

  async destroy() {
    this.canvas.removeEventListener(
      "mouseup",
      this.handleMouseUp.bind(this),
      false
    );
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseUp.bind(this),
      false
    );
  }

  update() {}
}
