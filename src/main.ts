import { KeyboardMove } from "./controls/keyboard_move";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant } from "./utils";
import { SquareMesh } from "./view/meshes/square_mesh";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([["square1", new Block([new SquareMesh([0, 0, 0])])]])
);

let rotateZ = 0;
document.addEventListener("keydown", (e) => {
  if (e.code === "Enter") {
    rotateZ += 45;
    scene.getBlock("square1")!.rotateZ(degeesToRadiant(rotateZ));
  }
});

const app = new App({
  scene,
  canvas,
  controls: [new KeyboardMove()],
});

app.init();
