import { Point } from "./Point";

export class LinearFunction {
  constructor(
    public a: number,
    public b: number,
    public xT: number = 0,
    public yT: number = 0
  ) {}

  static createFromPoints(p1: Point, p2: Point) {
    const b = (p2.y * p1.x - p1.y * p2.x) / (p1.x - p2.x);
    const a = (p1.y - b) / p1.x;

    return new LinearFunction(a, b);
  }

  static createFromSlopeAndPoint(a: number, p: Point) {
    const b = p.y - a * p.x;
    return new LinearFunction(a, b);
  }

  /**
   * @param f
   * @return angle between two linear functions
   */
  calculateSlope(f: LinearFunction): number {
    const tan = Math.abs((this.a - f.a) / (1 + this.a * f.a));
    return (Math.atan(tan) * 180) / Math.PI;
  }

  evaluate(x: number) {
    return this.a * (x - this.xT) + this.b + this.yT;
  }
}
