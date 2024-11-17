import { mat4 } from "gl-matrix";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { SquareMesh } from "./view/meshes/square_mesh";
import { Renderer } from "./view/renderer";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const t0 = mat4.create();

const t1 = mat4.create();
mat4.translate(t1, t1, [1, 1, 0]);

const scene = new Scene(
  new Map([
    ["square1", new Block([new SquareMesh(t0)])],
    ["square2", new Block([new SquareMesh(t1)])],
  ])
);

const renderer = new Renderer(canvas, scene);

await renderer.init();

renderer.render();
