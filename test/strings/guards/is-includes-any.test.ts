import { describe, expect, it } from 'bun:test'
import { isIncludesAny } from '@/strings/guards'

describe('isIncludesAny', () => {
    it('returns true when at least one search term is included', () => {
        expect(isIncludesAny('hello world', ['hello', 'bar'])).toBe(true)
    })

    it('returns false when no search term is included', () => {
        expect(isIncludesAny('hello world', ['foo', 'bar'])).toBe(false)
    })

    it('returns false for empty search array', () => {
        expect(isIncludesAny('hello', [])).toBe(false)
    })

    it('returns false when string is empty and search is non-empty', () => {
        expect(isIncludesAny('', ['a'])).toBe(false)
    })

    it('handles single search term', () => {
        expect(isIncludesAny('hello world', ['hello'])).toBe(true)
        expect(isIncludesAny('hello world', ['bar'])).toBe(false)
    })
})
