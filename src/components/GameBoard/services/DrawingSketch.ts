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
    // p.point(0, 0);
    // p.rotate(p.PI / 2.0);

    const gridVectorsEnds = calculateGridVectorsEnds();
    const noises = [-20, 50, 10, -60, 20];
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
          xStart + noises[index],
          xStart * directionCoefficient + j * b + noises[index],
          xEnd + noises[index],
          xEnd * directionCoefficient + j * b + noises[index]
        );
      }
    });
  };

  p.draw = () => {
    if (p.mouseIsPressed) {
      if (mode === 1) {
        drawDiamond(p.mouseX, p.mouseY, 50, 36);
        p.fill("blue");
      } else {
        p.translate(p.mouseX, p.mouseY);
        p.rotate(p.PI / 8);
        drawDiamond(0, 0, 50, 72);
        p.fill("green");
      }
    }
  };

  p.keyPressed = () => {
    if (p.keyCode === p.LEFT_ARROW) {
      mode = 1;
    } else if (p.keyCode === p.RIGHT_ARROW) {
      mode = 2;
    }
  };

  function drawDiamond(x: any, noises: any, size: any, angle: any) {
    // d is equal to the half of the diagonal
    const d1 = size * Math.sin(angle * 0.5);
    const d2 = size * Math.cos(angle * 0.5);
    p.quad(x, noises - d1, x + d2, noises, x, noises + d1, x - d2, noises);
  }
};

export { drawingSketch };
