import { Day } from "../day";
import { range } from "../utils/array-utils";
import { splitLines } from "../utils/string-utils";

interface DiceRoll {
  score: number;
  count: number;
}

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
    const positions: number[] = splitLines(input).map((line: string) => parseInt(line.at(-1)));

    let player1Position: number = positions[0];
    let player2Position: number = positions[1];

    let player1TurnsToWinDist: Record<number, number> = this._getPlayerTurnsToWinDistribution(player1Position);
    let player2TurnsToWinDist: Record<number, number> = this._getPlayerTurnsToWinDistribution(player2Position);

    const player1Wins: number = Object.keys(player1TurnsToWinDist)
      .map((val: string) => parseInt(val))
      .map(
        (turns) =>
          player1TurnsToWinDist[turns] *
          range(1, turns).reduce((runningTotal, turn) => runningTotal * 27 - (player2TurnsToWinDist[turn] || 0), 1)
      )
      .reduce((sum, curr) => sum + curr, 0);

    const player2Wins: number = Object.keys(player2TurnsToWinDist)
      .map((val: string) => parseInt(val))
      .map(
        (turns) =>
          player2TurnsToWinDist[turns] *
          range(1, turns + 1).reduce((runningTotal, turn) => runningTotal * 27 - (player1TurnsToWinDist[turn] || 0), 1)
      )
      .reduce((sum, curr) => sum + curr, 0);

    console.log(player1Wins, player2Wins);
    return Math.max(player1Wins, player2Wins);
  }

  private readonly scoreDistribution: Readonly<DiceRoll[]> = [
    { score: 3, count: 1 },
    { score: 4, count: 3 },
    { score: 5, count: 6 },
    { score: 6, count: 7 },
    { score: 7, count: 6 },
    { score: 8, count: 3 },
    { score: 9, count: 1 },
  ];

  private _getPlayerTurnsToWinDistribution(initialPosition: number): Record<number, number> {
    // Map from running score, to map from current position to count at that position for the given score
    let currentState: Record<number, Record<number, number>> = { 0: { [initialPosition]: 1 } };

    let winningTurnCounts: Record<number, number> = {};

    let turn = 0;
    while (Math.min(...Object.keys(currentState).map((val: string) => parseInt(val))) < 21) {
      let newState: Record<number, Record<number, number>> = {};
      turn += 1;

      Object.keys(currentState)
        .map((val: string) => parseInt(val))
        .forEach((score: number) => {
          Object.keys(currentState[score])
            .map((val: string) => parseInt(val))
            .forEach((position: number) => {
              this.scoreDistribution.forEach((roll: DiceRoll) => {
                const newPosition: number = this._getOneIndexedModulus(position + roll.score, 10);
                const newScore: number = score + newPosition;

                if (newScore >= 21) {
                  if (!winningTurnCounts[turn]) {
                    winningTurnCounts[turn] = 0;
                  }
                  winningTurnCounts[turn] += currentState[score][position] * roll.count;
                } else {
                  if (!newState[newScore]) {
                    newState[newScore] = {};
                  }

                  if (!newState[newScore][newPosition]) {
                    newState[newScore][newPosition] = 0;
                  }

                  newState[newScore][newPosition] += currentState[score][position] * roll.count;
                }
              });
            });
        });

      currentState = newState;
    }

    return winningTurnCounts;
  }
}
