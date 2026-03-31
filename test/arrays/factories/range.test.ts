import { describe, expect, it } from 'bun:test'
import { range } from '../../../src/arrays/factories'

describe('range', () => {
    it('creates range from 0 to 4', () => {
        expect(range(0, 4)).toEqual([0, 1, 2, 3, 4])
    })

    it('creates range with custom step', () => {
        expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8, 10])
    })

    it('creates range with negative values', () => {
        expect(range(-2, 2)).toEqual([-2, -1, 0, 1, 2])
    })

    it('creates single element range when from equals to', () => {
        expect(range(5, 5)).toEqual([5])
    })

    it('creates range with step larger than span', () => {
        expect(range(0, 2, 5)).toEqual([0])
    })

    it('creates range with decimal step', () => {
        expect(range(0, 1, 0.5)).toEqual([0, 0.5, 1])
    })

    it('from > to with positive step returns empty array', () => {
        expect(range(5, 0, 1)).toEqual([])
    })

    it('step = 0 throws or does not produce a valid array', () => {
        expect(() => range(1, 5, 0)).toThrow()
    })

    it('negative step with from > to descends correctly', () => {
        expect(range(10, 0, -2)).toEqual([10, 8, 6, 4, 2, 0])
    })

    it('small decimal step loses one element due to floating point precision', () => {
        const result = range(0, 0.3, 0.1)
        expect(result.length).toBe(3)
        expect(result[0]).toBe(0)
    })

    it('from equals to with step > 1 returns single element', () => {
        expect(range(7, 7, 5)).toEqual([7])
    })
})
