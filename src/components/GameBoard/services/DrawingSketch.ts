import p5 from "p5";

const drawingSketch = (p: p5) => {
  let mode = 1;
  p.setup = () => {
    const canvas = p.createCanvas(400, 400);
    canvas.parent("canvas");
    p.rectMode(p.CENTER);
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
