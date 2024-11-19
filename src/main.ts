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

const mouseControl = new MouseControl({
  onClick: (block) => {
    block.meshes[0].colors = [vec4_colors.purple];
  },
});

const app = new App({
  scene,
  canvas,
  controls: [
    mouseControl,
    new KeyboardKeyHoldControl({
      up(scene, camera) {
        camera.translate([0, -0.01, 0]);
      },
      down(scene, camera) {
        camera.translate([0, 0.01, 0]);
      },
      left(scene, camera) {
        camera.translate([0.01, 0, 0]);
      },
      right(scene, camera) {
        camera.translate([-0.01, 0, 0]);
      },

      z(scene, camera) {
        camera.translate([0, 0, 0.01]);
      },
      s(scene, camera) {
        camera.translate([0, 0, -0.01]);
      },
      q(scene, camera) {
        camera.translate([0.01, 0, 0]);
      },
      d(scene, camera) {
        camera.translate([-0.01, 0, 0]);
      },
    }),
  ],
  loop(app) {
    if (mouseControl.isPressed) {
      console.error("isPressed");
    }
  },
});

setTimeout(() => {
  app.stop();
  console.error('stop')
}, 10_000);
setTimeout(() => {
  app.run();
  console.error('start')
}, 20_000);

await app.init();

app.camera!.rotateX(degeesToRadiant(45));
app.camera!.rotateY(degeesToRadiant(45));
app.camera!.translate([2, -3.5, -3]);

app.run();
