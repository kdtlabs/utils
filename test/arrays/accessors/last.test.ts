import { describe, expect, it } from 'bun:test'
import { last } from '@/arrays/accessors'

describe('last', () => {
    it('returns last element', () => {
        expect(last([10, 20, 30])).toBe(30)
    })

    it('returns undefined for empty array', () => {
        expect(last([])).toBeUndefined()
    })

    it('single element', () => {
        expect(last([42])).toBe(42)
    })

    it('last element is undefined — returns undefined (array is non-empty)', () => {
        expect(last([1, 2, undefined])).toBeUndefined()
    })

    it('last element is null', () => {
        expect(last([1, 2, null])).toBeNull()
    })

    it('array of mixed types', () => {
        expect(last([false, 'x', 99])).toBe(99)
    })
})
