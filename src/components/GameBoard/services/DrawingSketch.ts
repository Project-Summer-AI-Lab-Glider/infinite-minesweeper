import p5 from "p5";
import {
  calculateDiamondAngle,
  calculateDirectionCoefficients,
  calculateGridVectorsEnds,
} from "./DrawingCalculations";
import { Point } from "../models/Point";

const drawingSketch = (p: p5) => {
  let mode = 1;
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
    const directionCoefficients = calculateDirectionCoefficients(
      gridVectorsEnds
    );
    const space = 50;

    // TODO cover whole canvas
    const xStart = -500 * 0.5; // p.width
    const xEnd = 500 * 0.5;
    const functions: any[][] = [];

    //////////////////////////////////////////

    directionCoefficients.forEach((directionCoefficient, index) => {
      const b = space * Math.sqrt(1 + Math.pow(directionCoefficient, 2));
      functions.push([]);

      // TODO cover whole canvas
      for (let j = -5; j < 6; j++) {
        functions[index].push({
          a: directionCoefficient,
          b: b + offsets[index],
          xTranslation: offsets[index],
          yTranslation: j * b + offsets[index],
        });

        p.stroke(gridColors[index]);
        p.line(
          xStart + offsets[index],
          xStart * directionCoefficient + j * b + offsets[index],
          xEnd + offsets[index],
          xEnd * directionCoefficient + j * b + offsets[index]
        );
      }
    });

    /////////////////////////////////////////
    //          Intersections              //
    /////////////////////////////////////////
    const intersections: any = [];

    functions.forEach((fSet1, index1) => {
      fSet1.forEach((f1, i) => {
        functions.forEach((fSet2, index2) => {
          fSet2.forEach((f2, j) => {
            const b1 =
              space * Math.sqrt(1 + Math.pow(directionCoefficients[index1], 2));
            const b2 =
              space * Math.sqrt(1 + Math.pow(directionCoefficients[index2], 2));

            let intersectionX =
              (b2 -
                b1 +
                f2.yTranslation -
                f1.yTranslation +
                directionCoefficients[index1] * f1.xTranslation -
                directionCoefficients[index2] * f2.xTranslation) /
              (directionCoefficients[index1] - directionCoefficients[index2]);
            let intersectionY =
              directionCoefficients[index1] *
                (intersectionX - f1.xTranslation) +
              b1 +
              f1.yTranslation;

            const angle = calculateDiamondAngle(
              directionCoefficients[index1],
              directionCoefficients[index2]
            );

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

            intersections.push({
              x: intersectionX,
              y: intersectionY,
              diamondAngle: angle,
              f1: f1,
              f2: f2,
            });

            // TODO Draw intersections
            // p.stroke("purple");
            // p.strokeWeight(4);
            // p.point(intersectionX, intersectionY);
          });
        });
      });
    });

    /////////////////////////////////////////////////

    // Draw diamonds
    intersections.forEach((i: any) => {
      drawDiamond(i.x, i.y, 6, 180 - i.diamondAngle, 0);
    });
  };

  function drawDiamond(
    x: any,
    y: any,
    size: any,
    angle: any,
    rotation: number
  ) {
    const d1 = 2 * size * Math.cos(angle * 0.5); // longer
    const d2 = 2 * size * Math.sin(angle * 0.5);

    p.push();
    p.translate(x, y);
    p.rotate(rotation);
    p.translate(-x, -y);
    p.quad(x, y - d1 * 0.5, x + d2 * 0.5, y, x, y + d1 * 0.5, x - d2 * 0.5, y);
    p.pop();
  }
};

export { drawingSketch };
