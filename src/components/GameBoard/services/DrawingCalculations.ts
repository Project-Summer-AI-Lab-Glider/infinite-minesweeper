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

export { calculateGridVectorsEnds, calculateDirectionCoefficients };
