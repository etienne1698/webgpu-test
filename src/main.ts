import { KeyboardControl } from "./controls/keyboard_control";
import { MouseControl } from "./controls/mouse_control";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant } from "./helpers/math";
import { CubeMesh } from "./view/meshes/cube_mesh";
import vec4_colors from "./helpers/vec4_colots";
import { KeyboardKeyHoldControl } from "./controls/keyboard_key_hold_control";
const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["cube0", new Block([new CubeMesh([-1, -1, -1], [vec4_colors.red])])],
    ["cube1", new Block([new CubeMesh([0, 0, 0], [vec4_colors.red])])],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [
    new KeyboardControl(),
    new MouseControl({
      onBlockClick: (block) => {
        block.meshes[0].colors = [vec4_colors.purple];
      },
    }),
    new KeyboardKeyHoldControl({
      h:() => {
        console.error('HH')
      }
    })
  ],
});

app.init();

app.camera!.rotateX(degeesToRadiant(45));
app.camera!.rotateY(degeesToRadiant(45));
app.camera!.translate([2, -3.5, -3]);
