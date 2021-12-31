import { DAY_01_TEST_CASES } from "../test_inputs/day01";
import { DAY_02_TEST_CASES } from "../test_inputs/day02";
import { DAY_03_TEST_CASES } from "../test_inputs/day03";
import { DAY_04_TEST_CASES } from "../test_inputs/day04";
import { DAY_05_TEST_CASES } from "../test_inputs/day05";
import { DAY_06_TEST_CASES } from "../test_inputs/day06";
import { DAY_07_TEST_CASES } from "../test_inputs/day07";
import { DAY_08_TEST_CASES } from "../test_inputs/day08";
import { DAY_09_TEST_CASES } from "../test_inputs/day09";
import { DAY_10_TEST_CASES } from "../test_inputs/day10";
import { DAY_11_TEST_CASES } from "../test_inputs/day11";
import { DAY_12_TEST_CASES } from "../test_inputs/day12";
import { DAY_13_TEST_CASES } from '../test_inputs/day13';
import { DAY_14_TEST_CASES } from '../test_inputs/day14';
import { DAY_15_TEST_CASES } from '../test_inputs/day15';
import { DAY_16_TEST_CASES } from '../test_inputs/day16';
import { DAY_17_TEST_CASES } from '../test_inputs/day17';
import { DAY_18_TEST_CASES } from '../test_inputs/day18';
import { DAY_19_TEST_CASES } from '../test_inputs/day19';
import { DAY_20_TEST_CASES } from '../test_inputs/day20';
import { DAY_21_TEST_CASES } from '../test_inputs/day21';
// MORE TEST CASE IMPORTS HERE
import { TestCase } from "../test_inputs/test-case";
import { Day } from "./day";
import { Day01 } from "./days/day01";
import { Day02 } from "./days/day02";
import { Day03 } from "./days/day03";
import { Day04 } from "./days/day04";
import { Day05 } from "./days/day05";
import { Day06 } from "./days/day06";
import { Day07 } from "./days/day07";
import { Day08 } from "./days/day08";
import { Day09 } from "./days/day09";
import { Day10 } from "./days/day10";
import { Day11 } from "./days/day11";
import { Day12 } from "./days/day12";
import { Day13 } from './days/day13';
import { Day14 } from './days/day14';
import { Day15 } from './days/day15';
import { Day16 } from './days/day16';
import { Day17 } from './days/day17';
import { Day18 } from './days/day18';
import { Day19 } from './days/day19';
import { Day20 } from './days/day20';
import { Day21 } from './days/day21';
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
  9: new Day09(),
  10: new Day10(),
  11: new Day11(),
  12: new Day12(),
  13: new Day13(),
  14: new Day14(),
  15: new Day15(),
  16: new Day16(),
  17: new Day17(),
  18: new Day18(),
  19: new Day19(),
  20: new Day20(),
  21: new Day21(),
  // MORE DAYS HERE
};

export const TEST_CASES: Record<number, TestCase[]> = {
  1: DAY_01_TEST_CASES,
  2: DAY_02_TEST_CASES,
  3: DAY_03_TEST_CASES,
  4: DAY_04_TEST_CASES,
  5: DAY_05_TEST_CASES,
  6: DAY_06_TEST_CASES,
  7: DAY_07_TEST_CASES,
  8: DAY_08_TEST_CASES,
  9: DAY_09_TEST_CASES,
  10: DAY_10_TEST_CASES,
  11: DAY_11_TEST_CASES,
  12: DAY_12_TEST_CASES,
  13: DAY_13_TEST_CASES,
  14: DAY_14_TEST_CASES,
  15: DAY_15_TEST_CASES,
  16: DAY_16_TEST_CASES,
  17: DAY_17_TEST_CASES,
  18: DAY_18_TEST_CASES,
  19: DAY_19_TEST_CASES,
  20: DAY_20_TEST_CASES,
  21: DAY_21_TEST_CASES,
  // MORE TEST CASES HERE
};
