import * as fs from "fs";

export abstract class Day {
  constructor(private dayId: string) {}

  /**
   * Runs Part One of the given day, if puzzleInput is true, uses the actual puzzle input, otherwise uses the
   * test input.
   */
  public partOne(puzzleInput: boolean = true): any {
    const input = this.loadFile(puzzleInput);
    return this.solvePartOne(input);
  }

  protected abstract solvePartOne(input: string): any;

  /**
   * Runs Part Two of the given day, if puzzleInput is true, uses the actual puzzle input, otherwise uses the
   * test input.
   */
  public partTwo(puzzleInput: boolean = true): any {
    const input = this.loadFile(puzzleInput);
    return this.solvePartTwo(input);
  }

  protected abstract solvePartTwo(input: string): any;

  private loadFile(puzzleInput: boolean): any {
    const file = fs.readFileSync(
      `${puzzleInput ? "inputs" : "test_inputs"}/day${this.dayId}.txt`
    );
    return file.toString();
  }

  protected splitLines(input: string): string[] {
    return input.split("\r\n");
  }
}
