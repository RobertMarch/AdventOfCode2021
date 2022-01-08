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

  public getCuboid(): Cuboid {
    return new Cuboid(this._minX, this._maxX, this._minY, this._maxY, this._minZ, this._maxZ);
  }
}

class Cuboid {
  private _serialisedValue: string;

  constructor(
    public minX: number,
    public maxX: number,
    public minY: number,
    public maxY: number,
    public minZ: number,
    public maxZ: number
  ) {
    this._serialisedValue = `${minX}:${maxX},${minY}:${maxY},${minZ}:${maxZ}`;
  }

  public get serialisedValue(): string {
    return this._serialisedValue;
  }

  public getCuboidVolume(): number {
    return (this.maxX - this.minX + 1) * (this.maxY - this.minY + 1) * (this.maxZ - this.minZ + 1);
  }

  public getCuboidVolumeWithinCentre50(): number {
    let res = 0;
    if (
      this.minX <= 50 &&
      this.maxX >= -50 &&
      this.minY <= 50 &&
      this.maxY >= -50 &&
      this.minZ <= 50 &&
      this.maxZ >= -50
    ) {
      res =
        (Math.min(this.maxX, 50) - Math.max(this.minX, -50) + 1) *
        (Math.min(this.maxY, 50) - Math.max(this.minY, -50) + 1) *
        (Math.min(this.maxZ, 50) - Math.max(this.minZ, -50) + 1);
    }
    return res;
  }

  private _hasOverlap(other: Cuboid): boolean {
    return (
      this.minX <= other.maxX &&
      this.maxX >= other.minX &&
      this.minY <= other.maxY &&
      this.maxY >= other.minY &&
      this.minZ <= other.maxZ &&
      this.maxZ >= other.minZ
    );
  }

  public getNonOverlappingCuboids(other: Cuboid): Cuboid[] {
    const newCuboids: Cuboid[] = [];
    let cuboidPart: Cuboid = this;

    if (!this._hasOverlap(other)) {
      return [this];
    }

    // Split this in X (into up to 3)
    if (other.minX > cuboidPart.minX) {
      newCuboids.push(
        new Cuboid(cuboidPart.minX, other.minX - 1, cuboidPart.minY, cuboidPart.maxY, cuboidPart.minZ, cuboidPart.maxZ)
      );
      cuboidPart = new Cuboid(
        other.minX,
        cuboidPart.maxX,
        cuboidPart.minY,
        cuboidPart.maxY,
        cuboidPart.minZ,
        cuboidPart.maxZ
      );
    }
    if (other.maxX < cuboidPart.maxX) {
      newCuboids.push(
        new Cuboid(other.maxX + 1, cuboidPart.maxX, cuboidPart.minY, cuboidPart.maxY, cuboidPart.minZ, cuboidPart.maxZ)
      );
      cuboidPart = new Cuboid(
        cuboidPart.minX,
        other.maxX,
        cuboidPart.minY,
        cuboidPart.maxY,
        cuboidPart.minZ,
        cuboidPart.maxZ
      );
    }

    // Split the middle part in Y (into up to 3)
    if (other.minY > cuboidPart.minY) {
      newCuboids.push(
        new Cuboid(cuboidPart.minX, cuboidPart.maxX, cuboidPart.minY, other.minY - 1, cuboidPart.minZ, cuboidPart.maxZ)
      );
      cuboidPart = new Cuboid(
        cuboidPart.minX,
        cuboidPart.maxX,
        other.minY,
        cuboidPart.maxY,
        cuboidPart.minZ,
        cuboidPart.maxZ
      );
    }
    if (other.maxY < cuboidPart.maxY) {
      newCuboids.push(
        new Cuboid(cuboidPart.minX, cuboidPart.maxX, other.maxY + 1, cuboidPart.maxY, cuboidPart.minZ, cuboidPart.maxZ)
      );
      cuboidPart = new Cuboid(
        cuboidPart.minX,
        cuboidPart.maxX,
        cuboidPart.minY,
        other.maxY,
        cuboidPart.minZ,
        cuboidPart.maxZ
      );
    }

    // Split the middle part of Y split in Z (into up to 3)
    if (other.minZ > cuboidPart.minZ) {
      // TODO finish changing these to Z
      newCuboids.push(
        new Cuboid(cuboidPart.minX, cuboidPart.maxX, cuboidPart.minY, cuboidPart.maxY, cuboidPart.minZ, other.minZ - 1)
      );
      cuboidPart = new Cuboid(
        cuboidPart.minX,
        cuboidPart.maxX,
        cuboidPart.minY,
        cuboidPart.maxY,
        other.minZ,
        cuboidPart.maxZ
      );
    }
    if (other.maxZ < cuboidPart.maxZ) {
      newCuboids.push(
        new Cuboid(cuboidPart.minX, cuboidPart.maxX, cuboidPart.minY, cuboidPart.maxY, other.maxZ + 1, cuboidPart.maxZ)
      );
      cuboidPart = new Cuboid(
        cuboidPart.minX,
        cuboidPart.maxX,
        cuboidPart.minY,
        cuboidPart.maxY,
        cuboidPart.minZ,
        other.maxZ
      );
    }

    return newCuboids;
  }
}

export class Day22 extends Day {
  public solvePartOne(input: string): number {
    const cuboids: Record<string, Cuboid> = this._getEndCuboidState(input);
    return Object.values(cuboids).reduce((total, curr) => total + curr.getCuboidVolumeWithinCentre50(), 0);
  }

  public solvePartTwo(input: string): number {
    const cuboids: Record<string, Cuboid> = this._getEndCuboidState(input);
    return Object.values(cuboids).reduce((total, curr) => total + curr.getCuboidVolume(), 0);
  }

  private _getEndCuboidState(input: string): Record<string, Cuboid> {
    const instructions = splitLines(input).map((line) => CubeInstruction.deserialise(line));
    const cuboids: Record<string, Cuboid> = {};

    instructions.forEach((instruction) => {
      const cuboid: Cuboid = instruction.getCuboid();
      let cuboidsToAdd: Cuboid[] = [];

      if (instruction.operation == CubeOperation.ON) {
        // Iterate over existing cuboids, if any have overlap, modify current cuboid to avoid overlap and add to Record
        cuboidsToAdd.push(cuboid);

        Object.values(cuboids).forEach((existingCuboid) => {
          cuboidsToAdd = cuboidsToAdd.flatMap((c) => c.getNonOverlappingCuboids(existingCuboid));
        });

        cuboidsToAdd.forEach((c) => {
          cuboids[c.serialisedValue] = c;
        });
      } else {
        // Iterate over existing cuboids, if any have overlap, modify those cuboid to remove overlap and update Record
        const cuboidsToRemove: Cuboid[] = [];

        Object.values(cuboids).forEach((existingCuboid) => {
          const splitCuboids: Cuboid[] = existingCuboid.getNonOverlappingCuboids(cuboid);

          if (splitCuboids.length !== 1 || splitCuboids[0].serialisedValue !== existingCuboid.serialisedValue) {
            cuboidsToRemove.push(existingCuboid);
            cuboidsToAdd.push(...splitCuboids);
          }
        });

        cuboidsToRemove.forEach((c) => {
          delete cuboids[c.serialisedValue];
        });
      }

      cuboidsToAdd.forEach((c) => {
        cuboids[c.serialisedValue] = c;
      });
    });
    return cuboids;
  }

  private _naiveSolveMethod(input: string): number {
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
}
