import { vec2, vec3 } from "gl-matrix";
import { Geometry } from "../models/geometry";

// TODO: this do not parse all .obj values (ex: normal map no parsed)
export namespace ObjGeometryParser {
  export function parse(obj: string): Geometry {
    const geometry = new Geometry();

    const vertices: vec3[] = [];
    const uvMap: vec2[] = [];

    for (const line of obj.split("\n")) {
      const words = line.split(" ");
      switch (words[0]) {
        case "v":
          vertices.push([+words[1], +words[2], +words[3]]);
          break;
        case "vt":
          uvMap.push([+words[1], +words[2]]);
          break;

        default:
          break;
      }
    }
    for (const line of obj.split("\n")) {
      const words = line.split(" ").filter((w) => w !== "");
      switch (words[0]) {
        case "f":
          geometry.vertices.push(vertices[+words[1].split("/")[0] - 1]);
          geometry.vertices.push(vertices[+words[2].split("/")[0] - 1]);
          geometry.vertices.push(vertices[+words[3].split("/")[0] - 1]);

          geometry.uvMap.push(uvMap[+words[1].split("/")[1] - 1] || [1, 1]);
          geometry.uvMap.push(uvMap[+words[2].split("/")[1] - 1] || [1, 1]);
          geometry.uvMap.push(uvMap[+words[3].split("/")[1] - 1] || [1, 1]);
          break;
        default:
          break;
      }
    }

    return geometry;
  }
}
