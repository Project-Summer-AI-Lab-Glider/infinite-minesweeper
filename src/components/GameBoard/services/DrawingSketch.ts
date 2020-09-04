import p5 from "p5";
import { DrawingCalculations } from "./DrawingCalculations";
import { DrawingUtils } from "./DrawingUtils";
import { Node } from "../models/Node";

const drawingSketch = (p: p5) => {
  p.setup = () => {
    const canvas = p.createCanvas(400, 400);
    canvas.parent("canvas");
    p.rectMode(p.CENTER);

    p.translate(p.width / 2, p.height / 2);
    p.stroke("red");
    p.point(0, 0); // TODO remove

    const drawingCalculations = new DrawingCalculations(p);
    const drawingUtils = new DrawingUtils(p);

    const sideSize = 10;
    const gridSpace = 50;

    // TODO cover whole canvas
    const xStart = -500 * 0.5; // p.width
    const xEnd = 500 * 0.5;

    const offsets = [-20, 50, 10, -60, 20];

    const gridFunctions = drawingCalculations.calculateGridLines(
      offsets,
      gridSpace
    );
    drawingUtils.drawGridLines(gridFunctions, offsets, xStart, xEnd);

    const intersections: any = drawingCalculations.calculateIntersections(
      gridFunctions,
      gridSpace
    );
    drawingUtils.drawIntersectionPoints(intersections);

    const graphNodes = drawingCalculations.calculateNodesVertices(
      intersections,
      sideSize
    );
    // drawingUtils.drawNodes(graphNodes);

    drawingCalculations.bindNodes(gridFunctions, graphNodes);

    const firstNode = drawingCalculations.findFirstGridNode(graphNodes);

    // TODO translate

    // TODO remove
    firstNode.translation = p.createVector(0, 0);
    drawingUtils.drawNode(firstNode);

    drawingCalculations.connectNodesVertices(
      firstNode,
      firstNode.connections[1],
      sideSize
    );
    drawingUtils.drawNode(firstNode.connections[1]);

    drawingUtils.drawNode(firstNode.connections[1].connections[1]);
    drawingCalculations.connectNodesVertices(
      firstNode.connections[1],
      firstNode.connections[1].connections[1],
      sideSize
    );
    drawingUtils.drawNode(firstNode.connections[1].connections[1]);

    /////////////////////////////

    drawingUtils.drawNode(
      firstNode.connections[1].connections[1].connections[1]
    );
    drawingCalculations.connectNodesVertices(
      firstNode.connections[1].connections[1],
      firstNode.connections[1].connections[1].connections[1],
      sideSize
    );
    drawingUtils.drawNode(
      firstNode.connections[1].connections[1].connections[1]
    );

    // generateTiling(firstNode, [], drawingCalculations, sideSize, drawingUtils);
  };

  function generateTiling(
    node: Node,
    doneIds: number[],
    drawingCalculations: any,
    sideSize: number,
    drawingUtils: any,
    i = 0
  ) {
    if (i === 3) {
      return;
    }
    i++;

    drawingUtils.drawNode(node);
    doneIds.push(node.id);
    node.connections.forEach((nextNode) => {
      if (!doneIds.includes(nextNode.id)) {
        drawingCalculations.connectNodesVertices(node, nextNode, sideSize);
      }
    });
    node.connections.forEach((nextNode) => {
      if (!doneIds.includes(nextNode.id)) {
        generateTiling(
          nextNode,
          doneIds,
          drawingCalculations,
          sideSize,
          drawingUtils,
          i
        );
      }
    });
  }
};

export { drawingSketch };
