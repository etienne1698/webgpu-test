import { Node } from "../models/node";
import { Camera } from "../models/camera";
import { Scene } from "../models/scene";

export abstract class Control extends Node {
  scene!: Scene;
  camera!: Camera;
  canvas!: HTMLCanvasElement;

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
  }
  abstract disconnect(): Promise<void>;

  abstract update(): void;
}
