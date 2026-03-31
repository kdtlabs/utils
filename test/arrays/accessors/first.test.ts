import { describe, expect, it } from 'bun:test'
import { first } from '@/arrays/accessors'

describe('first', () => {
    it('returns first element', () => {
        expect(first([10, 20, 30])).toBe(10)
    })

    it('returns undefined for empty array', () => {
        expect(first([])).toBeUndefined()
    })

    it('single element', () => {
        expect(first([42])).toBe(42)
    })

    it('first element is undefined — returns undefined (array is non-empty)', () => {
        expect(first([undefined, 1, 2])).toBeUndefined()
    })

    it('first element is null', () => {
        expect(first([null, 1, 2])).toBeNull()
    })

    it('array of mixed types', () => {
        expect(first([false, 'x', 99])).toBe(false)
    })
})
