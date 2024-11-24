import { Camera, Simulation, Webgpu3DRenderer } from "../lib/main";
import scene1 from "./scenes/scene1";

const canvas = document.querySelector<HTMLCanvasElement>("#app-canvas")!;

const device = await Webgpu3DRenderer.getDefaultDevice();

const renderer = new Webgpu3DRenderer(device, canvas);

const camera = new Camera();

const app = new Simulation(renderer, {
  scene: scene1,
  canvas,
  camera,
});

await app.init();

camera.translate([0, 15, 100]);
app.run();

// Prevent browser zoom
document.addEventListener(
  "wheel",
  (e) => {
    e.preventDefault();
  },
  { passive: false }
);
