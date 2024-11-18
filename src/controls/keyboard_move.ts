import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";

export class KeyboardMove extends Control {
  keypressed = {
    top: false,
    bottom: false,
    left: false,
    right: false,
    ctrl: false,
    P: false,
    M: false,
  };
  keybinding = {
    top: "ArrowUp",
    bottom: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
    ctrl: "ControlLeft",
    P: "KeyP",
    M: "Semicolon",
  };

  handleKeyDown(e: KeyboardEvent) {
    switch (e.code) {
      case this.keybinding.top:
        this.keypressed.top = true;
        break;
      case this.keybinding.bottom:
        this.keypressed.bottom = true;
        break;
      case this.keybinding.left:
        this.keypressed.left = true;
        break;
      case this.keybinding.right:
        this.keypressed.right = true;
        break;
      case this.keybinding.ctrl:
        this.keypressed.ctrl = true;
        break;
      case this.keybinding.P:
        this.keypressed.P = true;
        break;
      case this.keybinding.M:
        this.keypressed.M = true;
        break;
      default:
        break;
    }
  }
  handleKeyUp(e: KeyboardEvent) {
    switch (e.code) {
      case this.keybinding.top:
        this.keypressed.top = false;
        break;
      case this.keybinding.bottom:
        this.keypressed.bottom = false;
        break;
      case this.keybinding.left:
        this.keypressed.left = false;
        break;
      case this.keybinding.right:
        this.keypressed.right = false;
        break;
      case this.keybinding.ctrl:
        this.keypressed.ctrl = false;
        break;
      case this.keybinding.P:
        this.keypressed.P = false;
        break;
      case this.keybinding.M:
        this.keypressed.M = false;
        break;
      default:
        break;
    }
  }

  async init(scene: Scene, camera: Camera) {
    super.init(scene, camera);

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  async destroy() {}

  update(): void {
    if (this.keypressed.top) {
      this.camera.translate([0, 0.01, 0]);
    }
    if (this.keypressed.bottom) {
      this.camera.translate([0, -0.01, 0]);
    }
    if (this.keypressed.right) {
      this.camera.translate([0.01, 0, 0]);
    }
    if (this.keypressed.left) {
      this.camera.translate([-0.01, 0, 0]);
    }

    if (this.keypressed.P) {
      this.camera.translate([0, 0, 0.01]);
    }
    if (this.keypressed.M) {
      this.camera.translate([0, 0, -0.01]);
    }
  }
}
