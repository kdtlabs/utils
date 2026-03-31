import { describe, expect, it } from 'bun:test'
import { isStringEqualsIgnoreCase } from '@/strings/guards'

describe('isStringEqualsIgnoreCase', () => {
    it('returns true when all others match ignoring case', () => {
        expect(isStringEqualsIgnoreCase('abc', 'ABC', 'Abc')).toBe(true)
    })

    it('returns false when any other differs', () => {
        expect(isStringEqualsIgnoreCase('abc', 'ABC', 'def')).toBe(false)
    })

    it('returns true for single matching other', () => {
        expect(isStringEqualsIgnoreCase('Hello', 'hello')).toBe(true)
    })

    it('returns false for single non-matching other', () => {
        expect(isStringEqualsIgnoreCase('abc', 'def')).toBe(false)
    })

    it('returns false when no others provided', () => {
        expect(isStringEqualsIgnoreCase('abc')).toBe(false)
    })

    it('handles empty strings', () => {
        expect(isStringEqualsIgnoreCase('', '')).toBe(true)
        expect(isStringEqualsIgnoreCase('', 'a')).toBe(false)
    })
})
