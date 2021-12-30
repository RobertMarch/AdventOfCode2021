import { Base3DCoordinate, BaseCoordinate } from "../common/coordinate";
import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

function rotateAroundX(coordinate: Base3DCoordinate, times: number): Base3DCoordinate {
  Array(times)
    .fill(0)
    .forEach(() => {
      coordinate = new Base3DCoordinate(coordinate.x, coordinate.z, -coordinate.y);
    });
  return coordinate;
}

function rotateAroundY(coordinate: Base3DCoordinate, times: number): Base3DCoordinate {
  Array(times)
    .fill(0)
    .forEach(() => {
      coordinate = new Base3DCoordinate(coordinate.z, coordinate.y, -coordinate.x);
    });
  return coordinate;
}

function rotateAroundZ(coordinate: Base3DCoordinate, times: number): Base3DCoordinate {
  Array(times)
    .fill(0)
    .forEach(() => {
      coordinate = new Base3DCoordinate(coordinate.y, -coordinate.x, coordinate.z);
    });
  return coordinate;
}

function reverseVector(coordinate: Base3DCoordinate): Base3DCoordinate {
  return new Base3DCoordinate(-coordinate.x, -coordinate.y, -coordinate.z);
}

const allRotations: ((coordinate: Base3DCoordinate) => Base3DCoordinate)[] = [
  // x => +x
  (coordinate: Base3DCoordinate) => coordinate,
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 3),
  // x => -x
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 2), 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 2), 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 2), 3),
  // x => +z
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 1), 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 1), 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 1), 3),
  // x => -z
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 3),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 3), 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 3), 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundY(coordinate, 3), 3),
  // x => +y
  (coordinate: Base3DCoordinate) => rotateAroundZ(coordinate, 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 1), 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 1), 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 1), 3),
  // x => -y
  (coordinate: Base3DCoordinate) => rotateAroundZ(coordinate, 3),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 3), 1),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 3), 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(rotateAroundZ(coordinate, 3), 3),
];

const rotationsUnmappings: ((coordinate: Base3DCoordinate) => Base3DCoordinate)[] = [
  // x => +x
  (coordinate: Base3DCoordinate) => coordinate,
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 3),
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 2),
  (coordinate: Base3DCoordinate) => rotateAroundX(coordinate, 1),
  // x => -x
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 2),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 3), 2),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 2), 2),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 1), 2),
  // x => +z
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 3),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 3), 3),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 2), 3),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 1), 3),
  // x => -z
  (coordinate: Base3DCoordinate) => rotateAroundY(coordinate, 1),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 3), 1),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 2), 1),
  (coordinate: Base3DCoordinate) => rotateAroundY(rotateAroundX(coordinate, 1), 1),
  // x => +y
  (coordinate: Base3DCoordinate) => rotateAroundZ(coordinate, 3),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 3), 3),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 2), 3),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 1), 3),
  // x => -y
  (coordinate: Base3DCoordinate) => rotateAroundZ(coordinate, 1),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 3), 1),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 2), 1),
  (coordinate: Base3DCoordinate) => rotateAroundZ(rotateAroundX(coordinate, 1), 1),
];

class DirectionalVector {
  public start: Base3DCoordinate;
  public end: Base3DCoordinate;
  public vector: Base3DCoordinate;
  public rotationIndex: number;

  public static createFromPoints(start: Base3DCoordinate, end: Base3DCoordinate) {
    let vector: Base3DCoordinate = end.getVectorFromOtherCoordinate(start);

    let bestVector: Base3DCoordinate = null;
    let bestRotationIndex: number = null;
    let bestVectorFlipped: boolean = null;

    allRotations.forEach((rotation, index) => {
      const rotatedCoordinate = rotation(vector);
      const reversedRotatedCoordinate = reverseVector(rotatedCoordinate);
      if (
        !bestVector ||
        rotatedCoordinate.x > bestVector.x ||
        (rotatedCoordinate.x >= bestVector.x && rotatedCoordinate.y > bestVector.y) ||
        (rotatedCoordinate.x >= bestVector.x &&
          rotatedCoordinate.y >= bestVector.y &&
          rotatedCoordinate.z > bestVector.z)
      ) {
        bestVector = rotatedCoordinate;
        bestRotationIndex = index;
        bestVectorFlipped = false;
      }
      if (
        !bestVector ||
        reversedRotatedCoordinate.x > bestVector.x ||
        (reversedRotatedCoordinate.x >= bestVector.x && reversedRotatedCoordinate.y > bestVector.y) ||
        (reversedRotatedCoordinate.x >= bestVector.x &&
          reversedRotatedCoordinate.y >= bestVector.y &&
          reversedRotatedCoordinate.z > bestVector.z)
      ) {
        bestVector = reversedRotatedCoordinate;
        bestRotationIndex = index;
        bestVectorFlipped = true;
      }
    });

    const result: DirectionalVector = new DirectionalVector();
    result.vector = bestVector;
    result.rotationIndex = bestRotationIndex;
    result.start = bestVectorFlipped ? end : start;
    result.end = bestVectorFlipped ? start : end;
    return result;
  }
}

interface MatchedVector {
  knownVector: DirectionalVector;
  newVector: DirectionalVector;
}

class Scanner {
  private relativeBeaconPositions: Base3DCoordinate[];
  private beaconDifferenceVectors: DirectionalVector[] = [];

  private scannerLocation: DirectionalVector;

  constructor(stringValue: string) {
    this.relativeBeaconPositions = splitLines(stringValue)
      .slice(1)
      .map((line) => Base3DCoordinate.fromArray(line.split(",").map((val) => parseInt(val))));

    this.relativeBeaconPositions.forEach((beacon1: Base3DCoordinate, index: number) =>
      this.relativeBeaconPositions
        .slice(index + 1)
        .forEach((beacon2: Base3DCoordinate) =>
          this.beaconDifferenceVectors.push(DirectionalVector.createFromPoints(beacon1, beacon2))
        )
    );
  }

  public getAllRelativeBeaconPositions(): Base3DCoordinate[] {
    return this.relativeBeaconPositions;
  }

  public getAllBeaconDifferenceVectors(): DirectionalVector[] {
    return this.beaconDifferenceVectors;
  }

  public setScannerLocation(location: Base3DCoordinate, orientation: number): void {
    this.scannerLocation = new DirectionalVector();
    this.scannerLocation.vector = location;
    this.scannerLocation.rotationIndex = orientation;
  }

  public getVectorIntersectWithKnownVectors(knownVectors: DirectionalVector[]): MatchedVector[] {
    return this.beaconDifferenceVectors.flatMap((vector) =>
      knownVectors
        .map((knownVector) =>
          knownVector.vector.equals(vector.vector) ? { knownVector: knownVector, newVector: vector } : null
        )
        .filter((val) => !!val)
    );
  }
}

export class Day19 extends Day {
  private _scanners: Scanner[];
  private _knownPoints: Base3DCoordinate[];
  private _knownScanners: number[];

  public solvePartOne(input: string): number {
    // const test = new Base3DCoordinate(1, 2, 3);
    // for (let i = 0; i < allRotations.length; i++) {
    //   console.log(allRotations[i](test), rotationsUnmappings[i](test), rotationsUnmappings[i](allRotations[i](test)));
    // }
    this._scanners = splitLines(input, true, 2).map((value) => new Scanner(value));

    this._knownPoints = [];
    this._knownScanners = [];

    this._addScannerToKnownPoints(0, new Base3DCoordinate(0, 0, 0), 0);

    // console.log((this._scanners[2] as any).scannerLocation);
    return this._knownPoints.length;
  }

  private _addScannerToKnownPoints(
    scannerIndex: number,
    scannerLocation: Base3DCoordinate,
    scannerOrientation: number
  ): void {
    this._knownScanners.push(scannerIndex);
    const scanner: Scanner = this._scanners[scannerIndex];
    scanner.setScannerLocation(scannerLocation, scannerOrientation);

    let scannerReorientedPoints: Base3DCoordinate[] = this._updatePointsForScannerPosition(
      scanner,
      scannerLocation,
      scannerOrientation
    );

    const reorientedScannerVectors: DirectionalVector[] = scannerReorientedPoints.flatMap(
      (beacon1: Base3DCoordinate, index: number) =>
        scannerReorientedPoints
          .slice(index + 1)
          .map((beacon2: Base3DCoordinate) => DirectionalVector.createFromPoints(beacon1, beacon2))
    );

    this._knownPoints.push(
      ...scannerReorientedPoints.filter((point) => !this._knownPoints.some((p) => p.equals(point)))
    );

    // console.log(scannerIndex, this._knownPoints.length, reorientedScannerVectors.length);

    this._scanners.forEach((otherScanner: Scanner, otherIndex: number) => {
      if (!this._knownScanners.includes(otherIndex)) {
        const intersectionOfVectors: MatchedVector[] =
          otherScanner.getVectorIntersectWithKnownVectors(reorientedScannerVectors);

        if (intersectionOfVectors.length >= 66) {
          // console.log(otherIndex, scannerIndex, intersectionOfVectors.length);

          // Work out new center and orientation
          // Issues start when adding scanner 4 (first chained one, so check here first)
          const vector: MatchedVector = intersectionOfVectors[0];
          const knownStart = vector.knownVector.start;
          const otherScannerRelativeStart = vector.newVector.start;

          const knownVector = vector.knownVector.end.getVectorFromOtherCoordinate(vector.knownVector.start); // rotationsUnmappings[vector.knownVector.rotationIndex](vector.knownVector.vector);
          const newVector = vector.newVector.end.getVectorFromOtherCoordinate(vector.newVector.start); //rotationsUnmappings[vector.newVector.rotationIndex](vector.newVector.vector);

          let mappingIndex = null;
          allRotations.forEach((rotation, index) => {
            if (rotation(newVector).equals(knownVector)) {
              mappingIndex = index;
            }
          });

          const mappingLocation = Base3DCoordinate.addCoordinates(
            knownStart,
            reverseVector(allRotations[mappingIndex](otherScannerRelativeStart))
          );

          this._addScannerToKnownPoints(otherIndex, mappingLocation, mappingIndex);
        }
      }
    });
  }

  private _updatePointsForScannerPosition(scanner: Scanner, location, orientation): Base3DCoordinate[] {
    const orientationUnmapping: (Base3DCoordinate) => Base3DCoordinate = allRotations[orientation];
    return scanner
      .getAllRelativeBeaconPositions()
      .map((coordinate) => Base3DCoordinate.addCoordinates(location, orientationUnmapping(coordinate)));
  }

  public solvePartTwo(input: string): number {
    return -1;
  }
}
