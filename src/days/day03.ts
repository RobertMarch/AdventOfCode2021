import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

interface Branch {
  count: number;
  childOneBranch?: Branch;
  childZeroBranch?: Branch;
}

export class Day03 extends Day {
  public solvePartOne(input: string): number {
    const lines: string[] = splitLines(input).map((value) => value.trim());
    const oneCountsMap: number[] = Array(lines[0].length).fill(0);
    lines.forEach((value: string) => {
      value.split("").forEach((char: string, i: number) => {
        if (char == "1") {
          oneCountsMap[i] += 1;
        }
      });
    });

    let gamma_rate: string = oneCountsMap
      .map((count) => (count > lines.length / 2 ? "1" : "0"))
      .join("");
    let epsilon_rate: string = oneCountsMap
      .map((count) => (count < lines.length / 2 ? "1" : "0"))
      .join("");

    return Number.parseInt(gamma_rate, 2) * Number.parseInt(epsilon_rate, 2);
  }

  public solvePartTwo(input: string): number {
    const lines: string[] = splitLines(input).map((value) => value.trim());
    const root: Branch = {
      count: 0,
    };
    lines.forEach((value: string) => {
      let currentBranch: Branch = root;
      value.split("").forEach((char: string) => {
        if (char == "1") {
          if (!currentBranch.childOneBranch) {
            currentBranch.childOneBranch = {
              count: 0,
            };
          }
          currentBranch = currentBranch.childOneBranch;
          currentBranch.count += 1;
        } else {
          if (!currentBranch.childZeroBranch) {
            currentBranch.childZeroBranch = {
              count: 0,
            };
          }
          currentBranch = currentBranch.childZeroBranch;
          currentBranch.count += 1;
        }
      });
    });

    let oxygenRate: string = this._getMostCommonRoot(root);
    let co2Rate: string = this._getLeastCommonRoot(root);

    return Number.parseInt(oxygenRate, 2) * Number.parseInt(co2Rate, 2);
  }

  private _getMostCommonRoot(root: Branch): string {
    if (!!root.childOneBranch && !!root.childZeroBranch) {
      return root.childOneBranch.count >= root.childZeroBranch.count
        ? "1" + this._getMostCommonRoot(root.childOneBranch)
        : "0" + this._getMostCommonRoot(root.childZeroBranch);
    } else if (!!root.childOneBranch && !root.childZeroBranch) {
      return "1" + this._getMostCommonRoot(root.childOneBranch);
    } else if (!!root.childZeroBranch && !root.childOneBranch) {
      return "0" + this._getMostCommonRoot(root.childZeroBranch);
    }

    return "";
  }

  private _getLeastCommonRoot(root: Branch): string {
    if (root.childOneBranch && root.childZeroBranch) {
      return root.childOneBranch.count < root.childZeroBranch.count
        ? "1" + this._getLeastCommonRoot(root.childOneBranch)
        : "0" + this._getLeastCommonRoot(root.childZeroBranch);
    } else if (root.childOneBranch && !root.childZeroBranch) {
      return "1" + this._getLeastCommonRoot(root.childOneBranch);
    } else if (root.childZeroBranch && !root.childOneBranch) {
      return "0" + this._getLeastCommonRoot(root.childZeroBranch);
    }

    return "";
  }
}
