import { Day } from "../day";

export class Day01 extends Day {
    
    constructor() {
        super('01')
    }

    protected solvePartOne(input: string): number {
        const input_lines: number[] = input.split('\n').map(val => Number.parseInt(val))
        let increases: number = 0;
        input_lines.forEach((depth: number, index: number) => {
            if (index != 0 && depth > input_lines[index - 1]) {
                increases ++;
            }
        })
        return increases;
    }

    protected solvePartTwo(input: string): number {
        const input_lines: number[] = input.split('\n').map(val => Number.parseInt(val))
        let increases: number = 0;
        input_lines.forEach((depth: number, index: number) => {
            if (index >= 2 && depth > input_lines[index - 3]) {
                increases ++;
            }
        })
        return increases;
    }
}
