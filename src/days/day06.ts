import { Day } from "../day";

export class Day06 extends Day {
  public solvePartOne(input: string): number {
    const schoolCounts: Record<number, number> = this._generateCounts(input);

    for (let i = 0; i < 80; i++) {
      this._updateSchoolCounts(schoolCounts);
    }

    return this._countFish(schoolCounts);
  }

  public solvePartTwo(input: string): number {
    const schoolCounts: Record<number, number> = this._generateCounts(input);

    for (let i = 0; i < 256; i++) {
      this._updateSchoolCounts(schoolCounts);
    }

    return this._countFish(schoolCounts);
  }

  private _generateCounts(input: string): Record<number, number> {
    const schoolCounts: Record<number, number> = {};
    input.split(",").forEach((fish: string) => {
      const fishInt: number = parseInt(fish);
      schoolCounts[fishInt] = (schoolCounts[fishInt] || 0) + 1;
    });

    return schoolCounts;
  }

  private _updateSchoolCounts(schoolCounts: Record<number, number>): void {
    const initialZeroCount: number = schoolCounts[0];
    for (let i = 0; i < 8; i++) {
      schoolCounts[i] = schoolCounts[i + 1] || 0;
    }
    schoolCounts[6] = (schoolCounts[6] || 0) + initialZeroCount;
    schoolCounts[8] = initialZeroCount;
  }

  private _countFish(fish: Record<number, number>): number {
    return Object.values(fish).reduce((total, curr) => total + curr, 0);
  }
}
