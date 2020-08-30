import p5 from "p5";
import {
  calculateDiamondAngle,
  calculateGirdSlopes,
  calculateGridVectorsEnds,
} from "./DrawingCalculations";
import { LinearFunction } from "../models/LinearFunction";
import { Point } from "../models/Point";

const drawingSketch = (p: p5) => {
  p.setup = () => {
    const sideSize = 10;
    const canvas = p.createCanvas(400, 400);
    canvas.parent("canvas");
    p.rectMode(p.CENTER);

    p.translate(p.width / 2, p.height / 2);
    p.stroke("red");
    p.point(0, 0); // TODO remove
    // p.rotate(p.PI / 2.0);

    const gridVectorsEnds = calculateGridVectorsEnds();
    const offsets = [-20, 50, 10, -60, 20];
    const gridColors = ["red", "blue", "cyan", "lime", "orange"];
    const gridSlopes = calculateGirdSlopes(gridVectorsEnds);
    const space = 50;

    // TODO cover whole canvas
    const xStart = -500 * 0.5; // p.width
    const xEnd = 500 * 0.5;
    const functions: any[][] = [];

    //////////////////////////////////////////

    gridSlopes.forEach((a, index) => {
      const b = space * Math.sqrt(1 + Math.pow(a, 2));
      functions.push([]);

      // TODO cover whole canvas
      for (let j = -5; j < 6; j++) {
        functions[index].push({
          a: a,
          b: b,
          xTranslation: offsets[index],
          yTranslation: j * b + offsets[index],
        });

        p.stroke(gridColors[index]);
        p.line(
          xStart + offsets[index],
          xStart * a + j * b + offsets[index],
          xEnd + offsets[index],
          xEnd * a + j * b + offsets[index]
        );
      }
    });

    /////////////////////////////////////////
    //          Intersections              //
    /////////////////////////////////////////
    const intersections: any = [];

    let i = 0;
    functions.forEach((fSet1, i1) => {
      fSet1.forEach((f1, i3) => {
        // period
        functions.forEach((fSet2, i2) => {
          if (i1 === i2) {
            return;
          }
          fSet2.forEach((f2, i4) => {
            // period
            const b1 = space * Math.sqrt(1 + Math.pow(f1.a, 2));
            const b2 = space * Math.sqrt(1 + Math.pow(f2.a, 2));

            let intersectionX =
              (b2 -
                b1 +
                f2.yTranslation -
                f1.yTranslation +
                f1.a * f1.xTranslation -
                f2.a * f2.xTranslation) /
              (f1.a - f2.a);
            let intersectionY =
              f1.a * (intersectionX - f1.xTranslation) + b1 + f1.yTranslation;

            const angle = calculateDiamondAngle(f1.a, f2.a);

            const precision = 10000;
            intersectionX = Math.round(intersectionX * precision) / precision;
            intersectionY = Math.round(intersectionY * precision) / precision;

            if (intersectionX < -p.width / 2 || intersectionX > p.width / 2) {
              return;
            }

            if (intersectionY < -p.height / 2 || intersectionY > p.height / 2) {
              return;
            }

            const existingIntersection = intersections.find(
              (x: any) => x.x === intersectionX && x.y === intersectionY
            );

            if (existingIntersection) {
              return;
            }

            i++;
            intersections.push({
              id: i,
              x: intersectionX,
              y: intersectionY,
              diamondAngle: angle,
              f1: f1,
              f2: f2,
            });

            // TODO Draw intersections
            // p.push();
            // p.stroke("yellow");
            // p.strokeWeight(4);
            // p.point(intersectionX, intersectionY);
            // p.pop();
            //
            // p.push();
            // p.stroke("black");
            // p.strokeWeight(0.1);
            // p.textSize(4);
            // p.text(i, intersectionX, intersectionY);
            // p.pop();
          });
        });
      });
    });

    /////////////////////////////////////////////////

    // Draw diamonds
    const graphNodes: any[] = [];
    intersections.forEach((i: any, index: number) => {
      if (isNaN(i.x) || isNaN(i.y)) {
        return;
      }

      const xT = 10;
      const fun1 = new LinearFunction(
        i.f1.a,
        i.f1.b,
        i.f1.xTranslation,
        i.f1.yTranslation
      );
      const y12 = fun1.evaluate(i.x + xT);
      const v1 = p.createVector(xT, y12 - i.y);

      const fun2 = new LinearFunction(
        i.f2.a,
        i.f2.b,
        i.f2.xTranslation,
        i.f2.yTranslation
      );
      const y22 = fun2.evaluate(i.x + xT);
      const v2 = p.createVector(xT, y22 - i.y);

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
      const angle1 = calculateDiamondAngle(f1.a, i.f1.a);
      const angle2 = calculateDiamondAngle(f1.a, i.f2.a);

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
      const v3 = p.createVector(xT, f2.evaluate(i.x + xT) - i.y);
      v3.normalize();
      v3.mult(mul2);
      v1.mult(mul);

      const diamondVertices = [];
      diamondVertices.push({ x: i.x + v1.x, y: i.y + v1.y });
      diamondVertices.push({ x: i.x + v3.x, y: i.y + v3.y });
      diamondVertices.push({ x: i.x - v1.x, y: i.y - v1.y });
      diamondVertices.push({ x: i.x - v3.x, y: i.y - v3.y });

      graphNodes.push({
        id: i.id,
        intersection: i,
        center: {
          x: i.x,
          y: i.y,
        },
        vertices: diamondVertices,
        connections: [],
        angle: i.diamondAngle,
      });

      // TODO Draw diamonds
      // p.push();
      // p.stroke("purple");
      // p.strokeWeight(0.5);
      // p.quad(
      //   diamondVertices[0].x,
      //   diamondVertices[0].y,
      //   diamondVertices[1].x,
      //   diamondVertices[1].y,
      //   diamondVertices[2].x,
      //   diamondVertices[2].y,
      //   diamondVertices[3].x,
      //   diamondVertices[3].y
      // );
      // p.pop();
    });

    ////////////////////////////////////////////
    //            Connect Nodes               //
    ////////////////////////////////////////////
    functions.forEach((fSet, i) => {
      fSet.forEach((f, j) => {
        if (i > j) return;

        // TODO
        const iList = graphNodes.filter(
          (node: any) =>
            (node.intersection.f1.a === f.a &&
              node.intersection.f1.b === f.b &&
              node.intersection.f1.xTranslation === f.xTranslation &&
              node.intersection.f1.yTranslation === f.yTranslation) ||
            (node.intersection.f2.a === f.a &&
              node.intersection.f2.b === f.b &&
              node.intersection.f2.xTranslation === f.xTranslation &&
              node.intersection.f2.yTranslation === f.yTranslation)
        );

        iList.sort((a: any, b: any) => {
          if (a.intersection.x < b.intersection.x) {
            return -1;
          } else {
            return 1;
          }
        });

        let lastRef = iList.shift();
        iList.forEach((node) => {
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

    ////////////////////////////////////////////
    //             Find first element         //
    ////////////////////////////////////////////
    const firstElement = graphNodes.reduce((a, b) => {
      const aLen = p.createVector(a.center.x, a.center.y).mag();
      const bLen = p.createVector(b.center.x, b.center.y).mag();
      return aLen < bLen ? a : b;
    });

    // console.log(firstElement.connections);

    p.push();
    p.strokeWeight(0.5);
    p.quad(
      firstElement.vertices[0].x,
      firstElement.vertices[0].y,
      firstElement.vertices[1].x,
      firstElement.vertices[1].y,
      firstElement.vertices[2].x,
      firstElement.vertices[2].y,
      firstElement.vertices[3].x,
      firstElement.vertices[3].y
    );
    p.pop();

    // TODO translate

    ////////////////////////////////////////////
    //             Print neighbours           //
    ////////////////////////////////////////////

    firstElement.connections.forEach((node: any) => {
      const n = graphNodes.find((e) => e.id === node.id);
      let diamondVertices = n.vertices;

      const v = p.createVector(
        n.center.x - firstElement.center.x,
        n.center.y - firstElement.center.y
      );

      let distance = v.mag();
      v.normalize();

      const h1 = sideSize * Math.sin((firstElement.angle * Math.PI) / 180);
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

      const a: any[] = [];
      firstElement.vertices.forEach((p1: Point) => {
        n.vertices.forEach((p2: Point) => {
          const distance = p.createVector(p2.x - p1.x, p2.y - p1.y).mag();
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

      let matches = 0;
      let newPoints = diamondVertices.map((point: Point) => {
        const newX = point.x + xTranslation;
        const newY = point.y + yTranslation;

        const match = firstElement.vertices.find((ver: any) => {
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
        newPoints = diamondVertices.map((point: Point) => {
          const newX = point.x - xTranslation;
          const newY = point.y - yTranslation;
          return {
            x: newX,
            y: newY,
          };
        });
      }

      p.push();
      p.stroke("purple");
      p.strokeWeight(0.5);
      p.quad(
        newPoints[0].x,
        newPoints[0].y,
        newPoints[1].x,
        newPoints[1].y,
        newPoints[2].x,
        newPoints[2].y,
        newPoints[3].x,
        newPoints[3].y
      );
      p.pop();
    });
  };
};

export { drawingSketch };
