import {
  App,
  Block,
  ClickControl,
  CubeMesh,
  KeyboardKeyHoldControl,
  randomColor,
  Scene,
  SlideBlockControl,
} from "../lib/main";
import { MenuControl } from "./controls/menu_control";

const canvas = document.querySelector<HTMLCanvasElement>("#app-canvas")!;

const scene = new Scene(new Map([]));

function generateRandomCubes(
  scene: Scene,
  N: number,
  bounds: { x: number; y: number; z: number }
) {
  for (let i = 0; i < N; i++) {
    const position = [
      Math.random() * bounds.x - bounds.x / 2, // Position X aléatoire
      Math.random() * bounds.y - bounds.y / 2, // Position Y aléatoire
      Math.random() * bounds.z - bounds.z / 2, // Position Z aléatoire
    ];
    const color = randomColor();
    const cubeMesh = new CubeMesh(position as CubeMesh["vertices"][0], [color]);
    const block = new Block([cubeMesh]);
    scene.addBlock(`cube${i + 1}`, block);
  }
}

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

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
    new SlideBlockControl((block) => {}),
    new MenuControl({
      goForward: btnForward,
      goBackward: btnBackward,
      rotateY: inputRotationY,
    }),
  ],
});

await app.init();
generateRandomCubes(app.scene, 150, { x: 50, y: 50, z: 50 });
app.camera!.translate([0, 0, 10]);
app.run();
