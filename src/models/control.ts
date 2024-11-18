import { Scene } from "./scene";

export abstract class Control {
  scene!: Scene;

  init(scene: Scene, ...args: any) {
    this.scene = scene;
  }
  abstract destroy(): Promise<void>;

  abstract update(): void;
}
