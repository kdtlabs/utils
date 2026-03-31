import { describe, expect, it } from 'bun:test'
import { lerp } from '../../../src/numbers/maths'

describe('lerp', () => {
    it('returns start when t is 0', () => {
        expect(lerp(0, 10, 0)).toBe(0)
    })

    it('returns end when t is 1', () => {
        expect(lerp(0, 10, 1)).toBe(10)
    })

    it('returns midpoint when t is 0.5', () => {
        expect(lerp(0, 10, 0.5)).toBe(5)
    })

    it('interpolates between arbitrary values', () => {
        expect(lerp(5, 15, 0.3)).toBeCloseTo(8)
    })

    it('extrapolates when t is greater than 1', () => {
        expect(lerp(0, 10, 2)).toBe(20)
    })

    it('extrapolates when t is negative', () => {
        expect(lerp(0, 10, -1)).toBe(-10)
    })

    it('handles equal start and end', () => {
        expect(lerp(5, 5, 0.5)).toBe(5)
    })

    it('handles negative range', () => {
        expect(lerp(-10, -20, 0.5)).toBe(-15)
    })
})
