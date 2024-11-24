export class Texture {
  constructor(
    public imageBitmap: ImageBitmap | undefined,
    public data?: Uint8Array,
    public width?: number,
    public height?: number
  ) {}
}
