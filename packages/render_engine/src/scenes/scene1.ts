import { mat4, vec3 } from "gl-matrix";
import {
  ClickControl,
  CubeMesh,
  KeyboardKeyHoldControl,
  Node,
  randomColor,
  Scene,
  SlideNodeControl,
} from "../../lib/main";
import { MenuControl } from "../controls/menu_control";
import { MeshInstance } from "../../lib/nodes/mesh_instance";

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

const controls = [
  new ClickControl((node) => {
    if (!(node instanceof MeshInstance)) return;
    node.mesh.colors = new CubeMesh([[0, 0, 0, 0]]).vertices.map(randomColor);
  }),
  new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
  new SlideNodeControl((node) => {}),
  new MenuControl({
    goForward: btnForward,
    goBackward: btnBackward,
    rotateY: inputRotationY,
  }),
];

const scene1 = new Scene(new Map([]));

function generateRandomCubes(
  scene: Scene,
  N: number,
  bounds: { x: number; y: number; z: number }
) {
  const node0 = new Node();
  for (let i = 0; i < N; i++) {
    const position: vec3 = [
      Math.random() * bounds.x - bounds.x / 2, // Position X aléatoire
      Math.random() * bounds.y - bounds.y / 2, // Position Y aléatoire
      Math.random() * bounds.z - bounds.z / 2, // Position Z aléatoire
    ];
    const cubeMesh = new CubeMesh([randomColor()]);
    const node = new MeshInstance({
      mesh: cubeMesh,
      transform: mat4.translate(mat4.create(), mat4.create(), position),
    });
    node0.addChild(`cube${Math.random()}`, node);
  }
  scene.add(`cube-${Math.random()}`, node0);
}

controls.forEach((control) => {
  scene1.add(`control-${Math.random()}`, control);
});

generateRandomCubes(scene1, 50, { x: 50, y: 50, z: 50 });

export default scene1;
