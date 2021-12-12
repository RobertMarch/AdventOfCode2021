import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

interface BoardResult {
  roundsToBingo: number;
  score: number;
}

class Board {
  private rowsAndCols: string[][] = [];
  private allNumbers: number[] = [];

  constructor(rawString: string) {
    const rows: string[][] = splitLines(rawString).map((line) =>
      line.split(" ").filter((val) => val.length > 0)
    );
    const cols: string[][] = [[], [], [], [], []];
    rows.forEach((row: string[]) => {
      row.forEach((val: string, index: number) => {
        cols[index].push(val);
      });
    });

    this.rowsAndCols.push(...rows, ...cols);
    this.allNumbers.push(...rows.flat().map((val) => Number.parseInt(val)));
  }

  public evaluateBoard(calls: string[]): BoardResult | null {
    const calledNumbers: string[] = [];

    for (let call of calls) {
      calledNumbers.push(call);

      if (
        this.rowsAndCols.some((set: string[]) =>
          set.every((val) => calledNumbers.includes(val))
        )
      ) {
        return {
          roundsToBingo: calls.indexOf(call),
          score: this._calculateScore(calledNumbers),
        };
      }
    }

    return null;
  }

  private _calculateScore(called: string[]): number {
    const calledNumbers: number[] = called.map((val) => Number.parseInt(val));

    const sumOfUncalledNumbers: number = this.allNumbers
      .filter((val) => !calledNumbers.includes(val))
      .reduce((prev, curr) => prev + curr, 0);

    return sumOfUncalledNumbers * calledNumbers.slice(-1)[0];
  }
}

export class Day04 extends Day {
  public solvePartOne(input: string): number {
    const parts: string[] = splitLines(input, true, 2);
    const calls: string[] = (parts.shift() || "").split(",");

    const boards: Board[] = parts.map((val) => new Board(val));
    const boardResults: BoardResult[] = boards
      .map((board) => board.evaluateBoard(calls))
      .filter((res) => res != null) as BoardResult[];

    const bestBoard: BoardResult = boardResults.reduce(
      (prevBest, curr) =>
        !!prevBest && prevBest.roundsToBingo < curr.roundsToBingo
          ? prevBest
          : curr,
      { roundsToBingo: 100000, score: 0 }
    );
    return bestBoard.score;
  }

  public solvePartTwo(input: string): number {
    const parts: string[] = splitLines(input, true, 2);
    const calls: string[] = (parts.shift() || "").split(",");

    const boards: Board[] = parts.map((val) => new Board(val));
    const boardResults: BoardResult[] = boards
      .map((board) => board.evaluateBoard(calls))
      .filter((res) => res != null) as BoardResult[];

    const worstBoard: BoardResult = boardResults.reduce(
      (prevWorst, curr) =>
        !!prevWorst && prevWorst.roundsToBingo > curr.roundsToBingo
          ? prevWorst
          : curr,
      { roundsToBingo: 0, score: 0 }
    );
    return worstBoard.score;
  }
}
