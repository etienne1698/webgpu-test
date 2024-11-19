import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
export class MouseControl extends Control {
  onClick: (block: Block, mesh: Mesh) => void = () => {};
  isPressed = false;

  private handleMouseUpBound: (e: MouseEvent) => void;
  private handleMouseDownBound: (e: MouseEvent) => void;

  constructor({ onClick }: { onClick: (block: Block, mesh: Mesh) => void }) {
    super();
    this.onClick = onClick;
    
    this.handleMouseUpBound = this.handleMouseUp.bind(this);
    this.handleMouseDownBound = this.handleMouseDown.bind(this);
  }

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
    this.isPressed = false;
  }

  handleMouseDown(e: MouseEvent) {
    this.isPressed = true;
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    // Utilise les méthodes liées stockées
    this.canvas.addEventListener("mouseup", this.handleMouseUpBound, false);
    this.canvas.addEventListener("mousedown", this.handleMouseDownBound, false);
  }

  async destroy() {
    // Supprime les écouteurs avec les références correctes
    this.canvas.removeEventListener("mouseup", this.handleMouseUpBound, false);
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDownBound,
      false
    );
  }

  update() {}
}
