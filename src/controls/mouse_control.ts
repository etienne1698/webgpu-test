import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

type MouseControlAction = (block: Block, mesh: Mesh) => void;

export class MouseControl extends Control {
  onClick?: MouseControlAction = () => {};
  onSlide?: MouseControlAction;
  isPressed = false;

  coord = { x: 0, y: 0 };

  private handleMouseUpBound: (e: MouseEvent) => void;
  private handleMouseDownBound: (e: MouseEvent) => void;
  private handleMouseMoveBound: (e: MouseEvent) => void;

  constructor({
    onClick,
    onSlide,
  }: {
    onClick?: MouseControlAction;
    onSlide?: MouseControlAction;
  }) {
    super();
    this.onClick = onClick;
    this.onSlide = onSlide;

    this.handleMouseUpBound = this.handleMouseUp.bind(this);
    this.handleMouseDownBound = this.handleMouseDown.bind(this);
    this.handleMouseMoveBound = this.handleMouseMove.bind(this);
  }

  handleClick(e: MouseEvent) {
    if (!this.onClick) return;
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

  handleMouseMove(e: MouseEvent) {
    this.coord = { x: e.clientX, y: e.clientY };
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    this.canvas.addEventListener("mouseup", this.handleMouseUpBound, false);
    this.canvas.addEventListener("mousedown", this.handleMouseDownBound, false);
    this.canvas.addEventListener("mousemove", this.handleMouseMoveBound, false);
  }

  async destroy() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUpBound, false);
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDownBound,
      false
    );

    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseMoveBound,
      false
    );
  }

  update() {
    //console.error(this.coord);
  }
}
