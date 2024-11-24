import { Material } from "../models/material";
import { Texture } from "../models/texture";

export type BasicMaterialOptions = { texture: Texture };

export class BasicMaterial extends Material {
  texture!: Texture;

  constructor(options: BasicMaterialOptions) {
    super();
    Object.assign(this, options);
  }
}
