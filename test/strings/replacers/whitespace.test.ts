import { describe, expect, test } from 'bun:test'
import { whitespaceReplacer } from '../../../src/strings/replacers/whitespace'

describe('whitespaceReplacer', () => {
    test('has correct name', () => {
        expect(whitespaceReplacer.name).toBe('whitespace')
    })

    test('matches with different whitespace amounts', () => {
        const source = 'const   x  =  1'
        const search = 'const x = 1'

        expect(whitespaceReplacer.replace(source, search, 'const y = 2')).toBe('const y = 2')
    })

    test('matches newlines as whitespace', () => {
        const source = 'const\nx\n=\n1'
        const search = 'const x = 1'

        expect(whitespaceReplacer.replace(source, search, 'replaced')).toBe('replaced')
    })

    test('matches tabs as whitespace', () => {
        const source = 'const\tx\t=\t1'
        const search = 'const x = 1'

        expect(whitespaceReplacer.replace(source, search, 'replaced')).toBe('replaced')
    })

    test('returns null when non-ws tokens differ', () => {
        expect(whitespaceReplacer.replace('hello world', 'hello earth', 'x')).toBeNull()
    })

    test('escapes regex special chars in search', () => {
        const source = 'a(b) + c'
        const search = 'a(b)  +  c'

        expect(whitespaceReplacer.replace(source, search, 'x')).toBe('x')
    })

    test('preserves surrounding text', () => {
        const source = 'before const  x after'
        const search = 'const x'

        expect(whitespaceReplacer.replace(source, search, 'let y')).toBe('before let y after')
    })
})
