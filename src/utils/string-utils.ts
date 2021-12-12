/**
 * Helper method to split the given string over new lines, and return the result as an array. Optionally trims any
 * leading or trailing whitespace if the given boolean is true. If consecutiveNewLinesToSplitOver is set to a value
 * greater than one, then will only split when multiple new lines are seen in a row - used to split an input grouped
 * with some completely empty new lines delineating sections of the input.
 * Note new lines in a text file are loaded as \r\n, but when imported from a typscript multi line string variable
 * these are just a single \n.
 */
export function splitLines(
  input: string,
  trimWhitespace: boolean = true,
  consecutiveNewLinesToSplitOver: number = 1
): string[] {
  return input
    .replace("\r\n", "\n")
    .split("\n".repeat(consecutiveNewLinesToSplitOver))
    .map((val) => (trimWhitespace ? val.trim() : val));
}
