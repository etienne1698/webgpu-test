import { Camera } from "./camera";
import { Control } from "./control";
import { Scene } from "./scene";
import { Renderer } from "../view/renderer";

export type AppProps = {
  controls?: Control[];
  scene: Scene;
  canvas: HTMLCanvasElement;
  loopInterval?: number;
};

export class App {
  controls: Control[] = [];
  scene!: Scene;
  canvas!: HTMLCanvasElement;
  camera = new Camera();
  loopInterval: number = 20;

  private renderer!: Renderer;

  constructor(props: AppProps) {
    Object.assign(this, props);

    this.renderer = new Renderer(this.canvas, this.scene);

    this.init = this.init.bind(this);
    this.run = this.run.bind(this);
    this.startAppLoop = this.startAppLoop.bind(this);
    this.startRenderLoop = this.startRenderLoop.bind(this);
  }

  async init() {
    for (const control of this.controls) {
      control.init(this.scene, this.camera, this.canvas);
    }
    await this.renderer.init();
    this.run();
  }

  startRenderLoop() {
    this.renderer.render(this.camera);
    requestAnimationFrame(this.startRenderLoop);
  }

  startAppLoop() {
    setInterval(() => {
      this.controls.forEach((control) => control.update());
    }, this.loopInterval);
  }

  run() {
    this.startAppLoop();
    this.startRenderLoop();
  }
}
