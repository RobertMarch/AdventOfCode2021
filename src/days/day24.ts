import { Day } from "../day";
import { range } from "../utils/array-utils";
import { splitLines } from "../utils/string-utils";

enum InstructionType {
  INPUT = "inp",
  ADD = "add",
  MULTIPLY = "mul",
  DIVIDE = "div",
  MODULO = "mod",
  EQUAL = "eql",
}

interface VariableState {
  w: number;
  x: number;
  y: number;
  z: number;
}

type Variable = keyof VariableState;

class Instruction {
  public static deserialise(line: string): Instruction {
    const parts: string[] = line.split(" ");
    const instruction = new Instruction(parts[0] as InstructionType, parts[1] as Variable, null);
    if (parts.length > 2) {
      if (parts[2].match(/-?\d+/)) {
        instruction.variable2 = parseInt(parts[2]);
      } else {
        instruction.variable2 = parts[2] as Variable;
      }
    }

    return instruction;
  }

  constructor(
    public instructionType: InstructionType,
    public variable1: Variable,
    public variable2: Variable | number
  ) {}

  public process(state: VariableState): void {
    const var2Value = this._evaluateVariable2(state);
    switch (this.instructionType) {
      case InstructionType.INPUT:
        throw new Error("Inputs should be handled separately");
      case InstructionType.ADD:
        state[this.variable1] = state[this.variable1] + this._evaluateVariable2(state);
        break;
      case InstructionType.MULTIPLY:
        state[this.variable1] = state[this.variable1] * this._evaluateVariable2(state);
        break;
      case InstructionType.DIVIDE:
        state[this.variable1] = Math.floor(state[this.variable1] / this._evaluateVariable2(state));
        break;
      case InstructionType.MODULO:
        state[this.variable1] = state[this.variable1] % this._evaluateVariable2(state);
        break;
      case InstructionType.EQUAL:
        state[this.variable1] = state[this.variable1] === this._evaluateVariable2(state) ? 1 : 0;
        break;
    }
  }

  private _evaluateVariable2(state: VariableState): number {
    if (typeof this.variable2 === "number") {
      return this.variable2 as number;
    } else {
      return state[this.variable2];
    }
  }
}

export class Day24 extends Day {
  public solvePartOne(input: string): number {
    const instructions: Instruction[] = splitLines(input).map((line) => Instruction.deserialise(line));
    let variableStates: Record<number, VariableState> = { 0: { w: 0, x: 0, y: 0, z: 0 } };

    instructions.forEach((instruction) => {
      if (instruction.instructionType === InstructionType.INPUT) {
        const previousInputs: number[] = Object.keys(variableStates)
          .map((val) => parseInt(val))
          .sort((a, b) => b - a);
        const previousZStates: Set<number> = new Set();
        const newVariableStates: Record<number, VariableState> = {};

        previousInputs.forEach((partialModelNumber) => {
          const state: VariableState = variableStates[partialModelNumber];

          if (!previousZStates.has(state.z)) {
            previousZStates.add(state.z);
            range(1, 10).forEach((i) => {
              newVariableStates[partialModelNumber * 10 + i] = {
                x: state.x,
                y: state.y,
                z: state.z,
                w: i,
              };
            });
          }
        });

        variableStates = newVariableStates;
      } else {
        Object.values(variableStates).forEach((variableState) => instruction.process(variableState));
      }
    });

    return Math.max(
      ...Object.keys(variableStates)
        .map((val) => parseInt(val))
        .filter((modelNumber) => variableStates[modelNumber].z === 0)
    );
  }

  public solvePartTwo(input: string): number {
    return -1;
  }

  private _areStatesEqualBeforeInput(state1: VariableState, state2: VariableState): boolean {
    return state1.z === state2.z;
  }
}
