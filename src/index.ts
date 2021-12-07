import { Day } from "./day";
import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day04 } from "./days/day04";

const days: Record<number, Day> = {
    1: new Day01(),
    2: new Day02(),
    3: new Day03(),
    4: new Day04(),
}

function runDay(dayId: number): void {
    if (!days[dayId]) {
        console.log(`No code defined for day ${dayId}`)
    }

    const partOneTestResult: any = days[dayId].partOneExample()
    console.log("Part One Example Result: ", partOneTestResult)

    const partOneResult: any = days[dayId].partOne()
    console.log("Part One Result: ", partOneResult)

    const partTwoTestResult: any = days[dayId].partTwoExample()
    console.log("\nPart Two Example Result: ", partTwoTestResult)
    
    const partTwoResult: any = days[dayId].partTwo()
    console.log("Part Two Result: ", partTwoResult)
}

const params = process.argv.splice(2);
if (params.length) {
  runDay(parseInt(params[0], 10));
} else {
  console.log(`Usage: npm run start [day]`);
  console.log(`Available days: [ ${Object.keys(days).join(", ")} ]`);
}
