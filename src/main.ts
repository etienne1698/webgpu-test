import { ClickControl } from "./controls/click_control";
import { App } from "./models/app";
import { Block } from "./models/block";
import { Scene } from "./models/scene";
import { degeesToRadiant, isEqual } from "./helpers/math";
import { CubeMesh } from "./view/meshes/cube_mesh";
import { colors, randomColor } from "./helpers/vec4_colots";
import { KeyboardKeyHoldControl } from "./controls/keyboard_key_hold_control";

const canvas: HTMLCanvasElement = document.querySelector("#app-canvas")!;

const scene = new Scene(
  new Map([
    ["cube0", new Block([new CubeMesh([-1, -1, -1], [randomColor()])])],
    ["cube1", new Block([new CubeMesh([-0.5, -0.5, -0.5], [colors.red])])],
  ])
);

const app = new App({
  scene,
  canvas,
  controls: [
    new ClickControl((block) => {
      block.meshes[0].colors = new CubeMesh([0, 0, 0]).vertices.map(
        randomColor
      );
    }),
    new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
  ],
  loop(app) {},
});

await app.init();

app.camera!.translate([0, 0, -6]);

app.run();
