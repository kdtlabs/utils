import { describe, expect, it } from 'bun:test'
import { isIncludesAll } from '@/strings/guards'

describe('isIncludesAll', () => {
    it('returns true when all search terms are included', () => {
        expect(isIncludesAll('hello world foo', ['hello', 'world'])).toBe(true)
    })

    it('returns false when any search term is missing', () => {
        expect(isIncludesAll('hello world', ['hello', 'bar'])).toBe(false)
    })

    it('returns true for empty search array', () => {
        expect(isIncludesAll('hello', [])).toBe(true)
    })

    it('returns false when string is empty and search is non-empty', () => {
        expect(isIncludesAll('', ['a'])).toBe(false)
    })

    it('returns true when string is empty and search is empty', () => {
        expect(isIncludesAll('', [])).toBe(true)
    })

    it('handles single search term', () => {
        expect(isIncludesAll('hello world', ['hello'])).toBe(true)
        expect(isIncludesAll('hello world', ['bar'])).toBe(false)
    })
})
