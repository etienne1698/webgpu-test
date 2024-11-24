import { ObjGeometryParser } from "../../lib/helpers/obj_geometry_parser";
import {
  ClickControl,
  KeyboardKeyHoldControl,
  Node,
  Scene,
  SlideNodeControl,
  Mesh,
  randomVec4RGBAColor,
  BasicMaterial,
  Texture,
} from "../../lib/main";
import { MenuControl } from "../controls/menu_control";
import { generateRandomCubes } from "../utils";
import testObjFile from "../assets/low_poly_tree/Lowpoly_tree_sample.obj?raw";

const menu = document.getElementById("menu")!;
const btnForward: HTMLButtonElement = menu.getElementsByTagName("button")[0]!;
const btnBackward: HTMLButtonElement = menu.getElementsByTagName("button")[1]!;
const inputRotationY: HTMLInputElement = menu.getElementsByTagName("input")[0]!;

const scene1 = new Scene();
/* new Map<string, Node>([
    [
      "contol-1",
      new ClickControl((node) => {
        if (!(node instanceof Mesh)) return;
        node.material.texture.data = new Uint8Array([
          ...randomVec4RGBAColor(),
          ...randomVec4RGBAColor(),
          ...randomVec4RGBAColor(),
          ...randomVec4RGBAColor(),
        ]);
      }),
    ],
    ["contol-2", new SlideNodeControl((node) => {})],
    [
      "contol-3",
     
    ],
    [
      "control-4",
      new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING),
    ],
  ]) */

scene1.add(
  new ClickControl((node) => {
    if (!(node instanceof Mesh)) return;
    node.removeFromParent();
  })
);
scene1.add(new SlideNodeControl((node) => {}));
scene1.add(
  new MenuControl({
    goForward: btnForward,
    goBackward: btnBackward,
    rotateY: inputRotationY,
  })
);
scene1.add(
  new KeyboardKeyHoldControl(KeyboardKeyHoldControl.DEFAULT_KEY_BINDING)
);

generateRandomCubes(scene1, 50, { x: 50, y: 50, z: 50 });

const randomTexture = new Texture(
  new Uint8Array([...randomVec4RGBAColor()]),
  1,
  1
);
const obj3DGeometry = ObjGeometryParser.parse(testObjFile);

const obj3D = new Mesh({
  geometry: obj3DGeometry,
  material: new BasicMaterial({ texture: randomTexture }),
});

scene1.add(obj3D);
setInterval(() => {
  obj3D.rotateY(0.01);
}, 50);

export default scene1;
