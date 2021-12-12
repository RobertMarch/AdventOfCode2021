import { Day } from "./day";
import { DAYS, TEST_CASES } from "./days";
import * as fs from "fs";
import { TestCase } from "../test_inputs/test-case";

export class DayRunner {
  private _dayId: number = -1;

  constructor(private _runTestCases: boolean) {}

  public processParamsAndRun(params: string[]): void {
    if (params.length) {
      const dayId: number = parseInt(params[0], 10);
      this._dayId = dayId;

      if (params.length >= 2 && params[1] == "a") {
        this.runDayPartOne();
      } else if (params.length >= 2 && params[1] == "b") {
        this.runDayPartTwo();
      } else {
        this.runDay();
      }
    } else {
      console.log(
        `Usage: npm run ${this._runTestCases ? "test" : "start"} [day] [a|b| ]`
      );
      console.log(`Available days: [ ${Object.keys(DAYS).join(", ")} ]`);
    }
  }

  public runDay(): void {
    this.runDayPartOne();
    this.runDayPartTwo();
  }

  public runDayPartOne(): void {
    const day: Day = this._getDay();
    const cases: TestCase[] = this._runTestCases
      ? this._getTestCases()
      : [this._loadFile()];

    cases.forEach((testCase: TestCase) => {
      const partOneResult: any = day.solvePartOne(testCase.input);
      console.log(
        this._formatOutputString(
          "One",
          partOneResult,
          testCase.expectedPartOneOutput
        )
      );
    });
  }

  public runDayPartTwo(): void {
    const day: Day = this._getDay();
    const cases: TestCase[] = this._runTestCases
      ? this._getTestCases()
      : [this._loadFile()];

    cases.forEach((testCase: TestCase) => {
      const partTwoResult: any = day.solvePartTwo(testCase.input);
      console.log(
        this._formatOutputString(
          "Two",
          partTwoResult,
          testCase.expectedPartTwoOutput
        )
      );
    });
  }

  private _getDay(): Day {
    if (!DAYS[this._dayId]) {
      console.log(`No code defined for day ${this._dayId}`);
    }

    return DAYS[this._dayId];
  }

  private _getTestCases(): TestCase[] {
    if (!TEST_CASES[this._dayId]) {
      console.log(`No test cases defined for day ${this._dayId}`);
    }

    return TEST_CASES[this._dayId];
  }

  private _loadFile(): TestCase {
    const file = fs.readFileSync(
      `inputs/day${("0" + this._dayId).slice(-2)}.txt`
    );
    return {
      input: file.toString(),
    };
  }

  private _formatOutputString(
    part: string,
    actualResult: any,
    expectedResult: any
  ): string {
    return `Part ${part}${
      !!expectedResult
        ? `${
            actualResult === expectedResult
              ? " Success!"
              : ` Failed! Expected: ${expectedResult}, Actual`
          }`
        : ""
    } Result: ${actualResult}`;
  }
}
