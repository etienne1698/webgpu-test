import { Control } from "../models/control";
import { Scene } from "../models/scene";

export class KeyboardMove extends Control {
  keypressed = {
    top: false,
    bottom: false,
    left: false,
    right: false,
  };
  keybinding = {
    top: "ArrowUp",
    bottom: "ArrowDown",
    left: "ArrowLeft",
    right: "ArrowRight",
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
      default:
        break;
    }
  }

  async init(scene: Scene) {
    super.init(scene);

    window.addEventListener("keydown", this.handleKeyDown.bind(this));
    window.addEventListener("keyup", this.handleKeyUp.bind(this));
  }

  // TODO: replace this.scene.getBlock("square1")?.translate by Camera.translate
  update(): void {
    if (this.keypressed.top) {
      this.scene.getBlock("square1")?.translate([0, 0.01, 0]);
    }
    if (this.keypressed.bottom) {
      this.scene.getBlock("square1")?.translate([0, -0.01, 0]);
    }
    if (this.keypressed.right) {
      this.scene.getBlock("square1")?.translate([0.01, 0, 0]);
    }
    if (this.keypressed.left) {
      this.scene.getBlock("square1")?.translate([-0.01, 0, 0]);
    }
  }

  destroy(): Promise<void> {
    throw new Error("Method not implemented.");
  }
}
