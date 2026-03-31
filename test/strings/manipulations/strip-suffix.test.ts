import { describe, expect, it } from 'bun:test'
import { stripSuffix } from '@/strings/manipulations'

describe('stripSuffix', () => {
    it('removes suffix when present', () => {
        expect(stripSuffix('hello world', ' world')).toBe('hello')
    })

    it('returns original string when suffix not present', () => {
        expect(stripSuffix('hello world', 'foo')).toBe('hello world')
    })

    it('handles empty string', () => {
        expect(stripSuffix('', 'suffix')).toBe('')
    })

    it('handles empty suffix', () => {
        expect(stripSuffix('hello', '')).toBe('hello')
    })

    it('removes single character suffix', () => {
        expect(stripSuffix('path/', '/')).toBe('path')
    })

    it('only removes from the end', () => {
        expect(stripSuffix('abcabc', 'abc')).toBe('abc')
    })
})
