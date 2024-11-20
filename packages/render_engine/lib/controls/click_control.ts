import { Control } from "../models/control";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import { Raycaster } from "../models/raycaster";

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

    
    const canvasRect = this.canvas.getBoundingClientRect();
    const normalizedX =
      ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const normalizedY = -(
      ((e.clientY - canvasRect.top) / canvasRect.height) * 2 -
      1
    );
    const raycaster = Raycaster.fromCamera([normalizedX, normalizedY], this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        if (raycaster.isRayIntersect(mesh)) {
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
