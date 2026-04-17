import { describe, expect, test } from 'bun:test'
import { trimmedBoundaryReplacer } from '../../../src/strings/replacers/trimmed-boundary'

describe('trimmedBoundaryReplacer', () => {
    test('has correct name', () => {
        expect(trimmedBoundaryReplacer.name).toBe('trimmed-boundary')
    })

    test('matches when search has leading/trailing whitespace', () => {
        expect(trimmedBoundaryReplacer.replace('hello world', '  hello  ', 'hi')).toBe('hi world')
    })

    test('matches when search has newlines at boundary', () => {
        expect(trimmedBoundaryReplacer.replace('hello world', '\nhello\n', 'hi')).toBe('hi world')
    })

    test('preserves interior whitespace of search', () => {
        expect(trimmedBoundaryReplacer.replace('a  b  c', '  a  b  ', 'x')).toBe('x  c')
    })

    test('returns null when trimmed search not found', () => {
        expect(trimmedBoundaryReplacer.replace('hello', '  xyz  ', 'a')).toBeNull()
    })

    test('works with no boundary whitespace (falls through to indexOf)', () => {
        expect(trimmedBoundaryReplacer.replace('abc', 'ab', 'x')).toBe('xc')
    })
})
