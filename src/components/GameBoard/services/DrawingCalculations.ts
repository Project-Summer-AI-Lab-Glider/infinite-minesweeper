import { Point } from "../models/Point";

function calculateGridVectorsEnds(): Point[] {
  const vectors = [];
  for (let i = 0; i < 5; i++) {
    vectors.push({
      x: Math.cos(Math.PI * i * 0.4),
      y: Math.sin(Math.PI * i * 0.4),
    });
  }

  return vectors;
}

function calculateDirectionCoefficients(vectorsEnds: Point[]): number[] {
  const directionCoefficients: number[] = [];
  vectorsEnds.forEach((vector) => {
    directionCoefficients.push(vector.y / vector.x);
  });

  return directionCoefficients;
}

/**
 * @param a1 f1 direction coefficient
 * @param a2 f2 direction coefficient
 * @return angle between two linear functions
 */
function calculateDiamondAngle(a1: number, a2: number): number {
  const tan = Math.abs((a1 - a2) / (1 + a1 * a2));
  return (Math.atan(tan) * 180) / Math.PI;
}

export {
  calculateGridVectorsEnds,
  calculateDirectionCoefficients,
  calculateDiamondAngle,
};
