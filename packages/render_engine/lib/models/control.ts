import { Block } from "./block";
import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Control {
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

export abstract class BlocKControl {
  block!: Block;
  control!: Control;

  connect(
    scene: Scene,
    camera: Camera,
    canvas: HTMLCanvasElement,
    block: Block
  ) {
    this.block = block;
    this.control.connect(scene, camera, canvas);
  }

  disconnect() {
    this.control.disconnect();
  }
}
