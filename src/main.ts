import { KeyboardMove } from "./controls/keyboard_move";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant } from "./utils";
import { SquareMesh } from "./view/meshes/square_mesh";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["square1", new Block([new SquareMesh([0, 0, 0])])],
    //["square2", new Block([new SquareMesh([0.25, 0.25, 1])])],
  ])
);

scene.getBlock("square1")!.scale(.5)

const s2 = scene.getBlock("square2");
if (s2) {
  s2.rotateZ(degeesToRadiant(-45));
}

const app = new App({
  scene,
  canvas,
  controls: [new KeyboardMove()],
});

app.init();
