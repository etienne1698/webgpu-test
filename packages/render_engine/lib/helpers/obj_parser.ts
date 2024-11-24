import { vec2, vec3 } from "gl-matrix";
import { Geometry } from "../models/geometry";

/**
 * TODO: this do not parse all .obj values (ex: normal map no parsed)
 */
export namespace ObjParser {
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
          for (let i = 2; i < words.length - 1; i++) {
            // Triangle basé sur le premier sommet, et les suivants
            const indices = [
              words[1].split("/"),
              words[i].split("/"),
              words[i + 1].split("/"),
            ];

            // Ajout des vertices
            geometry.vertices.push(
              vertices[+indices[0][0] - 1],
              vertices[+indices[1][0] - 1],
              vertices[+indices[2][0] - 1]
            );

            // Ajout des UVs (si disponibles)
            geometry.uvMap.push(
              uvMap[+indices[0][1] - 1],
              uvMap[+indices[1][1] - 1],
              uvMap[+indices[2][1] - 1]
            );
          }
          break;
        default:
          break;
      }
    }

    return geometry;
  }
}
