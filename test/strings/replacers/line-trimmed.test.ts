import { describe, expect, test } from 'bun:test'
import { lineTrimmedReplacer } from '../../../src/strings/replacers/line-trimmed'

describe('lineTrimmedReplacer', () => {
    test('has correct name', () => {
        expect(lineTrimmedReplacer.name).toBe('line-trimmed')
    })

    test('matches when source lines have extra leading/trailing spaces', () => {
        const source = '  const x = 1  \n  const y = 2  '
        const search = 'const x = 1\nconst y = 2'
        const result = lineTrimmedReplacer.replace(source, search, 'const z = 3')

        expect(result).toBe('const z = 3')
    })

    test('matches with tab indentation', () => {
        const source = '\tconst x = 1\n\tconst y = 2'
        const search = 'const x = 1\nconst y = 2'

        expect(lineTrimmedReplacer.replace(source, search, 'replaced')).toBe('replaced')
    })

    test('preserves surrounding lines', () => {
        const source = 'line1\n  target  \nline3'
        const search = 'target'

        expect(lineTrimmedReplacer.replace(source, search, 'new')).toBe('line1\nnew\nline3')
    })

    test('returns null when no match', () => {
        expect(lineTrimmedReplacer.replace('hello', 'world', 'x')).toBeNull()
    })

    test('matches first occurrence in multi-line', () => {
        const source = '  a  \nb\n  a  \nc'
        const search = 'a'

        expect(lineTrimmedReplacer.replace(source, search, 'x')).toBe('x\nb\n  a  \nc')
    })

    test('handles single line', () => {
        const source = '   hello   '
        const search = 'hello'

        expect(lineTrimmedReplacer.replace(source, search, 'hi')).toBe('hi')
    })
})
