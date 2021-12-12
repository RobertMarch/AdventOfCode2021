import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

class Line {
  private x1: number;
  private y1: number;
  private x2: number;
  private y2: number;

  constructor(lineString: string) {
    const regex = /^(\d+),(\d+) -> (\d+),(\d+)$/;

    const parts = lineString.match(regex);
    if (!parts) {
      throw new Error("Cannot match line to expected format");
    }
    this.x1 = parseInt(parts[1]);
    this.y1 = parseInt(parts[2]);
    this.x2 = parseInt(parts[3]);
    this.y2 = parseInt(parts[4]);
  }

  public isVerticalOrHorizontal(): boolean {
    return this.x1 == this.x2 || this.y1 == this.y2;
  }

  public getAllPoints(): number[][] {
    const numberOfPoints: number = Math.max(
      Math.abs(this.x1 - this.x2),
      Math.abs(this.y1 - this.y2)
    );

    const points: number[][] = [];
    for (let step = 0; step <= numberOfPoints; step++) {
      const x: number =
        (this.x1 * step) / numberOfPoints +
        (this.x2 * (numberOfPoints - step)) / numberOfPoints;
      const y: number =
        (this.y1 * step) / numberOfPoints +
        (this.y2 * (numberOfPoints - step)) / numberOfPoints;

      points.push([x, y]);
    }

    return points;
  }
}

export class Day05 extends Day {
  public solvePartOne(input: string): number {
    const lines: Line[] = splitLines(input).map((line) => new Line(line));

    const gridCounts: Record<number, Record<number, number>> = {};
    let pointsWithMultipleLineHits: number = 0;

    lines
      .filter((line: Line) => line.isVerticalOrHorizontal())
      .forEach((line: Line) =>
        line.getAllPoints().forEach((point) => {
          if (!gridCounts[point[0]]) {
            gridCounts[point[0]] = {};
          }
          if (!gridCounts[point[0]][point[1]]) {
            gridCounts[point[0]][point[1]] = 0;
          } else if (gridCounts[point[0]][point[1]] == 1) {
            pointsWithMultipleLineHits += 1;
          }
          gridCounts[point[0]][point[1]] += 1;
        })
      );

    return pointsWithMultipleLineHits;
  }

  public solvePartTwo(input: string): number {
    const lines: Line[] = splitLines(input).map((line) => new Line(line));

    const gridCounts: Record<number, Record<number, number>> = {};
    let pointsWithMultipleLineHits: number = 0;

    lines.forEach((line: Line) =>
      line.getAllPoints().forEach((point) => {
        if (!gridCounts[point[0]]) {
          gridCounts[point[0]] = {};
        }
        if (!gridCounts[point[0]][point[1]]) {
          gridCounts[point[0]][point[1]] = 0;
        } else if (gridCounts[point[0]][point[1]] == 1) {
          pointsWithMultipleLineHits += 1;
        }
        gridCounts[point[0]][point[1]] += 1;
      })
    );

    return pointsWithMultipleLineHits;
  }
}
