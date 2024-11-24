import { Texture } from "./texture";

export abstract class Material {
  isVisible: boolean = true;
  abstract texture: Texture;
}
