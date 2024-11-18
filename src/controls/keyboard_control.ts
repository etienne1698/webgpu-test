import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";

import Mousetrap from "mousetrap";

export class KeyboardControl extends Control {
  actions = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    ctrl: false,
    forward: false,
    backward: false,
  };

  mousetrap = new Mousetrap();

  private linkKeyToAction(key: string, actionsKey: string) {
    // @ts-ignore
    if (typeof this.actions[actionsKey] !== 'boolean') return;
    this.mousetrap.bind(
      key,
      () => {
        // @ts-ignore
        this.actions[actionsKey] = true;
      },
      "keydown"
    );
    this.mousetrap.bind(
      key,
      () => {
        // @ts-ignore
        this.actions[actionsKey] = false;
      },
      "keyup"
    );
  }

  async init(scene: Scene, camera: Camera) {
    super.init(scene, camera);

    this.linkKeyToAction("m", "backward");
    this.linkKeyToAction("p", "forward");
    this.linkKeyToAction("up", "top");
    this.linkKeyToAction("down", "bottom");
    this.linkKeyToAction("left", "left");
    this.linkKeyToAction("right", "right");
  }

  async destroy() {
    this.mousetrap.reset()
  }

  update(): void {
    if (this.actions.top) {
      this.camera.translate([0, 0.01, 0]);
    }
    if (this.actions.bottom) {
      this.camera.translate([0, -0.01, 0]);
    }
    if (this.actions.right) {
      this.camera.translate([0.01, 0, 0]);
    }
    if (this.actions.left) {
      this.camera.translate([-0.01, 0, 0]);
    }
    if (this.actions.forward) {
      this.camera.translate([0, 0, 0.01]);
    }
    if (this.actions.backward) {
      this.camera.translate([0, 0, -0.01]);
    }
  }
}
