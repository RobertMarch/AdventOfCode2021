import { Day } from "./day";
import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day04 } from "./days/day04";
import { Day05 } from "./days/day05";
import { Day06 } from "./days/day06";
import { Day07 } from "./days/day07";
import { Day08 } from "./days/day08";
// MORE IMPORTS HERE

export const DAYS: Record<number, Day> = {
  1: new Day01(),
  2: new Day02(),
  3: new Day03(),
  4: new Day04(),
  5: new Day05(),
  6: new Day06(),
  7: new Day07(),
  8: new Day08(),
  // MORE DAYS HERE
};
