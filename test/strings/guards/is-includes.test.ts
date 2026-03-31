import { describe, expect, it } from 'bun:test'
import { isIncludes } from '../../../src/strings/guards'

describe('isIncludes', () => {
    it('defaults to "all" mode', () => {
        expect(isIncludes('hello world', ['hello', 'world'])).toBe(true)
        expect(isIncludes('hello world', ['hello', 'bar'])).toBe(false)
    })

    it('works with "all" mode explicitly', () => {
        expect(isIncludes('hello world', ['hello', 'world'], 'all')).toBe(true)
    })

    it('works with "any" mode', () => {
        expect(isIncludes('hello world', ['hello', 'bar'], 'any')).toBe(true)
        expect(isIncludes('hello world', ['foo', 'bar'], 'any')).toBe(false)
    })

    it('accepts a single string instead of array', () => {
        expect(isIncludes('hello world', 'hello')).toBe(true)
        expect(isIncludes('hello world', 'bar')).toBe(false)
    })

    it('accepts a single string in "any" mode', () => {
        expect(isIncludes('hello world', 'hello', 'any')).toBe(true)
    })
})
