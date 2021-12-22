import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

interface Coordinate {
  x: number;
  y: number;
}

export class Day11 extends Day {
  private _octopusGrid: number[][];

  public solvePartOne(input: string): number {
    this._octopusGrid = splitLines(input).map((line) =>
      line.split("").map((val) => parseInt(val))
    );

    let flashCount: number = 0;
    Array(100)
      .fill(0)
      .forEach(() => {
        this._octopusGrid.forEach((row: number[], rowIndex: number) => {
          row.forEach((octopus: number, octopusIndex: number) => {
            this._increaseOctopusEnergy({ x: octopusIndex, y: rowIndex });
          });
        });

        this._octopusGrid.forEach((row: number[], rowIndex: number) => {
          row.forEach((octopus: number, octopusIndex: number) => {
            if (octopus === -1) {
              flashCount += 1;
              this._setOctopus({ x: octopusIndex, y: rowIndex }, 0);
            }
          });
        });
      });

    return flashCount;
  }

  public solvePartTwo(input: string): number {
    this._octopusGrid = splitLines(input).map((line) =>
      line.split("").map((val) => parseInt(val))
    );

    let step: number = 1;
    while (true) {
      this._octopusGrid.forEach((row: number[], rowIndex: number) => {
        row.forEach((octopus: number, octopusIndex: number) => {
          this._increaseOctopusEnergy({ x: octopusIndex, y: rowIndex });
        });
      });

      let flashCount: number = 0;
      this._octopusGrid.forEach((row: number[], rowIndex: number) => {
        row.forEach((octopus: number, octopusIndex: number) => {
          if (octopus === -1) {
            flashCount += 1;
            this._setOctopus({ x: octopusIndex, y: rowIndex }, 0);
          }
        });
      });
      if (
        flashCount ===
        this._octopusGrid.length * this._octopusGrid[0].length
      ) {
        return step;
      }
      step += 1;
    }
  }

  private _increaseOctopusEnergy(position: Coordinate): void {
    if (this._getOctopus(position) !== -1) {
      this._incrementOctopusValue(position);

      if (this._getOctopus(position) > 9) {
        this._setOctopus(position, -1);
        this._getNeighbours(position).forEach(
          this._increaseOctopusEnergy.bind(this)
        );
      }
    }
  }

  private _getOctopus(position: Coordinate): number {
    return this._octopusGrid[position.y][position.x];
  }

  private _setOctopus(position: Coordinate, newValue: number): void {
    this._octopusGrid[position.y][position.x] = newValue;
  }

  private _incrementOctopusValue(position: Coordinate): void {
    this._octopusGrid[position.y][position.x] += 1;
  }

  private _getNeighbours(initial: Coordinate): Coordinate[] {
    return [-1, 0, 1].flatMap((dx) =>
      [-1, 0, 1]
        .filter(
          (dy) =>
            !(dy === 0 && dx === 0) &&
            initial.x + dx >= 0 &&
            initial.x + dx < this._octopusGrid[0].length &&
            initial.y + dy >= 0 &&
            initial.y + dy < this._octopusGrid.length
        )
        .map((dy) => {
          return { x: initial.x + dx, y: initial.y + dy };
        })
    );
  }
}
