import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

class Coordinate {
  public static getFromArray(coords: string): Coordinate {
    const parts: number[] = coords.split(",").map((val) => parseInt(val));
    return new Coordinate(parts[0], parts[1]);
  }

  constructor(public x: number, public y: number) {}

  public equals(other: Coordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }

  public clone(): Coordinate {
    return new Coordinate(this.x, this.y);
  }
}

interface Fold {
  direction: string;
  axisPosition: number;
}

export class Day13 extends Day {
  private static FOLD_REGEX = /^fold along (\w)=(\d+)$/;

  public solvePartOne(input: string): number {
    const inputParts: string[] = splitLines(input, true, 2);
    let points: Coordinate[] = splitLines(inputParts[0]).map((line) =>
      Coordinate.getFromArray(line)
    );

    [this._getFolds(inputParts[1])[0]].forEach((fold: Fold) => {
      points = this._foldPoints(points, fold);
    });

    return points.length;
  }

  public solvePartTwo(input: string): string {
    const inputParts: string[] = splitLines(input, true, 2);
    let points: Coordinate[] = splitLines(inputParts[0]).map((line) =>
      Coordinate.getFromArray(line)
    );

    this._getFolds(inputParts[1]).forEach((fold: Fold) => {
      points = this._foldPoints(points, fold);
    });

    this._printOutput(points);

    return "See console output above";
  }

  private _getFolds(foldString: string): Fold[] {
    return splitLines(foldString).map((line) => {
      const parts = line.match(Day13.FOLD_REGEX);
      if (!parts) {
        throw new Error("Cannot match line to expected format");
      }
      return {
        direction: parts[1],
        axisPosition: parseInt(parts[2]),
      };
    });
  }

  private _foldPoints(points: Coordinate[], fold: Fold): Coordinate[] {
    const newPoints: Coordinate[] = [];

    points.map((point: Coordinate) => {
      const foldedPoint: Coordinate = point.clone();
      if (fold.direction === "x" && point.x > fold.axisPosition) {
        foldedPoint.x = 2 * fold.axisPosition - point.x;
      }
      if (fold.direction === "y" && point.y > fold.axisPosition) {
        foldedPoint.y = 2 * fold.axisPosition - point.y;
      }
      if (!newPoints.some((p) => p.equals(foldedPoint))) {
        newPoints.push(foldedPoint);
      }
    });

    return newPoints;
  }

  private _printOutput(points: Coordinate[]): void {
    const maxX: number = Math.max(...points.map((point) => point.x));
    const maxY: number = Math.max(...points.map((point) => point.y));

    let outputString: string = "\n";
    for (let y = 0; y <= maxY; y++) {
      for (let x = 0; x <= maxX; x++) {
        outputString += points.some((p) => p.equals(new Coordinate(x, y)))
          ? "#"
          : " ";
      }
      outputString += "\n";
    }
    console.log(outputString);
  }
}
