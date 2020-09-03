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

    drawingCalculations.connectNodes(gridFunctions, graphNodes);

    const firstNode = drawingCalculations.findFirstGridNode(graphNodes);
    drawingUtils.drawNode(firstNode);

    // TODO translate

    const doneNodes = [];
    drawingCalculations.closeUpConnectedNodes(firstNode, graphNodes, sideSize);
    const secondNode = graphNodes.find(
      (node) => node.id === firstNode.connections[0].id
    ) as Node;
    drawingUtils.drawNode(secondNode);
    drawingCalculations.closeUpConnectedNodes(secondNode, graphNodes, sideSize);
    const nextNode = graphNodes.find(
      (node) => node.id === secondNode.connections[0].id
    ) as Node;
    drawingUtils.drawNode(nextNode);
  };
};

export { drawingSketch };
