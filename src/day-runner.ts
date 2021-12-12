import { Day } from "./day";
import { DAYS } from "./days";

export class DayRunner {
  constructor(private _puzzleInput: boolean) {}

  public processParamsAndRun(params: string[]): void {
    if (params.length) {
      const dayId: number = parseInt(params[0], 10);

      if (params.length >= 2 && params[1] == "a") {
        this.runDayPartOne(dayId);
      } else if (params.length >= 2 && params[1] == "b") {
        this.runDayPartTwo(dayId);
      } else {
        this.runDay(dayId);
      }
    } else {
      console.log(
        `Usage: npm run ${this._puzzleInput ? "start" : "test"} [day] [a|b| ]`
      );
      console.log(`Available days: [ ${Object.keys(DAYS).join(", ")} ]`);
    }
  }

  public runDay(dayId: number): void {
    this.runDayPartOne(dayId);
    this.runDayPartTwo(dayId);
  }

  public runDayPartOne(dayId: number): void {
    const day: Day = this._getDay(dayId);

    const partOneResult: any = day.partOne(this._puzzleInput);
    console.log("Part One Result: ", partOneResult);
  }

  public runDayPartTwo(dayId: number): void {
    const day: Day = this._getDay(dayId);

    const partTwoResult: any = day.partTwo(this._puzzleInput);
    console.log("Part Two Result: ", partTwoResult);
  }

  private _getDay(dayId: number): Day {
    if (!DAYS[dayId]) {
      console.log(`No code defined for day ${dayId}`);
    }

    return DAYS[dayId];
  }
}
