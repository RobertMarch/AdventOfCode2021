import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

export class Day01 extends Day {
  public solvePartOne(input: string): number {
    const input_lines: number[] = splitLines(input).map((val) =>
      Number.parseInt(val)
    );
    let increases: number = 0;
    input_lines.forEach((depth: number, index: number) => {
      if (index != 0 && depth > input_lines[index - 1]) {
        increases++;
      }
    });
    return increases;
  }

  public solvePartTwo(input: string): number {
    const input_lines: number[] = splitLines(input).map((val) =>
      Number.parseInt(val)
    );
    let increases: number = 0;
    input_lines.forEach((depth: number, index: number) => {
      if (index >= 2 && depth > input_lines[index - 3]) {
        increases++;
      }
    });
    return increases;
  }
}
