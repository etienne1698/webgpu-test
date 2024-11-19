import { KeyboardControl } from "./controls/keyboard_control";
import { MouseControl } from "./controls/mouse_control";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant } from "./utils";
import { CubeMesh } from "./view/meshes/cube_mesh";
const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["cube1", new Block([new CubeMesh([0, 0, 0])])],
    ["cube2", new Block([new CubeMesh([1, 1, 1])])],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [new KeyboardControl(), new MouseControl()],
});

app.init();

/* app.camera!.rotateX(degeesToRadiant(45));
app.camera!.rotateY(degeesToRadiant(45));
app.camera!.translate([2, -3, -3]); */

app.camera!.translate([0, 0, -1]);
