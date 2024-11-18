import { vec3 } from "gl-matrix";

export class Camera {
  position: vec3 = vec3.create();

  translate(v: vec3) {
    vec3.add(this.position, this.position, v);
  }
}
