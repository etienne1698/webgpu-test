import Mousetrap from "mousetrap";
import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";

export class KeyboardKeyHoldControl extends Control {
  mousetrap = new Mousetrap();
  pressed = new Map<string, boolean>();

  constructor(public keyBinding: { [key: string]: () => void }) {
    super();
    this.keyBinding = keyBinding;
  }

  bindHold(key: string) {
    this.mousetrap.bind(
      key,
      () => {
        this.pressed.set(key, true);
      },
      "keydown"
    );
    this.mousetrap.bind(
      key,
      () => {
        this.pressed.set(key, false);
      },
      "keyup"
    );
  }

  async init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    super.init(scene, camera, canvas);
    for (const key of Object.keys(this.keyBinding)) {
      this.bindHold(key);
    }
  }
  async destroy(): Promise<void> {
    this.mousetrap.reset();
  }

  update(): void {
    for (const key of Object.keys(this.keyBinding)) {
      if (this.pressed.get(key)) {
        this.keyBinding[key]();
      }
    }
  }
}
