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

    this.init = this.init.bind(this);
    this.run = this.run.bind(this);
    this.startAppLoop = this.startAppLoop.bind(this);
    this.startRenderLoop = this.startRenderLoop.bind(this);
    this.stopAppLoop = this.stopAppLoop.bind(this);
    this.stopRenderLoop = this.stopRenderLoop.bind(this);
    this.stop = this.stop.bind(this);
  }

  async init() {
    await this.renderer.init();
  }

  startRenderLoop() {
    this.renderer.render(this.camera);
    requestAnimationFrame(this.startRenderLoop);
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
      control.init(this.scene, this.camera, this.canvas);
    }
    this.startAppLoop();
    this.startRenderLoop();
  }

  stop() {
    for (const control of this.controls) {
      control.destroy();
    }
    this.stopAppLoop();
    this.stopRenderLoop();
  }
}
