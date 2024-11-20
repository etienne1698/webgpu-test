import { Control } from "../models/control";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";

type SlideBlockAction = (block: Block, mesh: Mesh) => void;

export class SlideBlockControl extends Control {
  onSlide?: SlideBlockAction;

  coord = { x: 0, y: 0 };
  oldCoord = { x: 0, y: 0 };

  currentBlockSelected?: Block;
  currentMeshSelected?: Mesh;

  constructor(onSlide?: SlideBlockAction) {
    super();
    this.onSlide = onSlide;

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseUp() {
    this.currentBlockSelected = undefined;
    this.currentMeshSelected = undefined;

    this.coord = { x: 0, y: 0 };
    this.oldCoord = { x: 0, y: 0 };
  }

  handleMouseDown(e: MouseEvent) {
    const ray = getRayFromMouse(e.clientX, e.clientY, this.canvas, this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        const { boxMin, boxMax } = mesh.computeAABB();
        if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
          this.currentBlockSelected = block;
          this.currentMeshSelected = mesh;
          this.oldCoord = { x: e.clientX, y: e.clientY };
        }
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.currentMeshSelected || !this.currentBlockSelected) return;
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
    this.canvas.removeEventListener("mousedown", this.handleMouseDown, false);
    this.canvas.removeEventListener("mousedown", this.handleMouseMove, false);
  }

  update() {
    if (!this.onSlide) return;
    if (this.currentBlockSelected && this.currentMeshSelected) {
      const x = this.oldCoord.x / this.coord.x;
      if (x === Infinity) return;
      console.error(this.oldCoord.x / this.coord.x);
      this.currentBlockSelected.translate([
        (this.oldCoord.x / this.coord.x) * 0.05,
        0,
        0,
      ]);
      this.oldCoord = { ...this.coord };
    }
  }
}
