import { Block } from "./block";
import { Mesh } from "./mesh";

export class Scene {
  blocks: Map<string, Block> = new Map<string, Block>([]);

  get meshes(): Mesh[] {
    const res = [];
    for (const b of this.blocks.values()) {
      for (const m of b.meshes) {
        res.push(m);
      }
    }
    return res;
  }

  constructor(blocks?: Map<string, Block>) {
    this.blocks = blocks || this.blocks;
  }

  addBlock(blockName: string, block: Block) {
    this.blocks.set(blockName, block);
  }

  deleteBlock(blockName: string) {
    this.blocks.delete(blockName);
  }

  updateBlock(blockName: string, block: Block) {
    this.blocks.set(blockName, block);
  }

  getBlock(blockName: string) {
    return this.blocks.get(blockName);
  }
}
