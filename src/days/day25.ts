import { BaseCoordinate } from "../common/coordinate";
import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

enum Direction {
  EAST,
  SOUTH,
}

class SeaCucumber extends BaseCoordinate {
  private _serialisedValue: string;

  constructor(public x: number, public y: number, public direction: Direction) {
    super(x, y);
    this._serialisedValue = `${x},${y}`;
  }

  public get serialisedValue(): string {
    return this._serialisedValue;
  }

  public getNextPosition(maxX: number, maxY: number): SeaCucumber {
    return this.direction === Direction.EAST
      ? new SeaCucumber(this.x < maxX ? this.x + 1 : 0, this.y, this.direction)
      : new SeaCucumber(this.x, this.y < maxY ? this.y + 1 : 0, this.direction);
  }
}

export class Day25 extends Day {
  public solvePartOne(input: string): number {
    const cucumbers: SeaCucumber[] = splitLines(input).flatMap((line, lineIndex) =>
      line
        .split("")
        .map((value, valueIndex) => {
          const direction: Direction = value === ">" ? Direction.EAST : value === "v" ? Direction.SOUTH : null;
          return direction != null ? new SeaCucumber(valueIndex, lineIndex, direction) : null;
        })
        .filter((val) => !!val)
    );

    const maxX: number = Math.max(...cucumbers.map((val) => val.x));
    const maxY: number = Math.max(...cucumbers.map((val) => val.y));

    let step: number = 0;
    let hasUpdated: boolean = true;

    let eastFacingCucumbers: Record<string, SeaCucumber> = cucumbers
      .filter((c) => c.direction === Direction.EAST)
      .reduce((map: Record<string, SeaCucumber>, currentCoord) => {
        map[currentCoord.serialisedValue] = currentCoord;
        return map;
      }, {});
    let southFacingCucumbers: Record<string, SeaCucumber> = cucumbers
      .filter((c) => c.direction === Direction.SOUTH)
      .reduce((map: Record<string, SeaCucumber>, currentCoord) => {
        map[currentCoord.serialisedValue] = currentCoord;
        return map;
      }, {});

    while (hasUpdated) {
      step += 1;
      hasUpdated = false;

      const newEastFacingCucumbers: Record<string, SeaCucumber> = {};
      Object.values(eastFacingCucumbers).forEach((cucumber) => {
        const nextPostion: SeaCucumber = cucumber.getNextPosition(maxX, maxY);
        if (!eastFacingCucumbers[nextPostion.serialisedValue] && !southFacingCucumbers[nextPostion.serialisedValue]) {
          newEastFacingCucumbers[nextPostion.serialisedValue] = nextPostion;
          hasUpdated = true;
        } else {
          newEastFacingCucumbers[cucumber.serialisedValue] = cucumber;
        }
      });
      eastFacingCucumbers = newEastFacingCucumbers;

      const newSouthFacingCucumbers: Record<string, SeaCucumber> = {};
      Object.values(southFacingCucumbers).forEach((cucumber) => {
        const nextPostion: SeaCucumber = cucumber.getNextPosition(maxX, maxY);
        if (!eastFacingCucumbers[nextPostion.serialisedValue] && !southFacingCucumbers[nextPostion.serialisedValue]) {
          newSouthFacingCucumbers[nextPostion.serialisedValue] = nextPostion;
          hasUpdated = true;
        } else {
          newSouthFacingCucumbers[cucumber.serialisedValue] = cucumber;
        }
      });
      southFacingCucumbers = newSouthFacingCucumbers;
    }

    return step;
  }

  public solvePartTwo(input: string): number {
    // No part two
    return -1;
  }
}
