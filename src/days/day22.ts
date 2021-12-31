import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

enum CubeOperation {
  ON = "on",
  OFF = "off",
}

class CubeInstruction {
  private static INPUT_REGEX = /^(\w{2,3}) x=(-?\d+)\.\.(-?\d+),y=(-?\d+)\.\.(-?\d+),z=(-?\d+)\.\.(-?\d+)$/;

  public static deserialise(line: string): CubeInstruction {
    const parts = line.match(CubeInstruction.INPUT_REGEX);
    if (!parts) {
      throw new Error("Cannot match line to expected format");
    }
    const instruction = new CubeInstruction();
    instruction._operation = parts[1] as CubeOperation;
    instruction._minX = parseInt(parts[2]);
    instruction._maxX = parseInt(parts[3]);
    instruction._minY = parseInt(parts[4]);
    instruction._maxY = parseInt(parts[5]);
    instruction._minZ = parseInt(parts[6]);
    instruction._maxZ = parseInt(parts[7]);

    return instruction;
  }

  private _operation: CubeOperation;
  private _minX: number;
  private _maxX: number;
  private _minY: number;
  private _maxY: number;
  private _minZ: number;
  private _maxZ: number;

  public get operation(): CubeOperation {
    return this._operation;
  }

  public getContainedPoints(): string[] {
    const points: string[] = [];
    if (
      this._isWithinCentre50(this._minX, this._maxX) &&
      this._isWithinCentre50(this._minY, this._maxY) &&
      this._isWithinCentre50(this._minZ, this._maxZ)
    ) {
      for (let x = Math.max(-50, this._minX); x <= Math.min(50, this._maxX); x++) {
        for (let y = Math.max(-50, this._minY); y <= Math.min(50, this._maxY); y++) {
          for (let z = Math.max(-50, this._minZ); z <= Math.min(50, this._maxZ); z++) {
            points.push(`${x},${y},${z}`);
          }
        }
      }
    }
    return points;
  }

  private _isWithinCentre50(min, max): boolean {
    return min <= 50 && max >= -50;
  }
}

export class Day22 extends Day {
  public solvePartOne(input: string): number {
    const instructions = splitLines(input).map((line) => CubeInstruction.deserialise(line));
    const onPoints: Set<string> = new Set();

    instructions.forEach((instruction) => {
      if (instruction.operation == CubeOperation.ON) {
        instruction.getContainedPoints().forEach((point) => onPoints.add(point));
      } else {
        instruction.getContainedPoints().forEach((point) => onPoints.delete(point));
      }
    });
    return onPoints.size;
  }

  public solvePartTwo(input: string): number {
    return -1;
  }
}
