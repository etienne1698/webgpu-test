import { Simulation, Webgpu3DRenderer } from "../lib/main";
import scene1 from "./scenes/scene1";

const canvas = document.querySelector<HTMLCanvasElement>("#app-canvas")!;

const device = await Webgpu3DRenderer.getDefaultDevice();

const renderer = new Webgpu3DRenderer(device, canvas);

const app = new Simulation(renderer, {
  scene: scene1,
  canvas,
});

await app.init();

app.camera.translate([0, 0, 50]);
app.run();
