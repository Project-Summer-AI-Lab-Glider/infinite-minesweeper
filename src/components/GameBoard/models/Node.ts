import { Point } from "./Point";
import { Intersection } from "./Intersection";
import { Vector } from "p5";

export interface Node {
  id: number;
  intersection: Intersection;
  center: Point;
  oldCenter: Point;
  vertices: Point[];
  oldVertices: Point[];
  connections: Node[];
  translation?: Vector;
  angle: number;
}
