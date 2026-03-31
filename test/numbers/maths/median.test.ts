import { describe, expect, it } from 'bun:test'
import { median } from '@/numbers/maths'

describe('median', () => {
    it('returns the middle value for odd-length array', () => {
        expect(median([1, 3, 5])).toBe(3)
    })

    it('returns the average of two middle values for even-length array', () => {
        expect(median([1, 2, 3, 4])).toBe(2.5)
    })

    it('returns 0 for an empty array', () => {
        expect(median([])).toBe(0)
    })

    it('returns the value for a single element', () => {
        expect(median([5])).toBe(5)
    })

    it('sorts before finding median', () => {
        expect(median([5, 1, 3])).toBe(3)
    })

    it('does not mutate the original array', () => {
        const input = [3, 1, 2]
        median(input)
        expect(input).toEqual([3, 1, 2])
    })

    it('handles negative numbers', () => {
        expect(median([-5, -1, -3])).toBe(-3)
    })

    it('handles duplicate values', () => {
        expect(median([1, 1, 1, 1])).toBe(1)
    })

    it('handles two elements', () => {
        expect(median([1, 3])).toBe(2)
    })
})
