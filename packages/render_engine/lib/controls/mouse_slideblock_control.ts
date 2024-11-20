import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

type MouseControlAction = (block: Block, mesh: Mesh) => void;

export class MouseControl extends Control {
  onSlide?: MouseControlAction;
  
  isPressed = false;
  coord = { x: 0, y: 0 };

  constructor({
    onSlide,
  }: {
    onClick?: MouseControlAction;
    onSlide?: MouseControlAction;
  }) {
    super();
    this.onSlide = onSlide;

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  
  handleMouseUp() {
    
    this.isPressed = false;
  }

  handleMouseDown(e: MouseEvent) {
    this.isPressed = true;

    const ray = getRayFromMouse(e.clientX, e.clientY, this.canvas, this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        const { boxMin, boxMax } = mesh.computeAABB();
        if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
         
        }
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    this.coord = { x: e.clientX, y: e.clientY };
  }

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
    this.canvas.addEventListener("mousedown", this.handleMouseDown, false);
    this.canvas.addEventListener("mousemove", this.handleMouseMove, false);
  }

  async destroy() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUp, false);
    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseDown,
      false
    );

    this.canvas.removeEventListener(
      "mousedown",
      this.handleMouseMove,
      false
    );
  }

  update() {
    //console.error(this.coord);
  }
}
