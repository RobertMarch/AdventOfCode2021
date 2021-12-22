import { TestCase } from "./test-case";

export const DAY_12_TEST_CASES: TestCase[] = [
  {
    input: `start-A
start-b
A-c
A-b
b-d
A-end
b-end`,
    expectedPartOneOutput: 10,
    expectedPartTwoOutput: 36,
  },
  {
    input: `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc`,
    expectedPartOneOutput: 19,
    expectedPartTwoOutput: 103,
  },
  {
    input: `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW`,
    expectedPartOneOutput: 226,
    expectedPartTwoOutput: 3509,
  },
];
