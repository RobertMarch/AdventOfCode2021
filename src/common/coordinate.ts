export class BaseCoordinate {
  public static addCoordinates(a: BaseCoordinate, b: BaseCoordinate): BaseCoordinate {
    return new BaseCoordinate(a.x + b.x, a.y + b.y);
  }

  constructor(public x: number, public y: number) {}

  public equals(other: BaseCoordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }
}

export class Base3DCoordinate {
  public static fromArray(coordinates: number[]): Base3DCoordinate {
    if (coordinates.length !== 3) {
      throw new Error(`Unexpected number of coordinates given: expected 3, got ${coordinates.length}`);
    }
    return new Base3DCoordinate(coordinates[0], coordinates[1], coordinates[2]);
  }

  constructor(public x: number, public y: number, public z: number) {}

  public getVectorFromOtherCoordinate(other: Base3DCoordinate): Base3DCoordinate {
    return new Base3DCoordinate(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  public static addCoordinates(a: Base3DCoordinate, b: Base3DCoordinate): Base3DCoordinate {
    return new Base3DCoordinate(a.x + b.x, a.y + b.y, a.z + b.z);
  }

  public equals(other: Base3DCoordinate): boolean {
    return this.x === other.x && this.y === other.y && this.z === other.z;
  }

  public getManhattanMagnitude(): number {
    return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
  }
}
