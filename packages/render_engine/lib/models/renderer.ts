import { Camera } from "./camera";
import { Scene } from "./scene";

export abstract class Renderer {
  abstract render(scene: Scene, camera: Camera): Promise<void>;
}
