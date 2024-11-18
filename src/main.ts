import { mat4 } from "gl-matrix";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { SquareMesh } from "./view/meshes/square_mesh";
import { Renderer } from "./view/renderer";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const square1 = new Block([new SquareMesh([0, 0, 0])]);
const square2 = new Block([new SquareMesh([.25, .25, 0])]);

square1.translate([-0.25, -0.25, 1]);

const scene = new Scene(
  new Map([
    ["square1", square1],
    ["square2", square2],
  ])
);

const renderer = new Renderer(canvas, scene);

await renderer.init();

renderer.render();

