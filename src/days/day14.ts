import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

export class Day14 extends Day {
  public solvePartOne(input: string): number {
    return this._solveForNSteps(input, 10)
  }

  public solvePartTwo(input: string): number {
    return this._solveForNSteps(input, 40)
  }

  private _solveForNSteps(input: string, steps: number): number {
    const inputParts: string[] = splitLines(input, true, 2)
    const polymerTemplate: string = inputParts[0];
    const insertionRules: Record<string, string> = this._getInsertionRules(splitLines(inputParts[1]));

    let letterPairs: Record<string, number> = {}
    const letterCounts: Record<string, number> = {}

    for (let i = 0; i < polymerTemplate.length; i++) {
      this._incrementValueInRecord(letterCounts, polymerTemplate.substr(i, 1))
      if (i > 0) {
        this._incrementValueInRecord(letterPairs, polymerTemplate.substr(i-1, 2))
      }
    }

    for (let i = 0; i < steps; i++) {
      letterPairs = this._updatePolymerForTimeStep(letterPairs, letterCounts, insertionRules);
    }

    return Math.max(...Object.values(letterCounts)) - Math.min(...Object.values(letterCounts));
  }

  private _getInsertionRules(rulesStrings: string[]): Record<string, string> {
    const insertionRules: Record<string, string> = {};

    rulesStrings.forEach(rule => {
      const parts: string[] = rule.split(' -> ')
      insertionRules[parts[0]] = parts[1];
    })

    return insertionRules;
  }

  private _updatePolymerForTimeStep(letterPairs: Record<string, number>, letterCounts: Record<string, number>, insertionRules: Record<string, string>): Record<string, number> {
    const newLetterPairs: Record<string, number> = {}
    Object.keys(letterPairs).forEach((pair: string) => {
      if (letterPairs[pair] > 0) {
        this._incrementValueInRecord(newLetterPairs, pair[0] + insertionRules[pair], letterPairs[pair])
        this._incrementValueInRecord(newLetterPairs, insertionRules[pair] + pair[1], letterPairs[pair])
        this._incrementValueInRecord(letterCounts, insertionRules[pair], letterPairs[pair])
      }
    });

    return newLetterPairs;
  }

  private _incrementValueInRecord(record: Record<string, number>, key: string, increaseBy: number = 1): void {
    record[key] = (record[key] || 0) + increaseBy
  }
}
