import Mousetrap from "mousetrap";
import { Camera } from "../../lib/models/camera";
import { Control } from "../../lib/nodes/control";
import { Scene } from "../../lib/models/scene";
import { degeesToRadiant } from "../../lib/helpers/math";
import { Node } from "../../lib/main";

type KeyBinding = {
  [key: string]: (scene: Scene, camera: Camera) => void;
};

export class KeyboardKeyHoldControl extends Control {
  mousetrap = new Mousetrap();
  pressed = new Map<string, boolean>();

  static get DEFAULT_KEY_BINDING() {
    const CAMERA_SPEED = 0.05;
    const CAMERA_SPEED_RAD = degeesToRadiant(0.25);
    return {
      up(scene, camera) {
        camera.translate([0, CAMERA_SPEED, 0]);
      },
      down(scene, camera) {
        camera.translate([0, -CAMERA_SPEED, 0]);
      },
      left(scene, camera) {
        camera.translate([-CAMERA_SPEED, 0, 0]);
      },
      right(scene, camera) {
        camera.translate([CAMERA_SPEED, 0, 0]);
      },

      z(scene, camera) {
        camera.translate([0, 0, -CAMERA_SPEED]);
      },
      s(scene, camera) {
        camera.translate([0, 0, CAMERA_SPEED]);
      },
      q(scene, camera) {
        camera.translate([-CAMERA_SPEED, 0, 0]);
      },
      d(scene, camera) {
        camera.translate([CAMERA_SPEED, 0, 0]);
      },
      a(scene, camera) {
        camera.rotateY(CAMERA_SPEED_RAD);
      },
      e(scene, camera) {
        camera.rotateY(-CAMERA_SPEED_RAD);
      },
      r(scene, camera) {
        camera.rotateX(-CAMERA_SPEED_RAD);
      },
      f(scene, camera) {
        camera.rotateX(CAMERA_SPEED_RAD);
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

  async connect(
    scene: Scene,
    camera: Camera,
    canvas: HTMLCanvasElement,
    node: Node
  ) {
    super.connect(scene, camera, canvas, node);
    for (const key of Object.keys(this.keyBinding)) {
      this.bindHold(key);
    }
  }
  async disconnect(): Promise<void> {
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
