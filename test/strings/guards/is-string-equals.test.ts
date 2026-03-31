import { describe, expect, it } from 'bun:test'
import { isStringEquals } from '@/strings/guards'

describe('isStringEquals', () => {
    it('returns true when all others equal str', () => {
        expect(isStringEquals('abc', 'abc', 'abc')).toBe(true)
    })

    it('returns false when any other differs', () => {
        expect(isStringEquals('abc', 'abc', 'def')).toBe(false)
    })

    it('returns true for single matching other', () => {
        expect(isStringEquals('abc', 'abc')).toBe(true)
    })

    it('returns false for single non-matching other', () => {
        expect(isStringEquals('abc', 'def')).toBe(false)
    })

    it('returns false when no others provided', () => {
        expect(isStringEquals('abc')).toBe(false)
    })

    it('is case-sensitive', () => {
        expect(isStringEquals('abc', 'ABC')).toBe(false)
    })

    it('handles empty strings', () => {
        expect(isStringEquals('', '')).toBe(true)
        expect(isStringEquals('', 'a')).toBe(false)
    })
})
