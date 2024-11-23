import { Ray } from "../main";
import { Node } from "../models/node";

/**
 * This class is used by some controls to check interactions (mouse click, collisions, ray...)
 */
export abstract class Shape extends Node {
  abstract isRayIntersect(ray: Ray): boolean;
}
