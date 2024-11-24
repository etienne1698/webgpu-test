import {
  ClickControl,
  Scene,
  SlideNodeControl,
  Mesh,
  BasicMaterial,
  Texture,
  ObjParser,
  randomVec4RGBAColor,
} from "../../lib/main";
import { MenuControl } from "../controls/menu_control";
import { generateRandomCubes } from "../utils";
import testObjFile from "../assets/low_poly_tree/Lowpoly_tree_sample.obj?raw";
import { KeyboardKeyHoldControl } from "../controls/keyboard_key_hold_control";

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

const scene1 = new Scene([
  new ClickControl((node) => {
    if (!(node instanceof Mesh)) return;
    node.removeFromParent();
  }),
  new SlideNodeControl((node) => {}),
  new MenuControl({
    goForward: btnForward,
    goBackward: btnBackward,
    rotateY: inputRotationY,
  }),

  new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
]);

generateRandomCubes(scene1, 50, { x: 50, y: 50, z: 50 });

const randomTexture = new Texture(new Uint8Array([...randomVec4RGBAColor()]), 1, 1);
const obj3DGeometry = ObjParser.parse(testObjFile);

const obj3D = new Mesh({
  geometry: obj3DGeometry,
  material: new BasicMaterial({ texture: randomTexture }),
});

scene1.add(obj3D);
setInterval(() => {
  obj3D.rotateY(0.01);
}, 50);

export default scene1;
