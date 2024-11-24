import { Camera } from "./camera";
import { Scene } from "./scene";
import { Renderer } from "./renderer";

export type SimulationOptions = {
  scene: Scene;
  canvas: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: Simulation) => void;
  camera: Camera;
};

export class Simulation {
  scene!: Scene;
  canvas!: HTMLCanvasElement;
  loopInterval?: number;
  loop?: (app: Simulation) => void;

  camera!: Camera;

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
  }

  startRenderLoop() {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.startRenderLoop.bind(this));
  }

  startSimulationLoop() {
    this.simulationLoopIntervalID = setInterval(() => {
      this.scene.update();
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
    this.scene.connectControls(this.camera, this.canvas);
  }

  disconnectControls() {
    this.scene.disconnectControls();
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
