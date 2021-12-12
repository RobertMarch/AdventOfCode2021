const { promises, constants } = require("fs");
const path = require("path");
const { exit } = require("process");

if (process.argv.length === 2) {
  console.info("Usage: npm run setup {day}");
  exit(0);
}
let day = parseInt(process.argv[2]);
if (day < 1 || day > 25) {
  console.warn("Please enter a day between 1 and 25");
  exit(0);
}
day = ("0" + day).slice(-2);

const startPath = process.cwd();

(async function () {
  console.log(`Setting up day ${day}`);
  await createInputFiles();
  await createCodeFiles();
  await updateDaysMapping();
  console.log("All done!");
})();

async function createDirectoryIfItDoesNotExist(dir) {
  try {
    await promises.access(dir, constants.F_OK | constants.W_OK);
  } catch {
    console.log(`Creating directory: ${dir}`);
    await promises.mkdir(dir);
  }
}

async function createFileIfItDoesNotExist(name, content) {
  try {
    await promises.access(name, constants.R_OK);
    console.log(`File ${name} exists, will not overwrite.`);
  } catch {
    console.log(`Creating file ${name}`);
    await promises.writeFile(name, content);
  }
}

async function createInputFiles() {
  const inputsPath = path.join(startPath, "inputs");
  await createDirectoryIfItDoesNotExist(inputsPath);
  createFileIfItDoesNotExist(path.join(inputsPath, `day${day}.txt`), "");

  const testInputsPath = path.join(startPath, "test_inputs");
  await createDirectoryIfItDoesNotExist(testInputsPath);
  createFileIfItDoesNotExist(path.join(testInputsPath, `day${day}.txt`), "");
}

async function copyTemplate(from, to) {
  const content = (await promises.readFile(from, { encoding: "utf8" }))
  .replace(/XX/g, day);
  createFileIfItDoesNotExist(to, content);
}

async function createCodeFiles() {
  const templateFolder = path.join(startPath, "src", "template");
  const codeFolder = path.join(startPath, "src", "days");
  await createDirectoryIfItDoesNotExist(codeFolder);
  await copyTemplate(
    path.join(templateFolder, "dayXX.ts"),
    path.join(codeFolder, `day${day}.ts`)
  );
}

async function updateDaysMapping() {
  const daysMappingPath = path.join(startPath, "src", "days.ts");
  const contents = (await promises.readFile(daysMappingPath, { encoding: "utf8" }))
    .replace(
      "// MORE IMPORTS HERE",
      `import { Day${day} } from './days/day${day}';
// MORE IMPORTS HERE`
    )
    .replace(
      "// MORE DAYS HERE",
      `${parseInt(day)}: new Day${day}(),
  // MORE DAYS HERE`
    );

  console.log("Updating days mapping");
  await promises.writeFile(daysMappingPath, contents);
}
