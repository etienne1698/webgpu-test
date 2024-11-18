import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Control {
  scene!: Scene;
  camera!: Camera;

  init(scene: Scene, camera: Camera, ...args: any) {
    this.scene = scene;
    this.camera = camera;
  }
  abstract destroy(): Promise<void>;

  abstract update(): void;
}
