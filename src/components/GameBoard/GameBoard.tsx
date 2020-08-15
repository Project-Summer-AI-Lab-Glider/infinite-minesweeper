import * as React from "react";
import p5 from "p5";
import { drawingSketch } from "./services/DrawingSketch";
import { useEffect } from "react";

export function GameBoard() {
  useEffect(() => {
    new p5(drawingSketch);
  });

  return (
    <div>
      <div id="canvas" />
    </div>
  );
}
