import { Day } from "../day";

enum Direction {
    FORWARD = "forward",
    DOWN = "down",
    UP = "up",
}

interface Command {
    direction: Direction,
    amount: number,
}

export class Day02 extends Day {
    
    constructor() {
        super('02')
    }

    public solvePartOne(input: string): number {
        const commands: Command[] = this._deserialiseInputAsCommands(input);

        let forward: number = 0;
        let depth: number = 0;

        commands.forEach((command: Command) => {
            switch(command.direction) {
                case Direction.FORWARD:
                    forward += command.amount;
                    break;
                case Direction.DOWN:
                    depth += command.amount;
                    break;
                case Direction.UP:
                    depth -= command.amount;
                    break;
                default:
                    break
            }
        })

        return depth * forward;
    }

    public solvePartTwo(input: string): number {
        const commands: Command[] = this._deserialiseInputAsCommands(input);

        let forward: number = 0;
        let depth: number = 0;
        let aim: number = 0;

        commands.forEach((command: Command) => {
            switch(command.direction) {
                case Direction.FORWARD:
                    forward += command.amount;
                    depth += aim * command.amount;
                    break;
                case Direction.DOWN:
                    aim += command.amount;
                    break;
                case Direction.UP:
                    aim -= command.amount;
                    break;
                default:
                    break
            }
        })

        return depth * forward;
    }

    private _deserialiseInputAsCommands(input: string): Command[] {
        return input.split('\n')
            .map(line => {
                const parts: string[] = line.split(' ');
                return {
                    direction: parts[0] as Direction,
                    amount: Number.parseInt(parts[1]),
                }
            })
    }
}