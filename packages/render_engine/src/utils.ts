import { mat4, vec3 } from "gl-matrix";
import {
  CubeMesh,
  Node,
  randomColor,
  Scene,
  MeshInstance,
  AABBShape,
} from "../lib/main";

export function generateRandomCubes(
  scene: Scene,
  N: number,
  bounds: { x: number; y: number; z: number }
) {
  const node0 = new Node();
  for (let i = 0; i < N; i++) {
    const position: vec3 = [
      Math.random() * bounds.x - bounds.x / 2, // Position X aléatoire
      Math.random() * bounds.y - bounds.y / 2, // Position Y aléatoire
      Math.random() * bounds.z - bounds.z / 2, // Position Z aléatoire
    ];
    const node = new MeshInstance({
      mesh: new CubeMesh([randomColor()]),
      transform: mat4.translate(mat4.create(), mat4.create(), position),
    });
    node.addChild("shape", new AABBShape());
    node0.addChild(`cube-${Math.random()}`, node);
  }
  scene.add(`cube-${Math.random()}`, node0);
}
