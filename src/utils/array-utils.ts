export function sumValuesInArray(array: number[]): number {
    return array.reduce((sum, curr) => sum + curr, 0)
}