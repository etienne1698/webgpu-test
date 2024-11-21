import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Renderer {
  constructor(public canvas: HTMLCanvasElement) {}
  
  abstract render(scene: Scene, camera: Camera): Promise<void>;

  abstract init(): Promise<void>;
}
