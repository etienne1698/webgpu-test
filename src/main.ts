import { vec4 } from "gl-matrix";
import { KeyboardControl } from "./controls/keyboard_control";
import { MouseControl } from "./controls/mouse_control";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant } from "./helpers/math";
import { CubeMesh } from "./view/meshes/cube_mesh";
import vec4_colors from "./helpers/vec4_colots";
const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["cube1", new Block([new CubeMesh([0, 0, 0], [vec4_colors.red])])],
    ["cube2", new Block([new CubeMesh([1, 1, 1], [vec4_colors.blue])])],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [new KeyboardControl(), new MouseControl()],
});

app.init();


app.camera!.rotateX(degeesToRadiant(45));
app.camera!.rotateY(degeesToRadiant(45));
app.camera!.translate([2, -3.5, -3]);

