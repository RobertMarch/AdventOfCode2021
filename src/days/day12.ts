import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

export class Day12 extends Day {
  private _caveConnections: Record<string, string[]>;

  public solvePartOne(input: string): number {
    this._populateCaveConnections(input);

    return this._findPathsThroughCaves("start", [], true);
  }

  public solvePartTwo(input: string): number {
    this._populateCaveConnections(input);

    return this._findPathsThroughCaves("start", [], false);
  }

  private _populateCaveConnections(input: string): void {
    this._caveConnections = {};

    splitLines(input).forEach((link) => {
      const caves: string[] = link.split("-");
      this._addToListInMap(caves[0], caves[1]);
      this._addToListInMap(caves[1], caves[0]);
    });
  }

  private _addToListInMap(key: string, value: string): void {
    this._caveConnections[key] = this._caveConnections[key] || [];
    this._caveConnections[key].push(value);
  }

  private _findPathsThroughCaves(
    currentCave: string,
    visitedSmallCaves: string[],
    visitedSmallCaveTwice: boolean
  ): number {
    const visitedCaves: string[] = visitedSmallCaves.map((val) => val);
    if (
      currentCave === currentCave.toLowerCase() &&
      !visitedCaves.includes(currentCave)
    ) {
      visitedCaves.push(currentCave);
    }

    return this._caveConnections[currentCave]
      .map((connectedCave: string) => {
        if (connectedCave == "end") {
          return 1;
        }
        if (!visitedCaves.includes(connectedCave)) {
          return this._findPathsThroughCaves(
            connectedCave,
            visitedCaves,
            visitedSmallCaveTwice
          );
        } else if (!visitedSmallCaveTwice && connectedCave !== 'start') {
          return this._findPathsThroughCaves(
            connectedCave,
            visitedCaves,
            true
          );
        }
        return 0;
      })
      .reduce((sum, curr) => sum + curr, 0);
  }
}
