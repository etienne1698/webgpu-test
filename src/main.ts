import { ClickControl } from "./controls/click_control";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant, isEqual } from "./helpers/math";
import { CubeMesh } from "./view/meshes/cube_mesh";
import vec4_colors from "./helpers/vec4_colots";
import { KeyboardKeyHoldControl } from "./controls/keyboard_key_hold_control";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["cube0", new Block([new CubeMesh([-1, -1, -1], [vec4_colors.red])])],
    ["cube1", new Block([new CubeMesh([-0.5, -0.5, -0.5], [vec4_colors.red])])],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [
    new ClickControl((block) => {
      if (isEqual(block.meshes[0].colors, [vec4_colors.purple])) {
        block.meshes[0].colors = [vec4_colors.red];
      } else {
        block.meshes[0].colors = [vec4_colors.purple];
      }
    }),
    new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
  ],
  loop(app) {},
});

await app.init();

//app.camera!.translate([0, 0, -6]);

scene.getBlock("cube1")!.meshes[0].colors = new CubeMesh([
  0, 0, 0,
]).vertices.map((v) => [Math.random(), Math.random(), Math.random(), 1]);

app.run();
