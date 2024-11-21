import { Camera } from "./camera";
import { Control } from "./control";
import { Scene } from "./scene";
import { Renderer } from "./renderer";

export type SimulationProps = {
  controls?: Control[];
  scene: Scene;
  canvas: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: Simulation) => void;
};

export class Simulation {
  controls: Control[] = [];
  scene!: Scene;
  canvas!: HTMLCanvasElement;
  camera = new Camera();
  loopInterval: number = 20;
  loop: (app: Simulation) => void = () => {};

  private simulationLoopIntervalID?: number;

  

  constructor(private renderer: Renderer, props: SimulationProps) {
    Object.assign(this, props);
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
      this.controls.forEach((control) => control.update());
      this.loop(this);
    }, this.loopInterval);
  }

  stopSimulationLoop() {
    clearInterval(this.simulationLoopIntervalID);
  }

  stopRenderLoop() {}

  run() {
    for (const control of this.controls) {
      control.connect(this.scene, this.camera, this.canvas);
    }
    this.startSimulationLoop();
    this.startRenderLoop();
  }

  stop() {
    for (const control of this.controls) {
      control.disconnect();
    }
    this.stopSimulationLoop();
    this.stopRenderLoop();
  }
}
