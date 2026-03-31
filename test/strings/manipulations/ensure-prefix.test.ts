import { describe, expect, it } from 'bun:test'
import { ensurePrefix } from '../../../src/strings/manipulations'

describe('ensurePrefix', () => {
    it('adds prefix when not present', () => {
        expect(ensurePrefix('world', 'hello ')).toBe('hello world')
    })

    it('does not duplicate existing prefix', () => {
        expect(ensurePrefix('hello world', 'hello ')).toBe('hello world')
    })

    it('handles empty string', () => {
        expect(ensurePrefix('', 'prefix')).toBe('prefix')
    })

    it('handles empty prefix', () => {
        expect(ensurePrefix('hello', '')).toBe('hello')
    })

    it('works with single character prefix', () => {
        expect(ensurePrefix('path', '/')).toBe('/path')
        expect(ensurePrefix('/path', '/')).toBe('/path')
    })
})
