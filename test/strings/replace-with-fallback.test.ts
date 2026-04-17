import type { Replacer } from '../../src/strings/replacers/types'
import { describe, expect, test } from 'bun:test'
import { DEFAULT_REPLACERS, replaceWithFallback } from '../../src/strings/replace-with-fallback'

describe('replaceWithFallback', () => {
    test('uses simple strategy for exact match', () => {
        const { result, strategy } = replaceWithFallback('hello world', 'world', 'earth')

        expect(result).toBe('hello earth')
        expect(strategy).toBe('simple')
    })

    test('falls back to line-trimmed when simple fails', () => {
        const source = '  line a  \n  line b  '
        const search = 'line a\nline b'
        const { result, strategy } = replaceWithFallback(source, search, 'replaced')

        expect(strategy).toBe('line-trimmed')
        expect(result).toBe('replaced')
    })

    test('throws TypeError on empty search', () => {
        expect(() => replaceWithFallback('hello', '', 'world')).toThrow(TypeError)
    })

    test('short-circuits when search === replacement', () => {
        const { result, strategy } = replaceWithFallback('hello world', 'world', 'world')

        expect(result).toBe('hello world')
        expect(strategy).toBe('simple')
    })

    test('throws Error when no replacer matches', () => {
        const neverMatch: Replacer = { name: 'never', replace: () => null }

        expect(() => replaceWithFallback('hello', 'xyz', 'abc', [neverMatch])).toThrow(/No replacer matched/u)
    })

    test('returns strategy name of matching replacer', () => {
        const custom: Replacer = { name: 'custom', replace: (_s, _se, r) => r }
        const { strategy } = replaceWithFallback('a', 'b', 'c', [custom])

        expect(strategy).toBe('custom')
    })

    test('respects custom replacers array', () => {
        const custom: Replacer = { name: 'always', replace: () => 'custom-result' }
        const { result, strategy } = replaceWithFallback('a', 'b', 'c', [custom])

        expect(result).toBe('custom-result')
        expect(strategy).toBe('always')
    })

    test('first match wins (order matters)', () => {
        const first: Replacer = { name: 'first', replace: () => 'first-result' }
        const second: Replacer = { name: 'second', replace: () => 'second-result' }
        const { strategy } = replaceWithFallback('a', 'b', 'c', [first, second])

        expect(strategy).toBe('first')
    })

    test('DEFAULT_REPLACERS has 6 entries in correct order', () => {
        expect(DEFAULT_REPLACERS).toHaveLength(6)

        expect(DEFAULT_REPLACERS.map((r) => r.name)).toEqual([
            'simple',
            'line-trimmed',
            'trimmed-boundary',
            'indentation',
            'whitespace',
            'escape',
        ])
    })
})
