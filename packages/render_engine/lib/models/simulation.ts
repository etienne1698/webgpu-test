import { Camera } from "./camera";
import { Control } from "./control";
import { Scene } from "./scene";
import { Renderer } from "./renderer";

export type SimulationOptions = {
  controls?: Control[];
  scene: Scene;
  canvas: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: Simulation) => void;
};

export class Simulation {
  controls?: Control[];
  scene!: Scene;
  canvas!: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: Simulation) => void;

  camera = new Camera();

  private simulationLoopIntervalID?: number;

  constructor(private renderer: Renderer, options: SimulationOptions) {
    Object.assign(this, options);
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
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.startRenderLoop.bind(this));
  }

  startSimulationLoop() {
    this.simulationLoopIntervalID = setInterval(() => {
      if (this.controls?.length) {
        this.controls.forEach((control) => control.update());
      }
      if (this.loop) {
        this.loop(this);
      }
    }, this.loopInterval);
  }

  stopSimulationLoop() {
    clearInterval(this.simulationLoopIntervalID);
  }

  stopRenderLoop() {}

  connectControls() {
    if (!this.controls) return;
    for (const control of this.controls) {
      control.connect(this.scene, this.camera, this.canvas);
    }
  }

  disconnectControls() {
    if (!this.controls) return;
    for (const control of this.controls) {
      control.disconnect();
    }
  }

  run() {
    this.startSimulationLoop();
    this.startRenderLoop();
    this.connectControls();
  }

  stop() {
    this.disconnectControls();
    this.stopSimulationLoop();
    this.stopRenderLoop();
  }
}
