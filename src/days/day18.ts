import { Day } from "../day";
import { splitLines } from "../utils/string-utils";

abstract class TreeNode {
  public parent: PairNode;

  public getDepth(): number {
    let depth = 0;
    let ancestor = this.parent;
    while (ancestor) {
      depth += 1;
      ancestor = ancestor.parent;
    }
    return depth;
  }

  public isLeftValueInPair(): boolean {
    return this.parent.leftChild === this;
  }

  public isRightValueInPair(): boolean {
    return this.parent.rightChild === this;
  }

  protected getValueNodeToLeft(): ValueNode {
    let node: TreeNode = this;
    while (node && node.parent && node.isLeftValueInPair()) {
      node = node.parent;
    }
    if (!node?.parent) {
      return null;
    }
    node = node.parent.leftChild;
    while (node instanceof PairNode) {
      node = node.rightChild;
    }
    return node as ValueNode;
  }

  protected getValueNodeToRight(): ValueNode {
    let node: TreeNode = this;
    while (node && node.parent && node.isRightValueInPair()) {
      node = node.parent;
    }
    if (!node || !node.parent) {
      return null;
    }
    node = node.parent.rightChild;
    while (node instanceof PairNode) {
      node = node.leftChild;
    }
    return node as ValueNode;
  }

  public abstract explode(): void;

  public abstract split(): void;

  public abstract getMagnitude(): number;

  public abstract toString(): string;

  public consoleLogWholeNumber(message: string = ""): void {
    let ancestor = this.parent;
    while (ancestor.parent) {
      ancestor = ancestor.parent;
    }
    console.log(ancestor.toString(), message);
  }
}

class PairNode extends TreeNode {
  public static deserialise(input: string): PairNode {
    let items: any[] = [];
    input.split("").forEach((char) => {
      if (["[", "]", ","].includes(char)) {
        items.push(char);
      } else {
        items.push(new ValueNode(parseInt(char)));
      }
    });

    while (items.length > 1) {
      let hasUpdated: boolean = false;
      for (let i = 0; i < items.length - 3; i++) {
        if (items[i] == "[" && items[i + 2] == "," && items[i + 4] == "]") {
          const newPair: PairNode = new PairNode(items[i + 1], items[i + 3]);
          items.splice(i, 5, newPair);
          hasUpdated = true;
        }
      }
      if (!hasUpdated && items.length > 1) {
        throw new Error("Cannot deserialise input");
      }
    }

    return items[0];
  }

  private _leftChild: TreeNode;
  private _rightChild: TreeNode;

  constructor(left: TreeNode, right: TreeNode) {
    super();
    this.leftChild = left;
    this.rightChild = right;
  }

  public set leftChild(value: TreeNode) {
    if (this._leftChild) {
      this._leftChild.parent = null;
    }
    this._leftChild = value;
    this._leftChild.parent = this;
  }

  public get leftChild(): TreeNode {
    return this._leftChild;
  }

  public set rightChild(value: TreeNode) {
    if (this._rightChild) {
      this._rightChild.parent = null;
    }
    this._rightChild = value;
    this._rightChild.parent = this;
  }

  public get rightChild(): TreeNode {
    return this._rightChild;
  }

  public explode(): void {
    if (this.getDepth() >= 4) {
      this.getValueNodeToLeft()?.incrementValue(
        (this.leftChild as ValueNode).value
      );
      this.getValueNodeToRight()?.incrementValue(
        (this.rightChild as ValueNode).value
      );
      if (this.isLeftValueInPair()) {
        this.parent.leftChild = new ValueNode(0);
      } else {
        this.parent.rightChild = new ValueNode(0);
      }
    } else {
      this.leftChild.explode();
      this.rightChild.explode();
    }
  }

  public split(): void {
    this.leftChild.split();
    this.rightChild.split();
  }

  public getMagnitude(): number {
    return (
      3 * this.leftChild.getMagnitude() + 2 * this.rightChild.getMagnitude()
    );
  }

  public toString(): string {
    return `[${this.leftChild.toString()},${this.rightChild.toString()}]`;
  }
}

class ValueNode extends TreeNode {
  public value: number;

  constructor(value: number) {
    super();
    this.value = value;
  }

  public incrementValue(increment: number): ValueNode {
    this.value += increment;
    return this;
  }

  public explode(): void {
    return;
  }

  public split(): void {
    if (this.value > 9) {
      const splitLeftValue: number = Math.floor(this.value / 2);
      const splitRightValue: number = Math.ceil(this.value / 2);

      if (this.getDepth() < 4) {
        const replacementPair: PairNode = new PairNode(
          new ValueNode(splitLeftValue),
          new ValueNode(splitRightValue)
        );
        if (this.isLeftValueInPair()) {
          this.parent.leftChild = replacementPair;
        } else {
          this.parent.rightChild = replacementPair;
        }
        replacementPair.split();
      } else {
        const updatedNodeToLeft: ValueNode =
          this.getValueNodeToLeft()?.incrementValue(splitLeftValue);
        const updatedNodeToRight: ValueNode =
          this.getValueNodeToRight()?.incrementValue(splitRightValue);
        this.value = 0;

        if (updatedNodeToLeft) {
          updatedNodeToLeft.split();
        }
        if (updatedNodeToRight && updatedNodeToRight.parent) {
          updatedNodeToRight.split();
        }
      }
    }
  }

  public getMagnitude(): number {
    return this.value;
  }

  public toString(): string {
    return this.value.toString();
  }
}

export class Day18 extends Day {
  public solvePartOne(input: string): number {
    const pairs: PairNode[] = splitLines(input).map((line) =>
      PairNode.deserialise(line)
    );
    let initialPair: PairNode = pairs[0];

    pairs.slice(1).forEach((pair) => {
      initialPair = new PairNode(initialPair, pair);
      initialPair.explode();
      initialPair.split();
    });

    return initialPair.getMagnitude();
  }

  public solvePartTwo(input: string): number {
    const lines: string[] = splitLines(input);

    let biggestMagnitude: number = -1;

    lines.forEach((firstPairString: string) => {
      lines
        .filter((pair: string) => pair !== firstPairString)
        .forEach((secondPairString: string) => {
          const initialPair: PairNode = new PairNode(
            PairNode.deserialise(firstPairString),
            PairNode.deserialise(secondPairString)
          );

          initialPair.explode();
          initialPair.split();
          
          if (initialPair.getMagnitude() > biggestMagnitude) {
            biggestMagnitude = initialPair.getMagnitude();
          }
        });
    });

    return biggestMagnitude;
  }
}
