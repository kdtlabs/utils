import { describe, expect, it } from 'bun:test'
import { isArray } from '../../../src/arrays/guards'

describe('isArray', () => {
    it('returns true for arrays', () => {
        expect(isArray([])).toBe(true)
        expect(isArray([1, 2, 3])).toBe(true)
    })

    it('returns false for non-arrays', () => {
        expect(isArray('hello')).toBe(false)
        expect(isArray(123)).toBe(false)
        expect(isArray(null)).toBe(false)
        expect(isArray(undefined)).toBe(false)
        expect(isArray({})).toBe(false)
        expect(isArray(new Set())).toBe(false)
    })
})
