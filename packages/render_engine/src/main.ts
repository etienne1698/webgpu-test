import {
  Simulation,
  Node,
  ClickControl,
  CubeMesh,
  KeyboardKeyHoldControl,
  randomColor,
  Scene,
  SlideNodeControl,
  Webgpu3DRenderer,
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
    const cubeMesh = new CubeMesh(position as CubeMesh["vertices"][0], [randomColor()]);
    const node = new Node(cubeMesh);
    scene.addNode(`cube${Math.random()}`, node);
  }
}

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

const renderer = new Webgpu3DRenderer(canvas);

const app = new Simulation(renderer, {
  scene,
  canvas,
  controls: [
    new ClickControl((node) => {
      node.mesh.colors = new CubeMesh([0, 0, 0]).vertices.map(randomColor);
    }),
    new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
    new SlideNodeControl((node) => {}),
    new MenuControl({
      goForward: btnForward,
      goBackward: btnBackward,
      rotateY: inputRotationY,
    }),
  ],
});

await app.init();
generateRandomCubes(app.scene, 50, { x: 50, y: 50, z: 50 });

app.camera!.translate([0, 0, 30]);
app.run();
