import { Block } from "./block";

export class Scene {
  blocks: Map<string, Block> = new Map<string, Block>([]);

  constructor(blocks?: Map<string, Block>) {
    this.blocks = blocks || this.blocks;
  }

  addBlock(blockName: string, block: Block) {
    this.blocks.set(blockName, block);
  }

  deleteBlock(blockName: string) {
    this.blocks.delete(blockName);
  }
}
