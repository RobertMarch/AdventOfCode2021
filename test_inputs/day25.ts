import { TestCase } from "./test-case";

export const DAY_25_TEST_CASES: TestCase[] = [
  {
    input: `v>>.v
v....`,
    expectedPartOneOutput: 3,
    expectedPartTwoOutput: null,
  },
  {
    input: `v...>>.vv>
.vv>>.vv..
>>.>v>...v
>>v>>.>.v.
v>v.vv.v..
>.>>..v...
.vv..>.>v.
v.v..>>v.v
....v..v.>`,
    expectedPartOneOutput: 58,
    expectedPartTwoOutput: null,
  },
]