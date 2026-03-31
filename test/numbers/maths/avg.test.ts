import { describe, expect, it } from 'bun:test'
import { avg } from '@/numbers/maths'

describe('avg', () => {
    it('calculates the average', () => {
        expect(avg([2, 4, 6])).toBe(4)
    })

    it('returns 0 for an empty array', () => {
        expect(avg([])).toBe(0)
    })

    it('handles a single element', () => {
        expect(avg([5])).toBe(5)
    })

    it('handles decimal results', () => {
        expect(avg([1, 2])).toBe(1.5)
    })
})
