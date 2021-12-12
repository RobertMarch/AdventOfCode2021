import { DayRunner } from "./day-runner";

const params = process.argv.splice(2);
const runner: DayRunner = new DayRunner(false);
runner.processParamsAndRun(params);
