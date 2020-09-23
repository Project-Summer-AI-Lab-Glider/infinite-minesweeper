import p5 from "p5";
import { DrawingCalculations } from "./DrawingCalculations";
import { DrawingUtils } from "./DrawingUtils";
import { Node } from "../models/Node";

const drawingSketch = (p: p5) => {
  const drawingCalculations = new DrawingCalculations(p);
  const drawingUtils = new DrawingUtils(p);

  let globalNodes: Node[];

  p.setup = async () => {
    const canvasDiv = document.getElementById("canvas-parent");
    const width = canvasDiv!.offsetWidth;
    const height = canvasDiv!.offsetHeight;
    const canvas = p.createCanvas(width, height);
    canvas.parent("canvas");

    p.rectMode(p.CENTER);
    p.translate(p.width / 2, p.height / 2);

    const sideSize = 50;
    const gridSpace = 1;

    // sum must be equal 0
    // each must be (-1, 1)
    // all must be unique
    // offset y0 = 0
    // 2 + 5 sum cant be integer
    // 3 + 4 sum cant be integer
    const offsets = [-0.2, 0.6, -0.6, -0.5, 0.7];

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
    p.translate(-firstNode.center.x, -firstNode.center.y);
    firstNode.translation = p.createVector(0, 0);

    const doneIds: number[] = [];
    await generateTiling(
      firstNode,
      drawingCalculations,
      sideSize,
      drawingUtils,
      doneIds
    );

    ///////////////////////////////
    // Connect vertices

    graphNodes.forEach((node) => {
      node.vertices.forEach((v) => {
        graphNodes.forEach((node2) => {
          if (node.id === node2.id) return;
          if (node.connections.find((n) => n.id === node2.id)) return;

          node2.vertices.forEach((v2) => {
            const accuracy = 100;
            const x1 = Math.round(v.x * accuracy);
            const x2 = Math.round(v2.x * accuracy);
            const y1 = Math.round(v.y * accuracy);
            const y2 = Math.round(v2.y * accuracy);

            if (x1 === x2 && y1 === y2) {
              node.connections.push(node2);
              node2.connections.push(node);
            }
          });
        });
      });
    });

    globalNodes = graphNodes;
    console.log("moved");

    // small i=5
    // medium i=10
    // large i=20

    // TODO send graph to backend
    const graph = doneIds.map((id) => {
      const node = graphNodes.find((node) => node.id === id);
      return {
        id,
        value: -2,
        connections: node!.connections
          .filter((connection) => doneIds.includes(connection.id))
          .map((connection) => connection.id),
      };
    });
    // console.log(firstNode.id);
    // console.log(JSON.stringify(graph));
    // console.log(graph);
  };

  async function generateTiling(
    node: Node,
    drawingCalculations: any,
    sideSize: number,
    drawingUtils: any,
    doneIds: number[],
    i = 0
  ) {
    if (i === 10) {
      // TODO boundary condition
      return;
    }
    if (doneIds.includes(node.id)) {
      return;
    }
    doneIds.push(node.id);

    const angle = Math.round(node.angle); // TODO move
    let color = [0, 133, 11];
    if (angle === 72) {
      color = [96, 138, 252];
    }
    drawingUtils.drawNode(node, color);

    const p = node.connections.map(async (nextNode) => {
      await new Promise((resolve) => setTimeout(resolve, 200));

      if (!nextNode.isMoved) {
        drawingCalculations.connectNodesVertices(node, nextNode, sideSize);
      }

      await generateTiling(
        nextNode,
        drawingCalculations,
        sideSize,
        drawingUtils,
        doneIds,
        i + 1
      );
    });
    await Promise.all(p);

    return doneIds;
  }

  p.mouseClicked = () => {
    const clickPoint = {
      x: p.mouseX - p.width / 2,
      y: p.mouseY - p.height / 2,
    };

    const node = globalNodes.find(
      (node) =>
        DrawingCalculations.isPointInsidePolygon(clickPoint, node.vertices) &&
        node.isMoved
    );
    if (node) {
      drawingUtils.drawNode(node, [0, 0, 0, 0], true, 0);
    }
  };
};

export { drawingSketch };
