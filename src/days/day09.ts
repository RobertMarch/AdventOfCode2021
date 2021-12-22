import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

interface Coordinate {
  x: number;
  y: number;
}

export class Day09 extends Day {
  public solvePartOne(input: string): number {
    let totalRisk: number = 0;

    let points: number[][] = splitLines(input).map((line: string) =>
      line.split("").map((val) => parseInt(val))
    );

    points.forEach((line, index) => {
      line.forEach((point, indexInLine) => {
        if (this._isLowPoint({ x: indexInLine, y: index }, points)) {
          totalRisk += point + 1;
        }
      });
    });

    return totalRisk;
  }

  public solvePartTwo(input: string): number {
    let points: number[][] = splitLines(input).map((line: string) =>
      line.split("").map((val) => parseInt(val))
    );

    const basin_sizes: number[] = [];

    points.forEach((line, index) => {
      line.forEach((point, indexInLine) => {
        basin_sizes.push(
          this._findBasinSize({ x: indexInLine, y: index }, points)
        );
      });
    });

    return basin_sizes
      .sort((a, b) => -(a - b))
      .slice(0, 3)
      .reduce((prev, curr) => prev * curr, 1);
  }

  private _isLowPoint(point: Coordinate, points: number[][]): boolean {
    const pointValue = points[point.y][point.x];
    return (
      (point.x == 0 || points[point.y][point.x - 1] > pointValue) &&
      (point.x == points[0].length - 1 ||
        points[point.y][point.x + 1] > pointValue) &&
      (point.y == 0 || points[point.y - 1][point.x] > pointValue) &&
      (point.y == points.length - 1 ||
        points[point.y + 1][point.x] > pointValue)
    );
  }

  private _findBasinSize(point: Coordinate, points: number[][]): number {
    if (points[point.y][point.x] == 9) {
      return 0;
    }
    let size: number = 1;
    points[point.y][point.x] = 9;
    if (point.x !== 0) {
      size += this._findBasinSize({ x: point.x - 1, y: point.y }, points);
    }
    if (point.x !== points[0].length - 1) {
      size += this._findBasinSize({ x: point.x + 1, y: point.y }, points);
    }
    if (point.y !== 0) {
      size += this._findBasinSize({ x: point.x, y: point.y - 1 }, points);
    }
    if (point.y !== points.length - 1) {
      size += this._findBasinSize({ x: point.x, y: point.y + 1 }, points);
    }
    return size;
  }
}
