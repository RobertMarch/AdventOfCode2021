import { Day } from "../day";

export class Day17 extends Day {
  private static INPUT_REGEX =
    /^target area: x=(\d+)..(\d+), y=-(\d+)..-(\d+)$/;

  public solvePartOne(input: string): number {
    const parts = input.match(Day17.INPUT_REGEX);
    if (!parts) {
      throw new Error("Cannot match line to expected format");
    }
    const minY: number = parseInt(parts[3]);
    return (minY * (minY - 1)) / 2;
  }

  public solvePartTwo(input: string): number {
    const parts = input.match(Day17.INPUT_REGEX);
    if (!parts) {
      throw new Error("Cannot match line to expected format");
    }
    const minX: number = parseInt(parts[1]);
    const maxX: number = parseInt(parts[2]);
    const minY: number = -1 * parseInt(parts[3]);
    const maxY: number = -1 * parseInt(parts[4]);

    // console.log(minX, maxX, min);
    let count: number = 0;
    for (let initialX = 1; initialX <= maxX; initialX++) {
      for (let initialY = minY; initialY < -1 * minY; initialY++) {
        let x: number = initialX;
        let y: number = initialY;
        let xPos: number = 0;
        let yPos: number = 0;

        while (xPos <= maxX && yPos >= minY && !(xPos < minX && x == 0)) {
          xPos += x;
          yPos += y;
          x = x > 0 ? x - 1 : 0;
          y -= 1;

          if (xPos >= minX && xPos <= maxX && yPos >= minY && yPos <= maxY) {
            count += 1;
            break;
          }
        }
      }
    }
    return count;
  }
}
