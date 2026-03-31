import { describe, expect, it } from 'bun:test'
import { isNonEmptyArray } from '@/arrays/guards'

describe('isNonEmptyArray', () => {
    it('returns true for non-empty array', () => {
        expect(isNonEmptyArray([1])).toBe(true)
        expect(isNonEmptyArray([1, 2, 3])).toBe(true)
    })

    it('returns false for empty array', () => {
        expect(isNonEmptyArray([])).toBe(false)
    })
})
