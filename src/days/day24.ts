import { Day } from "../day";
import { range } from "../utils/array-utils";
import { splitLines } from "../utils/string-utils";

const InputBlockRegex =
  /inp w\nmul x 0\nadd x z\nmod x 26\ndiv z (\d+)\nadd x (-?\d+)\neql x w\neql x 0\nmul y 0\nadd y 25\nmul y x\nadd y 1\nmul z y\nmul y 0\nadd y w\nadd y (-?\d+)\nmul y x\nadd z y/g;

export class Day24 extends Day {
  public solvePartOne(input: string): number {
    return this._solve(input, true);
  }

  public solvePartTwo(input: string): number {
    return this._solve(input, false);
  }

  private _solve(input: string, solveForMaximum: boolean): number {
    const inputBlocks: number[][] = [...input.matchAll(InputBlockRegex)].map((block) =>
      block.slice(1).map((val) => parseInt(val))
    );

    let partialModelNumbersToZValues: Record<number, number> = { 0: 0 };

    inputBlocks.forEach((block: number[], blockIndex: number) => {
      const previousPartialModelNumbers: number[] = Object.keys(partialModelNumbersToZValues)
        .map((val) => parseInt(val))
        .sort((a, b) => (solveForMaximum ? b - a : a - b));
      const previousZStates: Set<number> = new Set();
      const newPartialModelNumbersToZValues: Record<number, number> = {};

      previousPartialModelNumbers.forEach((partialModelNumber) => {
        const zValue: number = partialModelNumbersToZValues[partialModelNumber];

        if (!previousZStates.has(zValue)) {
          previousZStates.add(zValue);
          if (zValue <= this._calculateRemainingZDivisor(inputBlocks, blockIndex)) {
            range(1, 10).forEach((i) => {
              newPartialModelNumbersToZValues[partialModelNumber * 10 + i] = this._calculateFinalZValueAfterBlock(
                zValue,
                i,
                block
              );
            });
          }
        }
      });

      partialModelNumbersToZValues = newPartialModelNumbersToZValues;
    });

    const validModelNumbers: number[] = Object.keys(partialModelNumbersToZValues)
      .map((val) => parseInt(val))
      .filter((modelNumber) => partialModelNumbersToZValues[modelNumber] === 0);
    return solveForMaximum ? Math.max(...validModelNumbers) : Math.min(...validModelNumbers);
  }

  /**
   * Calculates the final z value after a block of code, assumes input matches the same operations.
   */
  private _calculateFinalZValueAfterBlock(initialZ: number, inputW: number, block: number[]): number {
    const x1: number = (initialZ % 26) + block[1] != inputW ? 1 : 0;
    const z1: number = Math.floor(initialZ / block[0]);
    return (25 * x1 + 1) * z1 + (inputW + block[2]) * x1;
  }

  /**
   * Calculates the maximum Z value that could be reduced to a 0 from all blocks after the current block (inclusive).
   */
  private _calculateRemainingZDivisor(blocks: number[][], currentIndex: number): number {
    return blocks.slice(currentIndex).reduce((total, curr) => total * curr[0], 1) - 1;
  }
}
