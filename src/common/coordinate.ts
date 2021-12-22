export class BaseCoordinate {
  constructor(public x: number, public y: number) {}

  public equals(other: BaseCoordinate): boolean {
    return this.x === other.x && this.y === other.y;
  }
}
