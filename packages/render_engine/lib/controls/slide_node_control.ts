import { Control } from "../models/control";
import { Node } from "../models/node";
import { Scene } from "../models/scene";
import { Camera } from "../models/camera";
import { vec3 } from "gl-matrix";
import { Raycaster } from "../models/raycaster";

type SlideNodeAction = (node: Node) => void;

export class SlideNodeControl extends Control {
  onSlide?: SlideNodeAction;

  coord = { x: 0, y: 0 };
  oldCoord = { x: 0, y: 0 };

  currentNodeSelected?: Node;

  constructor(onSlide?: SlideNodeAction) {
    super();
    this.onSlide = onSlide;

    this.handleMouseUp = this.handleMouseUp.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
  }

  handleMouseUp() {
    this.currentNodeSelected = undefined;

    this.coord = { x: 0, y: 0 };
    this.oldCoord = { x: 0, y: 0 };
  }

  handleMouseDown(e: MouseEvent) {
    const canvasRect = this.canvas.getBoundingClientRect();
    const normalizedX =
      ((e.clientX - canvasRect.left) / canvasRect.width) * 2 - 1;
    const normalizedY = -(
      ((e.clientY - canvasRect.top) / canvasRect.height) * 2 -
      1
    );
    const raycaster = Raycaster.fromCamera(
      [normalizedX, normalizedY],
      this.camera
    );

    for (const node of this.scene.nodes.values()) {
      if (raycaster.isRayIntersect(node)) {
        this.currentNodeSelected = node;
        this.oldCoord = { x: e.clientX, y: e.clientY };
        this.coord = { x: e.clientX, y: e.clientY };
      }
    }
  }

  handleMouseMove(e: MouseEvent) {
    if (!this.currentNodeSelected) return;
    this.coord = { x: e.clientX, y: e.clientY };
  }

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.connect(scene, camera, canvas);
    this.canvas.addEventListener("mouseup", this.handleMouseUp, false);
    this.canvas.addEventListener("mousedown", this.handleMouseDown, false);
    this.canvas.addEventListener("mousemove", this.handleMouseMove, false);
  }

  async disconnect() {
    this.canvas.removeEventListener("mouseup", this.handleMouseUp, false);
    this.canvas.removeEventListener("mousedown", this.handleMouseDown, false);
    this.canvas.removeEventListener("mousedown", this.handleMouseMove, false);
  }

  update() {
    if (!this.onSlide) return;
    if (!this.currentNodeSelected) return;

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
    this.currentNodeSelected.translate(translation);

    // Met à jour les coordonnées anciennes pour la prochaine itération
    this.oldCoord = { ...this.coord };
  }
}
