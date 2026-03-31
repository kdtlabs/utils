import { describe, expect, it } from 'bun:test'
import { shuffle } from '../../../src/arrays/operations'

const numericSort = (a: number, b: number) => a - b

describe('shuffle', () => {
    it('returns array with same elements', () => {
        const input = [1, 2, 3, 4, 5]
        const result = shuffle(input)

        expect(result.toSorted(numericSort)).toEqual(input.toSorted(numericSort))
    })

    it('does not mutate original array', () => {
        const input = [1, 2, 3, 4, 5]
        const copy = [...input]

        shuffle(input)
        expect(input).toEqual(copy)
    })

    it('returns same length', () => {
        expect(shuffle([1, 2, 3]).length).toBe(3)
    })

    it('returns empty array for empty input', () => {
        expect(shuffle([])).toEqual([])
    })

    it('single element array', () => {
        expect(shuffle([42])).toEqual([42])
    })

    it('two element array', () => {
        const result = shuffle([1, 2])

        expect(result.toSorted(numericSort)).toEqual([1, 2])
    })

    it('eventually produces a different order', () => {
        const input = [1, 2, 3, 4, 5, 6, 7, 8]
        const results = Array.from({ length: 20 }, () => shuffle(input))
        const allIdentical = results.every((r) => r.every((v, i) => v === input[i]))

        expect(allIdentical).toBe(false)
    })

    it('preserves all duplicates', () => {
        const input = [1, 1, 2, 2, 3, 3]
        const result = shuffle(input)

        expect(result.toSorted(numericSort)).toEqual(input.toSorted(numericSort))
        expect(result.length).toBe(6)
    })

    it('array with nullish elements', () => {
        const input = [null, undefined, null, 1]
        const result = shuffle(input)

        expect(result.length).toBe(4)
        expect(result.filter((x) => x === null).length).toBe(2)
        expect(result.filter((x) => x === undefined).length).toBe(1)
        expect(result.filter((x) => x === 1).length).toBe(1)
    })
})
