import { Node } from "../models/node";
import { Camera } from "../models/camera";
import { Scene } from "../models/scene";

export abstract class Control extends Node {
  scene!: Scene;
  camera!: Camera;
  canvas!: HTMLCanvasElement;
  node!: Node;

  constructor() {
    super();
  }

  override add() {
    throw new Error("cannot add child to controls");
  }

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement, node: Node) {
    this.scene = scene;
    this.camera = camera;
    this.canvas = canvas;
    this.node = node;
  }
  abstract disconnect(): Promise<void>;

  abstract update(): void;
}
