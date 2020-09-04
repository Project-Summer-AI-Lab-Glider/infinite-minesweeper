import * as p5 from "p5";
import { LinearFunction } from "../models/LinearFunction";
import { Intersection } from "../models/Intersection";
import { Node } from "../models/Node";

export class DrawingUtils {
  constructor(private readonly p: p5) {}

  drawGridLines(
    functions: LinearFunction[][],
    offsets: number[],
    start: number,
    end: number
  ): void {
    const gridColors = ["red", "blue", "cyan", "lime", "orange"];

    functions.forEach((group, i) => {
      group.forEach((f) => {
        this.p.push();
        this.p.stroke(gridColors[i]);
        this.p.line(start, f.evaluate(start), end, f.evaluate(end));
        this.p.pop();
      });
    });
  }

  drawIntersectionPoints(intersections: Intersection[]): void {
    intersections.forEach((intersection) => {
      this.p.push();
      this.p.stroke("yellow");
      this.p.strokeWeight(4);
      this.p.point(intersection.x, intersection.y);
      this.p.pop();

      this.p.push();
      this.p.stroke("black");
      this.p.strokeWeight(0.1);
      this.p.textSize(4);
      this.p.text(intersection.id, intersection.x, intersection.y);
      this.p.pop();
    });
  }

  drawNodes(nodes: Node[]) {
    nodes.forEach((node) => this.drawNode(node));
  }

  drawNode(node: Node, displayId = false) {
    this.p.push();
    this.p.stroke("purple");
    this.p.strokeWeight(0.5);
    this.p.quad(
      node.vertices[0].x,
      node.vertices[0].y,
      node.vertices[1].x,
      node.vertices[1].y,
      node.vertices[2].x,
      node.vertices[2].y,
      node.vertices[3].x,
      node.vertices[3].y
    );
    this.p.pop();

    if (displayId) {
      this.p.push();
      this.p.stroke("white");
      this.p.textSize(3);
      this.p.text(node.id, node.center.x, node.center.y);
      this.p.pop();
    }
  }
}
