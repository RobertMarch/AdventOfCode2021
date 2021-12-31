import { getPriority } from "os";
import { BaseCoordinate } from "../common/coordinate";
import { Day } from "../day";
import { range } from "../utils/array-utils";
import { splitLines } from "../utils/string-utils";

interface GridInformation {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  infiniteGridSwitches: boolean;
  infiniteGridValues: string;
}

class Coordinate extends BaseCoordinate {
  public static addCoordinates(a: Coordinate, b: Coordinate): Coordinate {
    return new Coordinate(a.x + b.x, a.y + b.y);
  }

  private _serialisedValue: string;

  constructor(public x: number, public y: number) {
    super(x, y);
    this._serialisedValue = `${x},${y}`;
  }

  public get serialisedValue(): string {
    return this._serialisedValue;
  }
}

export class Day20 extends Day {
  public solvePartOne(input: string): number {
    return this._getPixelCountAfterNEnhancements(input, 2);
  }

  public solvePartTwo(input: string): number {
    return this._getPixelCountAfterNEnhancements(input, 10);
  }

  private _getPixelCountAfterNEnhancements(input: string, enhancementCount: number): number {
    const parts: string[] = splitLines(input, true, 2);
    const enhancementKey: string = parts[0];
    const infiniteGridSwitches: boolean = enhancementKey[0] == "#";

    let lightPixels: Record<string, Coordinate> = this._getInitialLightPixels(parts[1]);
    const gridInfo: GridInformation = this._getInitialGridInformation(lightPixels, infiniteGridSwitches);

    range(0, enhancementCount).forEach(() => {
      this._updateGridInformation(gridInfo);

      const newLightPixels: Record<string, Coordinate> = {};
      for (let x = gridInfo.minX - 1; x <= gridInfo.maxX + 1; x++) {
        for (let y = gridInfo.minY - 1; y <= gridInfo.maxY + 1; y++) {
          const pixel: Coordinate = new Coordinate(x, y);
          if (enhancementKey[this._getPixelValue(pixel, lightPixels, gridInfo)] == "#") {
            newLightPixels[pixel.serialisedValue] = pixel;
          }
        }
      }
      lightPixels = newLightPixels;
    });

    return Object.keys(lightPixels).length;
  }

  private _getInitialLightPixels(initialPixels: string): Record<string, Coordinate> {
    const coords = splitLines(initialPixels).flatMap((line, lineIndex) =>
      line
        .split("")
        .map((value, valueIndex) => (value === "#" ? new Coordinate(valueIndex, lineIndex) : null))
        .filter((val) => !!val)
    );

    return coords.reduce((map: Record<string, Coordinate>, currentCoord) => {
      map[currentCoord.serialisedValue] = currentCoord;
      return map;
    }, {});
  }

  private _getInitialGridInformation(
    lightPixels: Record<string, Coordinate>,
    infiniteGridSwitches: boolean
  ): GridInformation {
    const minX: number = Object.values(lightPixels).reduce(
      (prevMin, curr) => (curr.x < prevMin ? curr.x : prevMin),
      1000000
    );
    const maxX: number = Object.values(lightPixels).reduce(
      (prevMax, curr) => (curr.x > prevMax ? curr.x : prevMax),
      -1000000
    );
    const minY: number = Object.values(lightPixels).reduce(
      (prevMin, curr) => (curr.y < prevMin ? curr.y : prevMin),
      1000000
    );
    const maxY: number = Object.values(lightPixels).reduce(
      (prevMax, curr) => (curr.y > prevMax ? curr.y : prevMax),
      -1000000
    );

    return {
      minX,
      maxX,
      minY,
      maxY,
      infiniteGridSwitches,
      infiniteGridValues: "0",
    };
  }

  private _updateGridInformation(gridInfo: GridInformation): void {
    gridInfo.minX -= 1;
    gridInfo.maxX += 1;
    gridInfo.minY -= 1;
    gridInfo.maxY += 1;
    gridInfo.infiniteGridValues = !gridInfo.infiniteGridSwitches || gridInfo.infiniteGridValues === "1" ? "0" : "1";
  }

  private _getPixelValue(
    pixel: Coordinate,
    allLightPixels: Record<string, Coordinate>,
    gridInfo: GridInformation
  ): number {
    let binaryString: string = "";

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const coord: Coordinate = Coordinate.addCoordinates(pixel, new Coordinate(dx, dy));
        if (
          coord.x >= gridInfo.minX &&
          coord.x <= gridInfo.maxX &&
          coord.y >= gridInfo.minY &&
          coord.y <= gridInfo.maxY
        ) {
          binaryString += !!allLightPixels[coord.serialisedValue] ? "1" : "0";
        } else {
          binaryString += gridInfo.infiniteGridValues;
        }
      }
    }

    return parseInt(binaryString, 2);
  }
}
