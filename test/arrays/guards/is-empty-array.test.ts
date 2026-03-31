import { describe, expect, it } from 'bun:test'
import { isEmptyArray } from '@/arrays/guards'

describe('isEmptyArray', () => {
    it('returns true for empty array', () => {
        expect(isEmptyArray([])).toBe(true)
    })

    it('returns false for non-empty array', () => {
        expect(isEmptyArray([1])).toBe(false)
        expect(isEmptyArray([1, 2, 3])).toBe(false)
    })
})
