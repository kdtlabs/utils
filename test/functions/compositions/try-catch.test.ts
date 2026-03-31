import { describe, expect, it } from 'bun:test'
import { tryCatch } from '../../../src/functions/compositions'

describe('tryCatch', () => {
    it('returns fn result when no error', () => {
        expect(tryCatch(() => 42, 0)).toBe(42)
    })

    it('returns static fallback when fn throws', () => {
        const fn = () => {
            throw new Error('boom')
        }

        expect(tryCatch(fn, 99)).toBe(99)
    })

    it('calls fallback function with error when fn throws', () => {
        const fn = () => {
            throw new Error('boom')
        }

        const result = tryCatch(
            fn,
            (error) => (error as Error).message,
        )

        expect(result).toBe('boom')
    })
})
