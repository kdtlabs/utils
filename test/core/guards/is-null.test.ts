import { describe, expect, it } from 'bun:test'
import { isNull } from '../../../src/core/guards'

describe('isNull', () => {
    it('returns true for null', () => {
        expect(isNull(null)).toBe(true)
    })

    it('returns false for undefined', () => {
        expect(isNull(undefined)).toBe(false)
    })

    it('returns false for 0', () => {
        expect(isNull(0)).toBe(false)
    })

    it('returns false for empty string', () => {
        expect(isNull('')).toBe(false)
    })
})
