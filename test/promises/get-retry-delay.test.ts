import { describe, expect, it } from 'bun:test'
import { getRetryDelay } from '../../src/promises/retry'

describe('getRetryDelay', () => {
    it('returns base delay on first attempt with defaults', () => {
        const result = getRetryDelay(1, { jitter: 0 })

        expect(result).toBe(1000)
    })

    it('applies exponential backoff on subsequent attempts', () => {
        const second = getRetryDelay(2, { jitter: 0 })
        const third = getRetryDelay(3, { jitter: 0 })

        expect(second).toBe(2000)
        expect(third).toBe(4000)
    })

    it('clamps to maxDelay', () => {
        const result = getRetryDelay(10, { jitter: 0, maxDelay: 5000 })

        expect(result).toBe(5000)
    })

    it('uses custom delay', () => {
        const result = getRetryDelay(1, { delay: 500, jitter: 0 })

        expect(result).toBe(500)
    })

    it('uses custom backoff factor', () => {
        const result = getRetryDelay(3, { backoff: 3, delay: 100, jitter: 0 })

        expect(result).toBe(900)
    })

    it('uses default options when none provided', () => {
        const result = getRetryDelay(1)

        expect(result).toBeGreaterThanOrEqual(0)
        expect(result).toBeLessThanOrEqual(10_000)
    })

    it('returns exact delay when jitter is 0', () => {
        const results = Array.from({ length: 20 }, () => getRetryDelay(1, { jitter: 0 }))

        for (const r of results) {
            expect(r).toBe(1000)
        }
    })

    it('returns exact delay when jitter is negative', () => {
        const result = getRetryDelay(1, { jitter: -1 })

        expect(result).toBe(1000)
    })

    it('applies jitter within expected range', () => {
        const results = Array.from({ length: 100 }, () => getRetryDelay(1, { delay: 1000, jitter: 0.5 }))

        for (const r of results) {
            expect(r).toBeGreaterThanOrEqual(0)
            expect(r).toBeLessThanOrEqual(10_000)
        }
    })

    it('clamps jittered result to 0 minimum', () => {
        const results = Array.from({ length: 100 }, () => getRetryDelay(1, { delay: 1, jitter: 1, maxDelay: 10_000 }))

        for (const r of results) {
            expect(r).toBeGreaterThanOrEqual(0)
        }
    })

    it('clamps jittered result to maxDelay maximum', () => {
        const results = Array.from({ length: 100 }, () => getRetryDelay(1, { delay: 9999, jitter: 0.5, maxDelay: 10_000 }))

        for (const r of results) {
            expect(r).toBeLessThanOrEqual(10_000)
        }
    })

    it('handles attempt 0 producing sub-1 exponent', () => {
        const result = getRetryDelay(0, { delay: 1000, jitter: 0 })

        expect(result).toBe(500)
    })

    it('handles very large attempt number by clamping', () => {
        const result = getRetryDelay(100, { jitter: 0, maxDelay: 10_000 })

        expect(result).toBe(10_000)
    })

    it('handles maxDelay of 0', () => {
        const result = getRetryDelay(1, { jitter: 0, maxDelay: 0 })

        expect(result).toBe(0)
    })

    it('handles delay of 0', () => {
        const result = getRetryDelay(1, { delay: 0, jitter: 0 })

        expect(result).toBe(0)
    })
})
