import { describe, expect, it } from 'bun:test'
import { unique } from '@/arrays/set-operations'

describe('unique', () => {
    it('removes duplicate numbers', () => {
        expect(unique([1, 2, 2, 3, 3, 3])).toEqual([1, 2, 3])
    })

    it('removes duplicate strings', () => {
        expect(unique(['a', 'b', 'a', 'c'])).toEqual(['a', 'b', 'c'])
    })

    it('returns empty array for empty input', () => {
        expect(unique([])).toEqual([])
    })

    it('single element', () => {
        expect(unique([42])).toEqual([42])
    })

    it('all elements already unique', () => {
        expect(unique([1, 2, 3])).toEqual([1, 2, 3])
    })

    it('all elements are the same', () => {
        expect(unique([5, 5, 5])).toEqual([5])
    })

    it('preserves insertion order', () => {
        expect(unique([3, 1, 2, 1, 3])).toEqual([3, 1, 2])
    })

    it('treats null and undefined as distinct values', () => {
        expect(unique([null, undefined, null, undefined])).toEqual([null, undefined])
    })

    it('does not deduplicate objects by value (reference identity)', () => {
        const a = { id: 1 }
        const b = { id: 1 }

        expect(unique([a, b])).toEqual([a, b])
    })

    it('deduplicates same object reference', () => {
        const a = { id: 1 }

        expect(unique([a, a, a])).toEqual([a])
    })

    it('handles NaN (Set treats all NaN as same)', () => {
        expect(unique([Number.NaN, Number.NaN, 1])).toEqual([Number.NaN, 1])
    })

    it('treats 0 and -0 as same (Set behavior)', () => {
        expect(unique([0, -0, 1])).toEqual([0, 1])
    })
})
