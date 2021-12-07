import * as fs from 'fs';

export abstract class Day {

    constructor(private dayId: string) {}

    public partOneExample(): any {
        const input = this.loadTestInput();
        return this.solvePartOne(input)
    }

    public partOne(): any {
        const input = this.loadFile();
        return this.solvePartOne(input)
    }

    protected abstract solvePartOne(input: string): any;

    public partTwoExample(): any {
        const input = this.loadTestInput();
        return this.solvePartTwo(input)
    }
    
    public partTwo(): any {
        const input = this.loadFile();
        return this.solvePartTwo(input)
    }

    protected abstract solvePartTwo(input: string): any;

    private loadTestInput(): any {
        const file = fs.readFileSync(`inputs_examples/day${this.dayId}.txt`)
        return file.toString();
    }

    private loadFile(): any {
        const file = fs.readFileSync(`inputs/day${this.dayId}.txt`)
        return file.toString();
    }
}