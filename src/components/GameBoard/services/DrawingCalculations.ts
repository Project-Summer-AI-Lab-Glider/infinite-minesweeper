import * as p5 from "p5";
import { range } from "lodash";
import { Point } from "../models/Point";
import { LinearFunction } from "../models/LinearFunction";
import { Intersection } from "../models/Intersection";
import { Node } from "../models/Node";

export class DrawingCalculations {
  constructor(private readonly p: p5) {}

  calculateGridLines(offsets: number[], gridSpace: number): LinearFunction[][] {
    const gridSlopes = this.calculateGridSlopes();

    return gridSlopes.map((a, i) => {
      const b = gridSpace * Math.sqrt(1 + Math.pow(a, 2));

      return range(-5, 6).map((j) => {
        const yTranslation = j * b + offsets[i];
        return new LinearFunction(a, b, offsets[i], yTranslation);
      });
    });
  }

  private calculateGridSlopes(): number[] {
    return range(5)
      .map(
        (i): Point => {
          const x = Math.cos(Math.PI * i * 0.4);
          const y = Math.sin(Math.PI * i * 0.4);
          return { x, y };
        }
      )
      .map((point) => point.y / point.x);
  }

  calculateIntersections(
    functions: LinearFunction[][],
    gridSpace: number
  ): Intersection[] {
    let id = 1;
    const intersections: Intersection[] = [];

    for (const [i, f1Group] of functions.entries()) {
      for (const f1 of f1Group) {
        for (const [j, f2Group] of functions.entries()) {
          // Skip same functions groups
          if (i === j) continue;

          for (const f2 of f2Group) {
            const intersection = this.calculateLinesIntersection(
              f1,
              f2,
              gridSpace
            );

            // TODO skip duplicates
            const precision = 10000;
            const intersectionX =
              Math.round(intersection.x * precision) / precision;
            const intersectionY =
              Math.round(intersection.y * precision) / precision;

            // TODO get only visible intersections
            if (
              intersectionX < -this.p.width / 2 ||
              intersectionX > this.p.width / 2
            ) {
              continue;
            }

            if (
              intersectionY < -this.p.height / 2 ||
              intersectionY > this.p.height / 2
            ) {
              continue;
            }

            const existingIntersection = intersections.find(
              (x: any) => x.x === intersectionX && x.y === intersectionY
            );

            if (existingIntersection) {
              continue;
            }

            intersections.push({
              id,
              x: intersectionX,
              y: intersectionY,
              diamondAngle: f1.calculateSlope(f2), // TODO remove
              f1: f1,
              f2: f2,
            });
            id++;
          }
        }
      }
    }

    return intersections;
  }

  private calculateLinesIntersection(
    f1: LinearFunction,
    f2: LinearFunction,
    gridSpace: number
  ): Point {
    const b1 = gridSpace * Math.sqrt(1 + Math.pow(f1.a, 2));
    const b2 = gridSpace * Math.sqrt(1 + Math.pow(f2.a, 2));
    const x =
      (b2 - b1 + f2.yT - f1.yT + f1.a * f1.xT - f2.a * f2.xT) / (f1.a - f2.a);
    const y = f1.a * (x - f1.xT) + b1 + f1.yT;

    return { x, y };
  }

  calculateNodesVertices(
    intersections: Intersection[],
    sideSize: number
  ): Node[] {
    return intersections.map((i, index: number) => {
      // TODO whether required
      // if (isNaN(i.x) || isNaN(i.y)) {
      //     return;
      // }

      const xT = 10;
      const y12 = i.f1.evaluate(i.x + xT);
      const v1 = this.p.createVector(xT, y12 - i.y);

      const y22 = i.f2.evaluate(i.x + xT);
      const v2 = this.p.createVector(xT, y22 - i.y);

      v1.normalize();
      v2.normalize();
      v1.add(v2);

      v1.normalize();

      const d1 =
        2 * sideSize * Math.cos(((i.diamondAngle * Math.PI) / 180) * 0.5); // longer
      const d2 =
        2 * sideSize * Math.sin(((i.diamondAngle * Math.PI) / 180) * 0.5);

      const p1 = {
        x: i.x,
        y: i.y,
      };
      const p2 = {
        x: i.x + v1.x,
        y: i.y + v1.y,
      };
      const f1 = LinearFunction.createFromPoints(p1, p2);
      const angle1 = f1.calculateSlope(i.f1);
      const angle2 = f1.calculateSlope(i.f2);

      let angle = angle1 > angle2 ? angle2 : angle1;
      angle = Math.round(angle);

      let mul;
      let mul2;
      if (angle === 36 || angle === 18) {
        // 72 * 0.5 || 36 * 0.5
        // 36
        mul = d2 * 0.5;
        mul2 = d1 * 0.5;
      } else {
        // 72
        mul = d1 * 0.5;
        mul2 = d2 * 0.5;
      }

      // TODO use vectors
      const newA = -1 / f1.a;
      const f2 = LinearFunction.createFromSlopeAndPoint(newA, i);
      const v3 = this.p.createVector(xT, f2.evaluate(i.x + xT) - i.y);
      v3.normalize();
      v3.mult(mul2);
      v1.mult(mul);

      const diamondVertices = [];
      diamondVertices.push({ x: i.x + v1.x, y: i.y + v1.y });
      diamondVertices.push({ x: i.x + v3.x, y: i.y + v3.y });
      diamondVertices.push({ x: i.x - v1.x, y: i.y - v1.y });
      diamondVertices.push({ x: i.x - v3.x, y: i.y - v3.y });

      return {
        id: i.id,
        intersection: i,
        center: {
          x: i.x,
          y: i.y,
        },
        vertices: diamondVertices,
        connections: [],
        angle: i.diamondAngle,
      };
    });
  }

  connectNodes(functions: LinearFunction[][], nodes: Node[]) {
    functions.forEach((group, i) => {
      group.forEach((f, j) => {
        if (i > j) return;

        // TODO
        const functionNodes = nodes.filter(
          (node) =>
            (node.intersection.f1.a === f.a &&
              node.intersection.f1.b === f.b &&
              node.intersection.f1.xT === f.xT &&
              node.intersection.f1.yT === f.yT) ||
            (node.intersection.f2.a === f.a &&
              node.intersection.f2.b === f.b &&
              node.intersection.f2.xT === f.xT &&
              node.intersection.f2.yT === f.yT)
        );

        functionNodes.sort((a: any, b: any) =>
          a.intersection.x < b.intersection.x ? -1 : 1
        );

        let lastRef: any = functionNodes.shift();
        functionNodes.forEach((node) => {
          lastRef.connections.push({
            id: node.id,
          });
          node.connections.push({
            id: lastRef.id,
          });
          lastRef = node;
        });
      });
    });
  }

  findFirstNode(nodes: Node[]) {
    return nodes.reduce((n1, n2) => {
      const aLen = this.p.createVector(n1.center.x, n1.center.y).mag();
      const bLen = this.p.createVector(n2.center.x, n2.center.y).mag();
      return aLen < bLen ? n1 : n2;
    });
  }

  mergeConnectedNodes(firstNode: Node, nodes: Node[], sideSize: number) {
    firstNode.connections.forEach((node: any) => {
      const n: any = nodes.find((e) => e.id === node.id);
      let diamondVertices = n.vertices;

      const v = this.p.createVector(
        n.center.x - firstNode.center.x,
        n.center.y - firstNode.center.y
      );

      let distance = v.mag();
      v.normalize();

      const h1 = sideSize * Math.sin((firstNode.angle * Math.PI) / 180);
      const h2 = sideSize * Math.sin((n.angle * Math.PI) / 180);
      distance = distance - h1 * 0.5 - h2 * 0.5;

      v.mult(distance);

      diamondVertices = diamondVertices.map((vertice: any) => {
        vertice.x = vertice.x - v.x;
        vertice.y = vertice.y - v.y;
        return {
          x: vertice.x,
          y: vertice.y,
        };
      });

      const { xTranslation, yTranslation } = this.getTranslations(firstNode, n);

      let matches = 0;
      let newPoints = diamondVertices.map((point: Point) => {
        const newX = point.x + xTranslation;
        const newY = point.y + yTranslation;

        const match = firstNode.vertices.find((ver: any) => {
          const z = 10000;
          return (
            Math.round(ver.x * z) / z === Math.round(newX * z) / z &&
            Math.round(ver.y * z) / z === Math.round(newY * z) / z
          );
        });
        if (match) {
          matches++;
        }

        return {
          x: newX,
          y: newY,
        };
      });

      if (matches === 1) {
        n.vertices = diamondVertices.map((ver: any) => {
          return {
            x: ver.x - xTranslation,
            y: ver.y - yTranslation,
          };
        });

        const r = this.getTranslations(firstNode, n);

        newPoints = n.vertices.map((point: Point) => {
          const newX = point.x + r.xTranslation;
          const newY = point.y + r.yTranslation;
          return {
            x: newX,
            y: newY,
          };
        });
      }

      n.vertices = newPoints;
    });
  }

  private getTranslations(firstElement: any, neighbour: any) {
    const a: any[] = [];
    firstElement.vertices.forEach((p1: Point) => {
      neighbour.vertices.forEach((p2: Point) => {
        const distance = this.p.createVector(p2.x - p1.x, p2.y - p1.y).mag();
        a.push({
          baseP: p1,
          nodeP: p2,
          distance,
        });
      });
    });

    a.sort((a: any, b: any) => {
      if (a.distance < b.distance) {
        return -1;
      } else {
        return 1;
      }
    });

    const xTranslation = a[0].baseP.x - a[0].nodeP.x;
    const yTranslation = a[0].baseP.y - a[0].nodeP.y;
    return { xTranslation, yTranslation };
  }
}
