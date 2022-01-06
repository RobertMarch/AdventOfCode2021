import { BaseCoordinate } from "../common/coordinate";
import { Day } from "../day";
import { splitLines } from "../utils/string-utils";
import * as lodash from "lodash";
import { range } from "../utils/array-utils";

enum AmphipodType {
  A = "A",
  B = "B",
  C = "C",
  D = "D",
}

const AmphipodEnergyUsage: Record<AmphipodType, number> = {
  A: 1,
  B: 10,
  C: 100,
  D: 1000,
};

const AmphipodTargetColumn: Record<AmphipodType, number> = {
  A: 2,
  B: 4,
  C: 6,
  D: 8,
};

const Directions: BaseCoordinate[] = [
  new BaseCoordinate(-1, 0),
  new BaseCoordinate(1, 0),
  new BaseCoordinate(0, -1),
  new BaseCoordinate(0, 1),
];

interface Move {
  newCoord: Location;
  moveCost: number;
  amphipod: Amphipod;
}

class Amphipod {
  constructor(public type: AmphipodType, public currentLocation: string) {}

  public isInCorrectLocation(allAmphipods: Record<string, Amphipod>): boolean {
    const location: Location = this._getLocation();
    if (this.type !== location.targetRoomForType) {
      return false;
    }

    return range(1, 5).every(
      (index) =>
        index <= location.y ||
        !AllLocations[`${location.x},${index}`] ||
        allAmphipods[`${location.x},${index}`]?.type === AllLocations[`${location.x},${index}`].targetRoomForType
    );
  }

  public getPossibleMoves(allAmphipods: Record<string, Amphipod>): Location[] {
    if (this.isInCorrectLocation(allAmphipods)) {
      return [];
    }

    const currentLocation = this._getLocation();

    const possibleMoves: Location[] = this._recursivelyGetNeighbours(currentLocation, null, allAmphipods).filter(
      (move: Location) =>
        move.canStop &&
        !move.equals(currentLocation) &&
        (!move.targetRoomForType || move.targetRoomForType === this.type)
    );

    const hasMoved = currentLocation.y === 0;

    const moveToDestination: Location = possibleMoves.find(
      (loc) =>
        loc.x === AmphipodTargetColumn[this.type] &&
        range(1, 5).every(
          (index) =>
            index <= loc.y ||
            !AllLocations[`${loc.x},${index}`] ||
            allAmphipods[`${loc.x},${index}`]?.type === this.type
        )
    );

    if (moveToDestination) {
      return [moveToDestination];
    } else {
      return hasMoved ? [] : possibleMoves.filter((loc) => loc.y == 0);
    }
  }

  private _recursivelyGetNeighbours(
    location: Location,
    previousLocation: Location,
    allAmphipods: Record<string, Amphipod>
  ): Location[] {
    return [
      location,
      ...location
        .getNeighbours()
        .filter(
          (neighbour: Location) =>
            (!previousLocation || !neighbour.equals(previousLocation)) && !allAmphipods[neighbour.serialisedValue]
        )
        .flatMap((neighbour: Location) => this._recursivelyGetNeighbours(neighbour, location, allAmphipods)),
    ];
  }

  private _getLocation(): Location {
    return AllLocations[this.currentLocation];
  }
}

class Location extends BaseCoordinate {
  public static addCoordinatesAndSerialise(a: Location, b: BaseCoordinate): string {
    return new Location(a.x + b.x, a.y + b.y, false, null).serialisedValue;
  }

  private _serialisedValue: string;

  constructor(public x: number, public y: number, public canStop: boolean, public targetRoomForType: AmphipodType) {
    super(x, y);
    this._serialisedValue = `${x},${y}`;
  }

  public get serialisedValue(): string {
    return this._serialisedValue;
  }

  public getNeighbours(): Location[] {
    return Directions.map(
      (direction: BaseCoordinate) => AllLocations[Location.addCoordinatesAndSerialise(this, direction)]
    ).filter((coord: Location) => !!coord);
  }
}

let AllLocations: Record<string, Location>;

function defineAllLocationsList(part: "a" | "b"): void {
  const locations = [
    new Location(0, 0, true, null),
    new Location(1, 0, true, null),
    new Location(2, 0, false, null),
    new Location(3, 0, true, null),
    new Location(4, 0, false, null),
    new Location(5, 0, true, null),
    new Location(6, 0, false, null),
    new Location(7, 0, true, null),
    new Location(8, 0, false, null),
    new Location(9, 0, true, null),
    new Location(10, 0, true, null),
    new Location(2, 1, true, AmphipodType.A),
    new Location(2, 2, true, AmphipodType.A),
    new Location(4, 1, true, AmphipodType.B),
    new Location(4, 2, true, AmphipodType.B),
    new Location(6, 1, true, AmphipodType.C),
    new Location(6, 2, true, AmphipodType.C),
    new Location(8, 1, true, AmphipodType.D),
    new Location(8, 2, true, AmphipodType.D),
  ];
  if (part == "b") {
    locations.push(
      new Location(2, 3, true, AmphipodType.A),
      new Location(2, 4, true, AmphipodType.A),
      new Location(4, 3, true, AmphipodType.B),
      new Location(4, 4, true, AmphipodType.B),
      new Location(6, 3, true, AmphipodType.C),
      new Location(6, 4, true, AmphipodType.C),
      new Location(8, 3, true, AmphipodType.D),
      new Location(8, 4, true, AmphipodType.D)
    );
  }
  AllLocations = locations.reduce((map, curr) => {
    map[curr.serialisedValue] = curr;
    return map;
  }, {});
}

export class Day23 extends Day {
  private _cachedResults: Map<string, number>;

  public solvePartOne(input: string): number {
    defineAllLocationsList("a");
    const lines: string[] = splitLines(input, false);
    const amphipods: Record<string, Amphipod> = lines
      .slice(2, 4)
      .flatMap((line, index) => {
        return [
          new Amphipod(line[3] as AmphipodType, `2,${index + 1}`),
          new Amphipod(line[5] as AmphipodType, `4,${index + 1}`),
          new Amphipod(line[7] as AmphipodType, `6,${index + 1}`),
          new Amphipod(line[9] as AmphipodType, `8,${index + 1}`),
        ];
      })
      .reduce((map, curr) => {
        map[curr.currentLocation] = curr;
        return map;
      }, {});

    this._cachedResults = new Map();
    return this._getBestEnergyCostFromCurrentSetup(amphipods);
  }

  private _getBestEnergyCostFromCurrentSetup(amphipods: Record<string, Amphipod>): number {
    const serialisedAmphipodSetup: string = this._serialiseAmphipodConfig(amphipods);
    if (this._cachedResults.has(serialisedAmphipodSetup)) {
      return this._cachedResults.get(serialisedAmphipodSetup);
    }

    if (Object.values(amphipods).every((amphipod) => amphipod.isInCorrectLocation(amphipods))) {
      this._cachedResults.set(serialisedAmphipodSetup, 0);
      return 0;
    }

    const costs: number[] = Object.values(amphipods).flatMap((amphipod) => {
      return amphipod
        .getPossibleMoves(amphipods)
        .map((newLoc) => {
          const move: Move = {
            newCoord: newLoc,
            amphipod: amphipod,
            moveCost: this._getMoveCost(amphipod, newLoc),
          };

          const newAmphipods: Record<string, Amphipod> = this._cloneAmphipodsAndApplyMove(amphipods, move);

          const bestRemainingMove = this._getBestEnergyCostFromCurrentSetup(newAmphipods);

          return bestRemainingMove === null ? null : move.moveCost + bestRemainingMove;
        })
        .filter((val) => !!val);
    });

    this._cachedResults.set(serialisedAmphipodSetup, costs.length > 0 ? Math.min(...costs) : null);
    if (costs.length > 0) {
      return Math.min(...costs);
    }
    return costs.length > 0 ? Math.min(...costs) : null;
  }

  /**
   * Gets the energy cost to move the given amphipod to the location. Note the energy is always the difference in x
   * plus the sum of y values as amphipods must return to y = 0 to go to a different side room, and will never move
   * within a side room.
   */
  private _getMoveCost(amphipod: Amphipod, newLocation: Location): number {
    const currentLocation: Location = AllLocations[amphipod.currentLocation];

    let distance: number = Math.abs(currentLocation.x - newLocation.x) + currentLocation.y + newLocation.y;

    return distance * AmphipodEnergyUsage[amphipod.type];
  }

  private _cloneAmphipodsAndApplyMove(allAmphipods: Record<string, Amphipod>, move: Move): Record<string, Amphipod> {
    const newAmphipods: Record<string, Amphipod> = {};
    Object.keys(allAmphipods).forEach((position) => {
      if (position === move.amphipod.currentLocation) {
        newAmphipods[move.newCoord.serialisedValue] = new Amphipod(move.amphipod.type, move.newCoord.serialisedValue);
      } else {
        newAmphipods[position] = lodash.clone(allAmphipods[position]);
      }
    });
    return newAmphipods;
  }

  private _serialiseAmphipodConfig(allAmphipods: Record<string, Amphipod>): string {
    return Object.keys(AllLocations)
      .map((loc) => allAmphipods[loc]?.type ?? ".")
      .join("");
  }

  public solvePartTwo(input: string): number {
    defineAllLocationsList("b");
    const lines: string[] = splitLines(input, false);
    const amphipods: Amphipod[] = lines.slice(2, 4).flatMap((line, index) => {
      return [
        new Amphipod(line[3] as AmphipodType, `2,${index * 3 + 1}`),
        new Amphipod(line[5] as AmphipodType, `4,${index * 3 + 1}`),
        new Amphipod(line[7] as AmphipodType, `6,${index * 3 + 1}`),
        new Amphipod(line[9] as AmphipodType, `8,${index * 3 + 1}`),
      ];
    });

    const additionalAmphipods: Amphipod[] = [
      new Amphipod(AmphipodType.A, "8,2"),
      new Amphipod(AmphipodType.A, "6,3"),
      new Amphipod(AmphipodType.B, "6,2"),
      new Amphipod(AmphipodType.B, "4,3"),
      new Amphipod(AmphipodType.C, "4,2"),
      new Amphipod(AmphipodType.C, "8,3"),
      new Amphipod(AmphipodType.D, "2,2"),
      new Amphipod(AmphipodType.D, "2,3"),
    ];

    const allAmphipods: Record<string, Amphipod> = [...amphipods, ...additionalAmphipods].reduce((map, curr) => {
      map[curr.currentLocation] = curr;
      return map;
    }, {});

    this._cachedResults = new Map();
    const res = this._getBestEnergyCostFromCurrentSetup(allAmphipods);
    return res;
  }
}
