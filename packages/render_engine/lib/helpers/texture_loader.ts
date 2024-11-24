import { Texture } from "../models/texture";

export namespace TextureLoader {
  export async function load(url: string): Promise<Texture> {
    const res = await fetch(url);
    const blob = await res.blob();
    return new Texture(
      await createImageBitmap(blob, { colorSpaceConversion: "none" })
    );
  }
}
