export class Node {
  children = new Map<string, Node>();
  parent?: Node;

  constructor() {}

  traverseTree(callback: (node: Node) => void) {
    callback(this);
    this.children.forEach((child) => child.traverseTree(callback));
  }

  setParent(parent: Node) {
    this.parent = parent;
  }

  hasParent(): boolean {
    return Boolean(this.parent);
  }

  addChild(nodeName: string, node: Node) {
    node.setParent(this);
    this.children.set(nodeName, node);
  }

  removeChild(nodeName: string) {
    this.children.delete(nodeName);
  }

  getChild(nodeName: string) {
    return this.children.get(nodeName);
  }
}
