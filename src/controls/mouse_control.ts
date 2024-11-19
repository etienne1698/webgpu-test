import { Camera } from "../models/camera";
import { Control } from "../models/control";
import { Scene } from "../models/scene";
import { getRayFromMouse, isRayIntersectsBox } from "../helpers/math";
import vec4_colors from "../helpers/vec4_colots";

export class MouseControl extends Control {
  init(scene: Scene, camera: Camera, canvas: HTMLCanvasElement) {
    canvas.addEventListener("mouseup", (e) => {
      const ray = getRayFromMouse(e.clientX, e.clientY, canvas, camera);

      for (const block of scene.blocks.values()) {
        for (const mesh of block.meshes) {
          const { boxMin, boxMax } = mesh.computeAABB();
          if (isRayIntersectsBox(ray.origin, ray.direction, boxMin, boxMax)) {
            block.meshes[0].colors = [vec4_colors.blue]
          }
        }
      }
    });
  }

  async destroy() {}

  update() {}
}
