import { Node } from "./node";
import { Camera } from "./camera";
import { Scene } from "./scene";

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