import { describe, expect, it } from 'bun:test'
import { sum } from '../../../src/numbers/maths'

describe('sum', () => {
    it('sums an array of numbers', () => {
        expect(sum([1, 2, 3])).toBe(6)
    })

    it('returns 0 for an empty array', () => {
        expect(sum([])).toBe(0)
    })

    it('handles a single element', () => {
        expect(sum([5])).toBe(5)
    })

    it('handles negative numbers', () => {
        expect(sum([-1, -2, -3])).toBe(-6)
    })

    it('handles mixed positive and negative', () => {
        expect(sum([1, -2, 3])).toBe(2)
    })
})
