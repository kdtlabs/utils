import { describe, expect, it } from 'bun:test'
import { isUndefined } from '../../../src/core/guards'

describe('isUndefined', () => {
    it('returns true for undefined', () => {
        expect(isUndefined(undefined)).toBe(true)
    })

    it('returns false for null', () => {
        expect(isUndefined(null)).toBe(false)
    })

    it('returns false for 0', () => {
        expect(isUndefined(0)).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isUndefined('')).toBe(false)
    })
})
