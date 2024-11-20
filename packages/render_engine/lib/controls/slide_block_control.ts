import { Control } from "../models/control";
import { Block } from "../models/block";
import { Mesh } from "../models/mesh";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import { vec3 } from "gl-matrix";
import { Raycaster } from "../models/raycaster";

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
    const raycaster = new Raycaster();
    const canvasRect = this.canvas.getBoundingClientRect();
    const normalizedX =
      ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const normalizedY = -(
      ((e.clientY - canvasRect.top) / canvasRect.height) * 2 -
      1
    );
    raycaster.setFromCamera([normalizedX, normalizedY], this.camera);

    for (const block of this.scene.blocks.values()) {
      for (const mesh of block.meshes) {
        if (raycaster.isRayIntersect(mesh)) {
          this.currentBlockSelected = block;
          this.currentMeshSelected = mesh;
          this.oldCoord = { x: e.clientX, y: e.clientY };
          this.coord = { x: e.clientX, y: e.clientY };
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
      const deltaX = this.coord.x - this.oldCoord.x;
      const deltaY = this.coord.y - this.oldCoord.y;

      // Calcule la direction "forward" de la caméra
      const forward = vec3.create();
      vec3.normalize(forward, this.camera.getDirection());

      // Calcule le vecteur "right" basé sur l'orientation complète
      const right = vec3.create();
      vec3.cross(right, forward, [0, 1, 0]);
      vec3.normalize(right, right);

      // Recalcule le vecteur "up" prenant en compte toutes les rotations
      const up = vec3.create();
      vec3.cross(up, right, forward);
      vec3.normalize(up, up);

      // Projection du déplacement souris sur les vecteurs 3D
      const translation = vec3.create();
      vec3.scaleAndAdd(translation, translation, right, deltaX * 0.01);
      vec3.scaleAndAdd(translation, translation, up, -deltaY * 0.01);

      // Applique la translation au bloc
      this.currentBlockSelected.translate(translation);

      // Met à jour les coordonnées anciennes pour la prochaine itération
      this.oldCoord = { ...this.coord };
    }
  }
}
