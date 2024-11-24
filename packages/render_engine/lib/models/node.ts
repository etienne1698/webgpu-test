export class Node {
  children = new Map<string, Node>();
  parent?: Node;

  uuid: string;

  constructor(children?: Node[]) {
    this.uuid = crypto.randomUUID();
    if (children) {
      children.forEach((node) => this.add(node));
    }
  }

  traverseTree(callback: (node: Node) => void) {
    callback(this);
    this.children.forEach((child) => child.traverseTree(callback));
  }

  setParent(parent: Node) {
    this.parent = parent;
  }

  add(node: Node) {
    node.setParent(this);
    this.children.set(node.uuid, node);
  }

  remove(nodeName: string) {
    this.children.delete(nodeName);
  }

  get(nodeName: string) {
    return this.children.get(nodeName);
  }

  removeFromParent() {
    if (!this.parent) {
      throw new Error(
        `Cannot remove node "${this.uuid}" from parent, parent is undefined`
      );
    }
    this.parent.remove(this.uuid);
  }
}
