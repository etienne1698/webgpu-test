import { Camera, Control, Scene } from "../../lib/main";

export type MenuControlActions = {
  goForward: HTMLButtonElement;
  goBackward: HTMLButtonElement;
  rotateY: HTMLInputElement;
};

export class MenuControl extends Control {
  isBtnPressed: Partial<{ [key in keyof MenuControlActions]: boolean }> = {};

  constructor(public actions: Partial<MenuControlActions> = {}) {
    super();
    this.actions = actions;
  }

  bindButtonPressed(action: keyof MenuControlActions, elem: HTMLButtonElement) {
    elem.addEventListener("mouseup", () => {
      this.isBtnPressed[action] = false;
    });
    elem.addEventListener("mouseleave", () => {
      this.isBtnPressed[action] = false;
    });
    elem.addEventListener("mousedown", () => {
      this.isBtnPressed[action] = true;
    });
  }

  connect(scene: Scene, camera: Camera, canvas: HTMLCanvasElement): void {
    super.connect(scene, camera, canvas);

    if (this.actions.goForward) {
      this.bindButtonPressed("goForward", this.actions.goForward);
    }
    if (this.actions.goBackward) {
      this.bindButtonPressed("goBackward", this.actions.goBackward);
    }
    if (this.actions.rotateY) {
      this.actions.rotateY.value = String(camera.getRotation()[2] / Math.PI);
      this.actions.rotateY.addEventListener("input", (e) => {
        // @ts-ignore
        const val = e.target.value;
        camera.setRotationY(val * Math.PI);
      });
    }
  }

  update(): void {
    const CAMERA_SPEED = 0.05;
    if (this.isBtnPressed.goForward) {
      this.camera.translate([0, 0, -CAMERA_SPEED]);
    }
    if (this.isBtnPressed.goBackward) {
      this.camera.translate([0, 0, CAMERA_SPEED]);
    }
  }

  async disconnect(): Promise<void> {}
}
