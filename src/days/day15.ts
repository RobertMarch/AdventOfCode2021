import { Day } from "../day";
import { BaseCoordinate } from "../common/coordinate";
import { splitLines } from "../utils/string-utils";
import * as lodash from "lodash";

class Coordinate extends BaseCoordinate {
  private static NEIGHBOUR_DIRECTIONS: BaseCoordinate[] = [
    new BaseCoordinate(0, 1),
    new BaseCoordinate(0, -1),
    new BaseCoordinate(1, 0),
    new BaseCoordinate(-1, 0),
  ];

  public static deserialise(input: string): Coordinate {
    const parts: number[] = input.split(",").map((val) => parseInt(val));
    return new Coordinate(parts[0], parts[1]);
  }

  private static addCoordinate<T extends BaseCoordinate>(
    a: T,
    b: BaseCoordinate
  ): T {
    const newCoord: T = lodash.clone(a);
    newCoord.x += b.x;
    newCoord.y += b.y;
    return newCoord;
  }

  public getNeighbours(maxX: number, maxY: number): Coordinate[] {
    return Coordinate.NEIGHBOUR_DIRECTIONS.map((direction: BaseCoordinate) =>
      Coordinate.addCoordinate(this, direction)
    ).filter(
      (point) =>
        point.x >= 0 && point.x < maxX && point.y >= 0 && point.y < maxY
    );
  }

  public toString(): string {
    return `${this.x},${this.y}`;
  }
}

export class Day15 extends Day {
  private _riskLevels: number[][];
  private _inputMaxX: number;
  private _inputMaxY: number;
  private _maxX: number;
  private _maxY: number;

  public solvePartOne(input: string): number {
    return this._solveForMultipliedGrid(input, 1);
  }
  
  public solvePartTwo(input: string): number {
    return this._solveForMultipliedGrid(input, 5);
  }

  private _solveForMultipliedGrid(input: string, gridCopies: number): number {
    this._riskLevels = splitLines(input).map((line) =>
      line.split("").map((val) => parseInt(val))
    );
    this._inputMaxX = this._riskLevels[0].length;
    this._inputMaxY = this._riskLevels.length;
    this._maxX = this._riskLevels[0].length * gridCopies;
    this._maxY = this._riskLevels.length * gridCopies;
    const targetPoint: Coordinate = new Coordinate(
      this._maxX - 1,
      this._maxY - 1
    );

    const knownPoints: Coordinate[] = [];
    const unvisitedNeighbours: Map<string, number> = new Map();
    unvisitedNeighbours.set(new Coordinate(0, 0).toString(), 0);

    let nextPoint: Coordinate;
    while (true) {
      nextPoint = this._getNextBestPoint(unvisitedNeighbours);
      const nextPointCost: number = unvisitedNeighbours.get(
        nextPoint.toString()
      );

      if (nextPoint.equals(targetPoint)) {
        return nextPointCost;
      }

      knownPoints.push(nextPoint);
      unvisitedNeighbours.delete(nextPoint.toString());

      this._addNewNeighbours(
        nextPoint,
        nextPointCost,
        unvisitedNeighbours,
        knownPoints
      );

      if (knownPoints.length % 5000 == 0) {
        console.log(knownPoints.length)
      }
    }
  }

  private _getNextBestPoint(options: Map<string, number>): Coordinate {
    let bestNext: Coordinate;
    let bestNextCost: number;
    options.forEach((value, key) => {
      if (!bestNext || bestNextCost > value) {
        bestNext = Coordinate.deserialise(key);
        bestNextCost = value;
      }
    });
    return bestNext;
  }

  private _addNewNeighbours(
    currentPoint: Coordinate,
    currentPointCost: number,
    existingOptions: Map<string, number>,
    knownPoints: Coordinate[]
  ): void {
    currentPoint
      .getNeighbours(this._maxX, this._maxY)
      .filter((point) => !knownPoints.some((p) => p.equals(point)))
      .map((neighbour: Coordinate) => {
        const costFromCurrentPoint: number =
          currentPointCost + this._getRiskLevel(neighbour);

        if (!existingOptions.has(neighbour.toString())) {
          existingOptions.set(neighbour.toString(), costFromCurrentPoint);
        } else if (
          existingOptions.get(neighbour.toString()) > costFromCurrentPoint
        ) {
          existingOptions.set(neighbour.toString(), costFromCurrentPoint);
          return null;
        }
      });
  }

  private _getRiskLevel(point: Coordinate): number {
    return (
      ((this._riskLevels[point.y % this._inputMaxY][point.x % this._inputMaxX] +
        Math.floor(point.y / this._inputMaxY) +
        Math.floor(point.x / this._inputMaxX) -
        1) %
        9) +
      1
    );
  }
}
