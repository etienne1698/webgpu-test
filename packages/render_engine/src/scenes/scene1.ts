import {
  ClickControl,
  KeyboardKeyHoldControl,
  Node,
  Scene,
  SlideNodeControl,
  Mesh,
} from "../../lib/main";
import { MenuControl } from "../controls/menu_control";
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
        if (!(node instanceof Mesh)) return;
        node.material.isVisible = !node.material.isVisible;
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
    [
      "control-4",
      new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
    ],
  ])
);

generateRandomCubes(scene1, 50, { x: 50, y: 50, z: 50 });

export default scene1;
