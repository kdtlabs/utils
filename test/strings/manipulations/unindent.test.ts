import { describe, expect, it } from 'bun:test'
import { unindent } from '../../../src/strings/manipulations'

describe('unindent', () => {
    it('removes common indent from plain string', () => {
        expect(unindent('    line 1\n    line 2\n    line 3')).toBe('line 1\nline 2\nline 3')
    })

    it('removes common indent preserving relative indentation', () => {
        expect(unindent('    line 1\n      line 2\n    line 3')).toBe('line 1\n  line 2\nline 3')
    })

    it('removes leading empty lines', () => {
        expect(unindent('\n    line 1\n    line 2')).toBe('line 1\nline 2')
    })

    it('removes trailing empty lines', () => {
        expect(unindent('    line 1\n    line 2\n  ')).toBe('line 1\nline 2')
    })

    it('removes both leading and trailing empty lines', () => {
        expect(unindent('\n    line 1\n    line 2\n  ')).toBe('line 1\nline 2')
    })

    it('skips empty lines when computing minimum indent', () => {
        expect(unindent('    line 1\n\n    line 3')).toBe('line 1\n\nline 3')
    })

    it('returns string as-is when no indentation', () => {
        expect(unindent('line 1\nline 2')).toBe('line 1\nline 2')
    })

    it('handles empty string', () => {
        expect(unindent('')).toBe('')
    })

    it('handles single indented line', () => {
        expect(unindent('    hello')).toBe('hello')
    })

    it('works as tagged template literal', () => {
        const result = unindent`
            line 1
            line 2
            line 3
        `

        expect(result).toBe('line 1\nline 2\nline 3')
    })

    it('works as tagged template with interpolation', () => {
        const name = 'world'

        const result = unindent`
            hello ${name}
            goodbye ${name}
        `

        expect(result).toBe('hello world\ngoodbye world')
    })

    it('handles tagged template with mixed indentation', () => {
        const result = unindent`
            line 1
              line 2
            line 3
        `

        expect(result).toBe('line 1\n  line 2\nline 3')
    })

    it('handles tab indentation', () => {
        expect(unindent('\t\tline 1\n\t\tline 2')).toBe('line 1\nline 2')
    })

    it('handles string with all lines having same indent', () => {
        expect(unindent('  a\n  b\n  c')).toBe('a\nb\nc')
    })
})
