import { Day } from "../day";

class Pair {
  public static deserialise(input: string): Pair {
    let items: any[] = [];
    input.split("").forEach((char) => {
      if (["[", "]", ","].includes(char)) {
        items.push(char);
      } else {
        items.push(parseInt(char));
      }
    });

    while (items.length > 1) {
      for (let i = 0; i < items.length - 3; i++) {
        if (items[i] == "[" && items[i + 2] == "," && items[i + 4] == "]") {
          const newPair: Pair = new Pair(items[i + 1], items[i + 3]);
          items.splice(i, 5, newPair);
        }
      }
    }

    return items[0];
  }

  private _leftValue: number | Pair;
  private _rightValue: number | Pair;
  public parent: Pair;
  public isLeft: boolean;

  constructor(left: number | Pair, right: number | Pair) {
    this.setLeftValue(left);
    this.setRightValue(right);
  }

  public setLeftValue(value: number | Pair): void {
    this._leftValue = value;

    this._setChildProperties(value, true);
  }

  public setRightValue(value: number | Pair): void {
    this._rightValue = value;
    this._setChildProperties(value, false);
  }

  private _setChildProperties(child: number | Pair, isLeft: boolean): void {
    if (child instanceof Pair) {
      child.parent = this;
      child.isLeft = isLeft;
    }
  }

  public getDepth(): number {
    let depth = 0;
    let parent = this.parent;
    while (parent) {
      depth += 1;
      parent = parent.parent;
    }
    return depth;
  }

  private _getValueToLeft(): void {}
}

export class Day18 extends Day {
  public solvePartOne(input: string): number {
    const pair: Pair = Pair.deserialise(input);
    console.log(pair);
    return -1;
  }

  public solvePartTwo(input: string): number {
    return -1;
  }
}
