import { Ray } from "../main";
import { Node } from "../models/node";

/**
 * This class is used to add some controls for interactions (mouse click, collisions, ray...) to the parent node
 */
export abstract class Shape extends Node {
  abstract isRayIntersect(ray: Ray): boolean;
}
