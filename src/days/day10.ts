import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

class Brackets {
  constructor(
    private _openingCharacter: string,
    private _closingCharacter: string,
    private _syntaxErrorScore: number,
    private _autocompleteScore: number
  ) {}

  public getClosingCharacter(): string {
    return this._closingCharacter;
  }

  public getOpeningCharacter(): string {
    return this._openingCharacter;
  }

  public getSyntaxErrorScore(): number {
    return this._syntaxErrorScore;
  }

  public getAutocompleteScore(): number {
    return this._autocompleteScore;
  }
}

const BRACKETS: ReadonlyArray<Brackets> = [
  new Brackets("(", ")", 3, 1),
  new Brackets("[", "]", 57, 2),
  new Brackets("{", "}", 1197, 3),
  new Brackets("<", ">", 25137, 4),
];

const OPENING_BRACKETS: Readonly<Record<string, Brackets>> = BRACKETS.reduce(
  (prev: Record<string, Brackets>, curr: Brackets) => {
    prev[curr.getOpeningCharacter()] = curr;
    return prev;
  },
  {}
);
const CLOSING_BRACKETS: Readonly<Record<string, Brackets>> = BRACKETS.reduce(
  (prev: Record<string, Brackets>, curr: Brackets) => {
    prev[curr.getClosingCharacter()] = curr;
    return prev;
  },
  {}
);

export class Day10 extends Day {
  public solvePartOne(input: string): number {
    let score: number = 0;
    splitLines(input).forEach((line: string) => {
      const openChunks: Brackets[] = [];

      line.split("").every((char: string) => {
        if (Object.keys(OPENING_BRACKETS).includes(char)) {
          openChunks.push(OPENING_BRACKETS[char]);
        } else {
          const expectedClosingChunk: Brackets = openChunks.pop() as Brackets;
          if (char !== expectedClosingChunk.getClosingCharacter()) {
            score += CLOSING_BRACKETS[char].getSyntaxErrorScore();
            return false;
          }
        }
        return true;
      });
    });
    return score;
  }

  public solvePartTwo(input: string): number {
    let scores: number[] = [];
    splitLines(input).forEach((line: string) => {
      const openChunks: Brackets[] = [];

      const incomplete: boolean = line.split("").every((char: string) => {
        if (Object.keys(OPENING_BRACKETS).includes(char)) {
          openChunks.push(OPENING_BRACKETS[char]);
        } else {
          const expectedClosingChunk: Brackets = openChunks.pop() as Brackets;
          if (char !== expectedClosingChunk.getClosingCharacter()) {
            return false;
          }
        }
        return true;
      });

      if (incomplete) {
        let line_score: number = 0;

        openChunks.reverse().forEach((bracket: Brackets) => {
          line_score *= 5;
          line_score += bracket.getAutocompleteScore();
        });

        scores.push(line_score);
      }
    });

    return scores.sort((a, b) => a - b)[(scores.length - 1) / 2];
  }
}
