import { Node } from "./node";
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

export abstract class NodeControl {
  node!: Node;
  control!: Control;

  connect(
    scene: Scene,
    camera: Camera,
    canvas: HTMLCanvasElement,
    node: Node
  ) {
    this.node = node;
    this.control.connect(scene, camera, canvas);
  }

  disconnect() {
    this.control.disconnect();
  }
}
