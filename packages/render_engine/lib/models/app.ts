import { Camera } from "./camera";
import { Control } from "./control";
import { Scene } from "./scene";
import { Renderer } from "../view/renderer";

export type AppProps = {
  controls?: Control[];
  scene: Scene;
  canvas: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: App) => void;
};

export class App {
  controls: Control[] = [];
  scene!: Scene;
  canvas!: HTMLCanvasElement;
  camera = new Camera();
  loopInterval: number = 20;
  loop: (app: App) => void = () => {};

  private appLoopIntervalID?: number;

  private renderer!: Renderer;

  constructor(props: AppProps) {
    Object.assign(this, props);
    this.renderer = new Renderer(this.canvas, this.scene);
  }

  async init() {
    this.camera.setPerspectiveAspectRatio(
      this.canvas.clientWidth / this.canvas.clientHeight
    );
    window.addEventListener("resize", () => {
      this.camera.setPerspectiveAspectRatio(
        this.canvas.clientWidth / this.canvas.clientHeight
      );
    });
    await this.renderer.init();
  }

  startRenderLoop() {
    this.renderer.render(this.camera);
    requestAnimationFrame(this.startRenderLoop.bind(this));
  }

  startAppLoop() {
    this.appLoopIntervalID = setInterval(() => {
      this.controls.forEach((control) => control.update());
      this.loop(this);
    }, this.loopInterval);
  }

  stopAppLoop() {
    clearInterval(this.appLoopIntervalID);
  }

  stopRenderLoop() {}

  run() {
    for (const control of this.controls) {
      control.connect(this.scene, this.camera, this.canvas);
    }
    this.startAppLoop();
    this.startRenderLoop();
  }

  stop() {
    for (const control of this.controls) {
      control.disconnect();
    }
    this.stopAppLoop();
    this.stopRenderLoop();
  }
}
