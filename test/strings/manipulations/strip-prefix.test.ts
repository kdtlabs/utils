import { describe, expect, it } from 'bun:test'
import { stripPrefix } from '@/strings/manipulations'

describe('stripPrefix', () => {
    it('removes prefix when present', () => {
        expect(stripPrefix('hello world', 'hello ')).toBe('world')
    })

    it('returns original string when prefix not present', () => {
        expect(stripPrefix('hello world', 'foo')).toBe('hello world')
    })

    it('handles empty string', () => {
        expect(stripPrefix('', 'prefix')).toBe('')
    })

    it('handles empty prefix', () => {
        expect(stripPrefix('hello', '')).toBe('hello')
    })

    it('removes single character prefix', () => {
        expect(stripPrefix('/path', '/')).toBe('path')
    })

    it('only removes from the start', () => {
        expect(stripPrefix('abcabc', 'abc')).toBe('abc')
    })
})
