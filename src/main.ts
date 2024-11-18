import { App } from "./app";
import { KeyboardMove } from "./controls/keyboard_move";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { SquareMesh } from "./view/meshes/square_mesh";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const square1 = new Block([new SquareMesh([0, 0, 0])]);
const square2 = new Block([new SquareMesh([0.25, 0.25, 0])]);

square1.translate([-0.25, -0.25, 1]);

const scene = new Scene(
  new Map([
    ["square1", square1],
    ["square2", square2],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [new KeyboardMove()],
});

app.init();
