import { describe, expect, test } from 'bun:test'
import { escapeReplacer } from '../../../src/strings/replacers/escape'

describe('escapeReplacer', () => {
    test('has correct name', () => {
        expect(escapeReplacer.name).toBe('escape')
    })

    test(String.raw`unescapes \n`, () => {
        const source = 'line1\nline2'
        const search = String.raw`line1\nline2`

        expect(escapeReplacer.replace(source, search, 'replaced')).toBe('replaced')
    })

    test(String.raw`unescapes \t`, () => {
        const source = 'a\tb'
        const search = String.raw`a\tb`

        expect(escapeReplacer.replace(source, search, 'x')).toBe('x')
    })

    test(String.raw`unescapes \r`, () => {
        const source = 'a\rb'
        const search = String.raw`a\rb`

        expect(escapeReplacer.replace(source, search, 'x')).toBe('x')
    })

    test('unescapes \\\\ to \\', () => {
        const source = String.raw`a\b`
        const search = String.raw`a\\b`

        expect(escapeReplacer.replace(source, search, 'x')).toBe('x')
    })

    test(String.raw`unescapes \"`, () => {
        const source = 'a"b'
        const search = String.raw`a\"b`

        expect(escapeReplacer.replace(source, search, 'x')).toBe('x')
    })

    test(String.raw`unescapes \'`, () => {
        const source = 'a\'b'
        const search = String.raw`a\'b`

        expect(escapeReplacer.replace(source, search, 'x')).toBe('x')
    })

    test('preserves unknown escapes', () => {
        const source = String.raw`a\xb`
        const search = String.raw`a\xb`

        expect(escapeReplacer.replace(source, search, 'y')).toBe('y')
    })

    test('returns null when unescaped search not found', () => {
        expect(escapeReplacer.replace('hello', String.raw`world\n`, 'x')).toBeNull()
    })

    test('works with no escape sequences (same as simple)', () => {
        expect(escapeReplacer.replace('hello world', 'world', 'earth')).toBe('hello earth')
    })
})
