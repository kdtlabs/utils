import { describe, expect, it } from 'bun:test'
import { ensureSuffix } from '../../../src/strings/manipulations'

describe('ensureSuffix', () => {
    it('adds suffix when not present', () => {
        expect(ensureSuffix('hello', ' world')).toBe('hello world')
    })

    it('does not duplicate existing suffix', () => {
        expect(ensureSuffix('hello world', ' world')).toBe('hello world')
    })

    it('handles empty string', () => {
        expect(ensureSuffix('', 'suffix')).toBe('suffix')
    })

    it('handles empty suffix', () => {
        expect(ensureSuffix('hello', '')).toBe('hello')
    })

    it('works with single character suffix', () => {
        expect(ensureSuffix('path', '/')).toBe('path/')
        expect(ensureSuffix('path/', '/')).toBe('path/')
    })
})
