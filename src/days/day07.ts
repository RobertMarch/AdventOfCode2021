import { Day } from "../day";

export class Day07 extends Day {
  public solvePartOne(input: string): number {
    const crabs: number[] = input
      .split(",")
      .map((val) => parseInt(val))
      .sort((a, b) => a - b);
    const optimalPosition: number = crabs[Math.floor((crabs.length - 1) / 2)];
    return crabs.reduce(
      (total: number, currPosition: number) =>
        total + Math.abs(currPosition - optimalPosition),
      0
    );
  }

  public solvePartTwo(input: string): number {
    const crabs: number[] = input
      .split(",")
      .map((val) => parseInt(val))
      .sort((a, b) => a - b);

    let minFuel: number = 100000000000;

    for (let position: number = 0; position < Math.max(...crabs); position++) {
      const fuelRequired: number = this._fuelRequired(crabs, position);

      if (fuelRequired < minFuel) {
        minFuel = fuelRequired;
      }
    }

    return minFuel;
  }

  private _fuelRequired(crabs: number[], position: number): number {
    return crabs.reduce((total: number, currPos: number) => {
      const difference = Math.abs(currPos - position);
      return total + (difference * (difference + 1)) / 2;
    }, 0);
  }
}
