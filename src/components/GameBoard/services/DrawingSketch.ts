import p5 from "p5";
import {
  calculateDiamondAngle,
  calculateGirdSlopes,
  calculateGridVectorsEnds,
} from "./DrawingCalculations";
import { LinearFunction } from "./LinearFunction";

const drawingSketch = (p: p5) => {
  p.setup = () => {
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

    functions.forEach((fSet1) => {
      fSet1.forEach((f1) => {
        functions.forEach((fSet2) => {
          fSet2.forEach((f2) => {
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

            if (
              intersections.find(
                (x: any) => x.x === intersectionX && x.y === intersectionY
              )
            ) {
              return;
            }

            if (intersectionX < -p.width / 2 || intersectionX > p.width / 2) {
              return;
            }

            if (intersectionY < -p.height / 2 || intersectionY > p.height / 2) {
              return;
            }

            intersections.push({
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
          });
        });
      });
    });

    /////////////////////////////////////////////////

    // Draw diamonds
    intersections.forEach((i: any) => {
      if (i.diamondAngle === 0) {
        // TODO
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

      const size = 10;
      const d1 = 2 * size * Math.cos(((i.diamondAngle * Math.PI) / 180) * 0.5); // longer
      const d2 = 2 * size * Math.sin(((i.diamondAngle * Math.PI) / 180) * 0.5);

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

      const newA = -1 / f1.a;
      const f2 = LinearFunction.createFromSlopeAndPoint(newA, i);
      const v3 = p.createVector(xT, f2.evaluate(i.x + xT) - i.y);
      v3.normalize();
      v3.mult(mul2);
      v1.mult(mul);

      const points = [];
      points.push({ x: i.x + v1.x, y: i.y + v1.y });
      points.push({ x: i.x + v3.x, y: i.y + v3.y });
      points.push({ x: i.x - v1.x, y: i.y - v1.y });
      points.push({ x: i.x - v3.x, y: i.y - v3.y });

      p.push();
      p.stroke("purple");
      p.strokeWeight(0.5);
      p.quad(
        points[0].x,
        points[0].y,
        points[1].x,
        points[1].y,
        points[2].x,
        points[2].y,
        points[3].x,
        points[3].y
      );
      p.pop();
    });
  };
};

export { drawingSketch };
