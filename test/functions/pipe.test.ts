import { describe, expect, it } from 'bun:test'
import { pipe } from '../../src/functions/pipe'

describe('pipe', () => {
    it('returns undefined when called with no arguments', () => {
        expect(pipe()).toBeUndefined()
    })

    it('calls single function and returns its result', () => {
        expect(pipe(() => 42)).toBe(42)
    })

    it('pipes result through two functions', () => {
        const result = pipe(
            () => 2,
            (n: number) => n * 3,
        )

        expect(result).toBe(6)
    })

    it('pipes result through multiple functions', () => {
        const result = pipe(
            () => 1,
            (n: number) => n + 1,
            (n: number) => n * 10,
            (n: number) => `value:${n}`,
        )

        expect(result).toBe('value:20')
    })

    it('passes first function result as argument to second', () => {
        const result = pipe(
            () => [1, 2, 3],
            (arr: number[]) => arr.length,
        )

        expect(result).toBe(3)
    })
})
