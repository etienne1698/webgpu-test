import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";

export class MouseControl extends Control {
  onBlockClick: (block: Block) => void = () => {};

  constructor({ onBlockClick }: { onBlockClick: (block: Block) => void }) {
    super();
    this.onBlockClick = onBlockClick;
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    canvas.addEventListener("mouseup", (e) => {
      const ray = getRayFromMouse(e.clientX, e.clientY, canvas, camera);

      for (const block of scene.blocks.values()) {
        for (const mesh of block.meshes) {
          const { boxMin, boxMax } = mesh.computeAABB();
          if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
            this.onBlockClick(block);
          }
        }
      }
    });
  }

  async destroy() {}

  update() {}
}
