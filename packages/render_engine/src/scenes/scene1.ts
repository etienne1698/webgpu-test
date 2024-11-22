import {
  ClickControl,
  CubeMesh,
  Node,
  randomColor,
  Scene,
  SlideNodeControl,
} from "../../lib/main";
import { MenuControl } from "../controls/menu_control";
import { MeshInstance } from "../../lib/nodes/mesh_instance";
import { generateRandomCubes } from "../utils";

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

const scene1 = new Scene(
  new Map<string, Node>([
    [
      "contol-1",
      new ClickControl((node) => {
        if (!(node instanceof MeshInstance)) return;
        node.mesh.colors = new CubeMesh([[0, 0, 0, 0]]).vertices.map(
          randomColor
        );
      }),
    ],
    ["contol-2", new SlideNodeControl((node) => {})],
    [
      "contol-3",
      new MenuControl({
        goForward: btnForward,
        goBackward: btnBackward,
        rotateY: inputRotationY,
      }),
    ],
  ])
);

generateRandomCubes(scene1, 50, { x: 50, y: 50, z: 50 });

export default scene1;
