import { Point } from "./Point";
import { Intersection } from "./Intersection";

export interface Node {
  id: number;
  intersection: Intersection;
  center: Point;
  vertices: any;
  connections: any[];
  angle: number;
}
