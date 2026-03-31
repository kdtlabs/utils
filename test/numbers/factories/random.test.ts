import { describe, expect, it } from 'bun:test'
import { random } from '../../../src/numbers/factories'

describe('random', () => {
    it('returns a value within the specified range', () => {
        for (let i = 0; i < 100; i++) {
            const result = random(1, 10)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(10)
        }
    })

    it('returns an integer', () => {
        for (let i = 0; i < 100; i++) {
            const result = random(1, 10)
            expect(Number.isInteger(result)).toBe(true)
        }
    })

    it('handles min equal to max', () => {
        expect(random(5, 5)).toBe(5)
    })

    it('handles inverted min and max', () => {
        for (let i = 0; i < 100; i++) {
            const result = random(10, 1)
            expect(result).toBeGreaterThanOrEqual(1)
            expect(result).toBeLessThanOrEqual(10)
        }
    })

    it('handles negative range', () => {
        for (let i = 0; i < 100; i++) {
            const result = random(-10, -1)
            expect(result).toBeGreaterThanOrEqual(-10)
            expect(result).toBeLessThanOrEqual(-1)
        }
    })

    it('handles range crossing zero', () => {
        for (let i = 0; i < 100; i++) {
            const result = random(-5, 5)
            expect(result).toBeGreaterThanOrEqual(-5)
            expect(result).toBeLessThanOrEqual(5)
        }
    })
})
