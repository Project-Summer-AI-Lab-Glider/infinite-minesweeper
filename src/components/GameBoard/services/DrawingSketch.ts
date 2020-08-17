import p5 from "p5";
import {
  calculateDirectionCoefficients,
  calculateGridVectorsEnds,
} from "./DrawingCalculations";

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

    directionCoefficients.forEach((directionCoefficient, index) => {
      const b = space * Math.sqrt(1 + Math.pow(directionCoefficient, 2));

      // TODO cover whole canvas
      for (let j = -5; j < 6; j++) {
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

    // TODO iterate over all functions
    const b1 = space * Math.sqrt(1 + Math.pow(directionCoefficients[1], 2));
    const b2 = space * Math.sqrt(1 + Math.pow(directionCoefficients[2], 2));

    const intersectionX =
      (b2 -
        b1 +
        offsets[2] -
        offsets[1] +
        directionCoefficients[1] * offsets[1] -
        directionCoefficients[2] * offsets[2]) /
      (directionCoefficients[1] - directionCoefficients[2]);
    const intersectionY =
      directionCoefficients[1] * (intersectionX - offsets[1]) + b1 + offsets[1];

    p.stroke("purple");
    p.strokeWeight(4);
    p.point(intersectionX, intersectionY);

    ///////////////////////////////////////////

    const tan =
      (directionCoefficients[1] - directionCoefficients[2]) /
      (1 + directionCoefficients[1] * directionCoefficients[2]);

    if (Math.round(Math.abs(tan) * 10000) / 10000 === 3.0777) {
      // angle 72
      drawDiamond(intersectionX, intersectionY, 4, 72);
    }
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      if (mode === 1) {
        drawDiamond(p.mouseX, p.mouseY, 50, 36);
        p.fill("blue");
      }
    }
  };

  function drawDiamond(x: any, y: any, size: any, angle: any) {
    // d is equal to the half of the diagonal
    const d1 = size * Math.sin(angle * 0.5);
    const d2 = size * Math.cos(angle * 0.5);
    p.quad(x, y - d1, x + d2, y, x, y + d1, x - d2, y);
  }
};

export { drawingSketch };
