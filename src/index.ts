import { Day } from "./day";
import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day04 } from "./days/day04";
import { Day05 } from "./days/day05";
import { Day06 } from "./days/day06";
import { Day07 } from "./days/day07";

const days: Record<number, Day> = {
    1: new Day01(),
    2: new Day02(),
    3: new Day03(),
    4: new Day04(),
    5: new Day05(),
    6: new Day06(),
    7: new Day07(),
}

function getDay(dayId: number): Day {
  if (!days[dayId]) {
      console.log(`No code defined for day ${dayId}`)
  }

  return days[dayId];
}

function runDayPartOne(dayId: number) {
  const day: Day = getDay(dayId);

  const partOneTestResult: any = day.partOneExample()
  console.log("Part One Example Result: ", partOneTestResult)

  const partOneResult: any = day.partOne()
  console.log("Part One Result: ", partOneResult)
}

function runDayPartTwo(dayId: number) {
  const day: Day = getDay(dayId);

  const partTwoTestResult: any = day.partTwoExample()
  console.log("Part Two Example Result: ", partTwoTestResult)

  const partTwoResult: any = day.partTwo()
  console.log("Part Two Result: ", partTwoResult)
}

function runDay(dayId: number): void {
    runDayPartOne(dayId)
    runDayPartTwo(dayId)
}

const params = process.argv.splice(2);
if (params.length) {
  const dayId: number = parseInt(params[0], 10)

  if (params.length >= 2 && params[1] == 'a') {
    runDayPartOne(dayId)
  } else if (params.length >= 2 && params[1] == 'b') {
    runDayPartTwo(dayId)
  } else {
    runDay(dayId)
  }
} else {
  console.log(`Usage: npm run start [day] [a|b| ]`);
  console.log(`Available days: [ ${Object.keys(days).join(", ")} ]`);
}
