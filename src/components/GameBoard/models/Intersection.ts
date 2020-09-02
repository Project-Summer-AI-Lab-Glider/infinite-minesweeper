import { Point } from "./Point";
import { LinearFunction } from "./LinearFunction";

export interface Intersection {
  id: number;
  x: number; // TODO use Point
  y: number;
  diamondAngle: number; // TODO calculate later
  f1: LinearFunction;
  f2: LinearFunction;
}
