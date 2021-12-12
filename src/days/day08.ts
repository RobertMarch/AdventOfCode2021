import { Day } from "../day";

/** 
 * Do counts, then:
 *  a: 8 and is not in length 2 (number 1)
 *  b: 6 (unique)
 *  c: 8 and is in length 2 (number 1)
 *  d: 7 and is in length 4 (number 4)
 *  e: 4 (unique)
 *  f: 9 (unique)
 *  g: 7 and is not in length 4 (number 4)
 */

const RequiredSegments: Record<number, ReadonlyArray<string>> = {
    0: ['a', 'b', 'c', 'e', 'f', 'g'],
    1: ['c', 'f'],
    2: ['a', 'c', 'd', 'e', 'g'],
    3: ['a', 'c', 'd', 'f', 'g'],
    4: ['b', 'c', 'd', 'f'],
    5: ['a', 'b', 'd', 'f', 'g'],
    6: ['a', 'b', 'd', 'e', 'f', 'g'],
    7: ['a', 'c', 'f'],
    8: ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    9: ['a', 'b', 'c', 'd', 'f', 'g'],
}

class SegmentMapping {
    /**
     * A mapping from normal segment to the switched segment for this particular configuration
     */
    private segmentMapping: Record<string, string> = {}

    constructor(allCombinations: string[]) {
        let segmentsInOne: string[] = [];
        let segmentsInFour: string[] = [];
        const letterCounts: Record<string, number> = {}
        allCombinations.forEach(element => {
            if (element.length == 2) {
                segmentsInOne = element.split('');
            } else if (element.length == 4) {
                segmentsInFour = element.split('');
            }
            element.split('').forEach(char => letterCounts[char] = (letterCounts[char] || 0) + 1)
        });

        this.segmentMapping = {
            'a': this.getKeysWithValue(letterCounts, 8).filter(key => !segmentsInOne.includes(key))[0],
            'b': this.getKeysWithValue(letterCounts, 6)[0],
            'c': this.getKeysWithValue(letterCounts, 8).filter(key => segmentsInOne.includes(key))[0],
            'd': this.getKeysWithValue(letterCounts, 7).filter(key => segmentsInFour.includes(key))[0],
            'e': this.getKeysWithValue(letterCounts, 4)[0],
            'f': this.getKeysWithValue(letterCounts, 9)[0],
            'g': this.getKeysWithValue(letterCounts, 7).filter(key => !segmentsInFour.includes(key))[0],
        }
    }

    private getKeysWithValue(record: Record<string, number>, count: number): string[] {
        return Object.keys(record).filter(key => record[key] == count);
    }

    public getNumberFromSegments(segments: string): number {
        return Object.keys(RequiredSegments)
            .map(val => parseInt(val))
            .filter((value: number) => {
                const mappedRequiredSegments: string[] = RequiredSegments[value].map(val => this.segmentMapping[val])

                return mappedRequiredSegments.length == segments.length && mappedRequiredSegments.every(req => segments.includes(req))
            })[0]
    }
}

export class Day08 extends Day {
    
    constructor() {
        super('08')
    }

    protected solvePartOne(input: string): number {
        const outputs: string[] = input.split('\r\n').flatMap(row => row.split(' | ')[1].split(' '))

        return outputs.filter(value => [2, 3, 4, 7].includes(value.length)).length;
    }

    protected solvePartTwo(input: string): number {
        const lines: string[] = input.split('\r\n');
        let sum: number = 0;

        lines.forEach(line => {
            const lineParts: string[] = line.split(' | ');
            
            const segmentMapping: SegmentMapping = new SegmentMapping(lineParts[0].split(' '));

            const numbers: number[] = lineParts[1].split(' ').map(val => segmentMapping.getNumberFromSegments(val));
            sum += parseInt(numbers.join(''))
        })

        return sum;
    }
}
