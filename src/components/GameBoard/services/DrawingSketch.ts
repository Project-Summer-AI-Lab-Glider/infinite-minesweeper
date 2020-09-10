import p5 from "p5";
import { DrawingCalculations } from "./DrawingCalculations";
import { DrawingUtils } from "./DrawingUtils";
import { Node } from "../models/Node";

const drawingSketch = (p: p5) => {
  p.setup = async () => {
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
    // drawingUtils.drawGridLines(gridFunctions, offsets, xStart, xEnd);

    const intersections: any = drawingCalculations.calculateIntersections(
      gridFunctions,
      gridSpace
    );
    // drawingUtils.drawIntersectionPoints(intersections);

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

    //
    // drawingCalculations.connectNodesVertices(
    //   firstNode,
    //   firstNode.connections[1],
    //   sideSize
    // );
    // drawingUtils.drawNode(firstNode.connections[1]);
    //
    // drawingCalculations.connectNodesVertices(
    //   firstNode.connections[1],
    //   firstNode.connections[1].connections[1],
    //   sideSize
    // );
    // drawingUtils.drawNode(firstNode.connections[1].connections[1]);
    //
    // // /////////////////////////////
    //
    // drawingCalculations.connectNodesVertices(
    //   firstNode.connections[1].connections[1],
    //   firstNode.connections[1].connections[1].connections[1],
    //   sideSize
    // );
    // drawingUtils.drawNode(
    //   firstNode.connections[1].connections[1].connections[1]
    // );
    //
    // drawingCalculations.connectNodesVertices(
    //     firstNode.connections[1].connections[1].connections[1],
    //     firstNode.connections[1].connections[1].connections[1].connections[1],
    //     sideSize
    // );
    // drawingUtils.drawNode(
    //     firstNode.connections[1].connections[1].connections[1].connections[1]
    // );

    await generateTiling(
      firstNode,
      drawingCalculations,
      sideSize,
      drawingUtils
    );
    // drawingUtils.drawNode(firstNode, false, 'red');
  };

  async function generateTiling(
    node: Node,
    drawingCalculations: any,
    sideSize: number,
    drawingUtils: any,
    i = 0,
    doneIds: number[] = []
  ) {
    // if (i === 110) {
    //   return;
    // }
    if (doneIds.includes(node.id)) {
      return;
    }

    // console.log('id', node.id)
    doneIds.push(node.id);
    // if (node.id === 217 || node.id === 210) { // TODO remove
    //   // console.log(node)
    //   drawingUtils.drawNodeOld(node, true )
    //   drawingUtils.drawNode(node, true);
    // }

    drawingUtils.drawNode(node);

    node.connections.forEach(async (nextNode) => {
      // TODO use promise
      // if (j !== 0) return; // TODO
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!nextNode.isMoved) {
        drawingCalculations.connectNodesVertices(node, nextNode, sideSize);
      }

      await generateTiling(
        nextNode,
        drawingCalculations,
        sideSize,
        drawingUtils,
        i + 1,
        doneIds
      );
    });
  }
};

export { drawingSketch };
