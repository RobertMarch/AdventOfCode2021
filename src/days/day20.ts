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

export class Day20 extends Day {
  public solvePartOne(input: string): number {
    const parts: string[] = splitLines(input, true, 2);
    const enhancementKey: string = parts[0];
    const infiniteGridSwitches: boolean = enhancementKey[0] == "#";

    let lightPixels: BaseCoordinate[] = this._getInitialLightPixels(parts[1])
    const gridInfo: GridInformation = this._getInitialGridInformation(lightPixels, infiniteGridSwitches);

    range(0, 2).forEach(() => {
      this._updateGridInformation(gridInfo);

      const newLightPixels: BaseCoordinate[] = [];
      for (let x = gridInfo.minX - 1; x <= gridInfo.maxX + 1; x++) {
        for (let y = gridInfo.minY - 1; y <= gridInfo.maxY + 1; y++) {
          if (enhancementKey[this._getPixelValue(x, y, lightPixels, gridInfo)] == "#") {
            newLightPixels.push(new BaseCoordinate(x, y));
          }
        }
      }
      lightPixels = newLightPixels;
    });

    return lightPixels.length;
  }

  public solvePartTwo(input: string): number {
    const parts: string[] = splitLines(input, true, 2);
    const enhancementKey: string = parts[0];
    const infiniteGridSwitches: boolean = enhancementKey[0] == "#";

    let lightPixels: BaseCoordinate[] = this._getInitialLightPixels(parts[1])
    const gridInfo: GridInformation = this._getInitialGridInformation(lightPixels, infiniteGridSwitches);

    range(0, 10).forEach(() => {
      this._updateGridInformation(gridInfo);

      const newLightPixels: BaseCoordinate[] = [];
      for (let x = gridInfo.minX - 1; x <= gridInfo.maxX + 1; x++) {
        for (let y = gridInfo.minY - 1; y <= gridInfo.maxY + 1; y++) {
          if (enhancementKey[this._getPixelValue(x, y, lightPixels, gridInfo)] == "#") {
            newLightPixels.push(new BaseCoordinate(x, y));
          }
        }
      }
      lightPixels = newLightPixels;
    });

    return lightPixels.length;
  }

  private _getInitialLightPixels(initialPixels: string): BaseCoordinate[] {
    return splitLines(initialPixels).flatMap((line, lineIndex) =>
      line
        .split("")
        .map((value, valueIndex) => (value === "#" ? new BaseCoordinate(valueIndex, lineIndex) : null))
        .filter((val) => !!val)
    );
  }

  private _getInitialGridInformation(lightPixels: BaseCoordinate[], infiniteGridSwitches: boolean): GridInformation {
    const minX: number = lightPixels.reduce((prevMin, curr) => (curr.x < prevMin ? curr.x : prevMin), 1000000);
    const maxX: number = lightPixels.reduce((prevMax, curr) => (curr.x > prevMax ? curr.x : prevMax), -1000000);
    const minY: number = lightPixels.reduce((prevMin, curr) => (curr.y < prevMin ? curr.y : prevMin), 1000000);
    const maxY: number = lightPixels.reduce((prevMax, curr) => (curr.y > prevMax ? curr.y : prevMax), -1000000);

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

  private _getPixelValue(x: number, y: number, allLightPixels: BaseCoordinate[], gridInfo: GridInformation): number {
    let binaryString: string = "";

    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const coord = new BaseCoordinate(x + dx, y + dy);
        if (
          coord.x >= gridInfo.minX &&
          coord.x <= gridInfo.maxX &&
          coord.y >= gridInfo.minY &&
          coord.y <= gridInfo.maxY
        ) {
          binaryString += allLightPixels.some((pixel) => pixel.equals(coord)) ? "1" : "0";
        } else {
          binaryString += gridInfo.infiniteGridValues;
        }
      }
    }

    return parseInt(binaryString, 2);
  }
}
