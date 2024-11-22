import { Node } from "./node";

export class Scene {
  nodes: Map<string, Node> = new Map<string, Node>([]);


  constructor(nodes?: Map<string, Node>) {
    this.nodes = nodes || this.nodes;
  }

  addNode(nodeName: string, node: Node) {
    this.nodes.set(nodeName, node);
  }

  deleteNode(nodeName: string) {
    this.nodes.delete(nodeName);
  }

  updateNode(nodeName: string, node: Node) {
    this.nodes.set(nodeName, node);
  }

  getNode(nodeName: string) {
    return this.nodes.get(nodeName);
  }
}
