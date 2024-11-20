import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Control {
  scene!: Scene;
  camera!: Camera;
  canvas!: HTMLCanvasElement;

  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
  }
  abstract destroy(): Promise<void>;

  abstract update(): void;
}
