export function range(start: number, end: number): number[] {
    return Array.from(Array(end).keys()).slice(start, end)
}

export function sumValuesInArray(array: number[]): number {
    return array.reduce((sum, curr) => sum + curr, 0)
}