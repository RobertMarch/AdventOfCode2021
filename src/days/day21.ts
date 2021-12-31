import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

export class Day21 extends Day {
  public solvePartOne(input: string): number {
    const positions: number[] = splitLines(input).map((line: string) => parseInt(line.at(-1)));

    let player1Position: number = positions[0];
    let player2Position: number = positions[1];
    let player1Score: number = 0;
    let player2Score: number = 0;

    let turn: number = 0;
    let currentPlayer: number = 1;

    while (player1Score < 1000 && player2Score < 1000) {
      turn += 1;

      const totalDiceRoll = this._getOneIndexedModulus((turn * 3 - 1) * 3, 100);

      if (currentPlayer == 1) {
        player1Position = this._getOneIndexedModulus(player1Position + totalDiceRoll, 10);
        player1Score += player1Position;
        currentPlayer = 2;
      } else {
        player2Position = this._getOneIndexedModulus(player2Position + totalDiceRoll, 10);
        player2Score += player2Position;
        currentPlayer = 1;
      }
    }

    return Math.min(player1Score, player2Score) * turn * 3;
  }

  /**
   * Returns the modulus of a number to another number, but if the value is an exact multiple of the modulo, returns
   * the modulo rather than 0.
   */
  private _getOneIndexedModulus(value: number, modulo: number): number {
    return ((value - 1) % modulo) + 1;
  }

  public solvePartTwo(input: string): number {
    return -1;
  }
}
