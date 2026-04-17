import { describe, expect, test } from 'bun:test'
import { indentationReplacer } from '../../../src/strings/replacers/indentation'

describe('indentationReplacer', () => {
    test('has correct name', () => {
        expect(indentationReplacer.name).toBe('indentation')
    })

    test('matches when search is dedented version of source', () => {
        const source = '    const x = 1\n    const y = 2'
        const search = 'const x = 1\nconst y = 2'
        const result = indentationReplacer.replace(source, search, 'const z = 3')

        expect(result).toBe('    const z = 3')
    })

    test('re-applies source indent to multi-line replacement', () => {
        const source = '    if (true) {\n        return 1\n    }'
        const search = 'if (true) {\n    return 1\n}'
        const replacement = 'if (false) {\n    return 0\n}'
        const result = indentationReplacer.replace(source, search, replacement)

        expect(result).toBe('    if (false) {\n        return 0\n    }')
    })

    test('preserves surrounding lines', () => {
        const source = 'before\n    target\nafter'
        const search = 'target'
        const result = indentationReplacer.replace(source, search, 'new')

        expect(result).toBe('before\n    new\nafter')
    })

    test('returns null when not found', () => {
        expect(indentationReplacer.replace('hello', 'xyz', 'a')).toBeNull()
    })

    test('handles empty lines in replacement', () => {
        const source = '    line1\n    line2'
        const search = 'line1\nline2'
        const replacement = 'a\n\nb'
        const result = indentationReplacer.replace(source, search, replacement)

        expect(result).toBe('    a\n\n    b')
    })

    test('handles tab indentation', () => {
        const source = '\tconst x = 1'
        const search = 'const x = 1'
        const result = indentationReplacer.replace(source, search, 'const y = 2')

        expect(result).toBe('\tconst y = 2')
    })
})
