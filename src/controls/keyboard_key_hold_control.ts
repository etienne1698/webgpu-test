import Mousetrap from "mousetrap";
import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";

type KeyBinding = {
  [key: string]: (scene: Scene, camera: Camera) => void;
};

export class KeyboardKeyHoldControl extends Control {
  mousetrap = new Mousetrap();
  pressed = new Map<string, boolean>();

  static get DEFAULT_KEY_BINDING() {
    const CAMERA_SPEED = 0.05;
    return {
      up(scene, camera) {
        camera.translate([0, -CAMERA_SPEED, 0]);
      },
      down(scene, camera) {
        camera.translate([0, CAMERA_SPEED, 0]);
      },
      left(scene, camera) {
        camera.translate([CAMERA_SPEED, 0, 0]);
      },
      right(scene, camera) {
        camera.translate([-CAMERA_SPEED, 0, 0]);
      },

      z(scene, camera) {
        camera.translate([0, 0, CAMERA_SPEED]);
      },
      s(scene, camera) {
        camera.translate([0, 0, -CAMERA_SPEED]);
      },
      q(scene, camera) {
        camera.translate([CAMERA_SPEED, 0, 0]);
      },
      d(scene, camera) {
        camera.translate([-CAMERA_SPEED, 0, 0]);
      },
    } as KeyBinding;
  }

  constructor(public keyBinding: KeyBinding) {
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
        this.keyBinding[key](this.scene, this.camera);
      }
    }
  }
}
