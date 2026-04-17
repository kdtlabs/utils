import { describe, expect, test } from 'bun:test'
import { createSafeRegex } from '../../src/strings/create-safe-regex'

describe('createSafeRegex', () => {
    describe('safe patterns', () => {
        test('returns RegExp for plain literal', () => {
            const re = createSafeRegex('hello')

            expect(re).toBeInstanceOf(RegExp)
            expect(re.source).toBe('hello')
        })

        test('accepts character class', () => {
            expect(createSafeRegex('[a-z0-9]+').test('abc123')).toBe(true)
        })

        test('accepts alternation without nested quantifiers', () => {
            expect(createSafeRegex('(foo|bar|baz)').test('bar')).toBe(true)
        })

        test('accepts bounded quantifier inside unbounded', () => {
            expect(createSafeRegex('(a?)+').source).toBe('(a?)+')
            expect(createSafeRegex('(a{1,3})+').source).toBe('(a{1,3})+')
        })

        test('accepts sequential quantifiers', () => {
            expect(createSafeRegex('a+b+c+').test('abc')).toBe(true)
        })

        test('accepts quantifier inside unquantified group', () => {
            expect(createSafeRegex('(a+b)').test('ab')).toBe(true)
        })

        test('accepts non-capturing and lookaround groups', () => {
            expect(createSafeRegex('(?:foo)+').test('foo')).toBe(true)
            expect(createSafeRegex('(?=abc)').source).toBe('(?=abc)')
            expect(createSafeRegex(String.raw`(?<name>\d+)`).source).toBe(String.raw`(?<name>\d+)`)
        })

        test('ignores quantifier-like chars inside character class', () => {
            expect(createSafeRegex('[*+?]+').source).toBe('[*+?]+')
        })

        test('ignores escaped quantifiers', () => {
            expect(createSafeRegex(String.raw`a\+b\*`).source).toBe(String.raw`a\+b\*`)
        })

        test('accepts complex real-world url pattern', () => {
            const source = String.raw`^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z0-9][a-z0-9-]{0,61}[a-z0-9]$`
            expect(createSafeRegex(source).source).toBe(source)
        })
    })

    describe('unsafe patterns', () => {
        test('throws on classic nested quantifier (a+)+', () => {
            expect(() => createSafeRegex('(a+)+')).toThrow(/ReDoS/u)
        })

        test('throws on (a*)*', () => {
            expect(() => createSafeRegex('(a*)*')).toThrow(/ReDoS/u)
        })

        test('throws on (.*)* ', () => {
            expect(() => createSafeRegex('(.*)*')).toThrow(/ReDoS/u)
        })

        test(String.raw`throws on (\w+)*`, () => {
            expect(() => createSafeRegex(String.raw`(\w+)*`)).toThrow(/ReDoS/u)
        })

        test('throws on doubly nested ((a+))+', () => {
            expect(() => createSafeRegex('((a+))+')).toThrow(/ReDoS/u)
        })

        test('throws when inner unbounded {n,} meets outer +', () => {
            expect(() => createSafeRegex('(a{2,})+')).toThrow(/ReDoS/u)
        })

        test('throws when outer unbounded {n,} meets inner +', () => {
            expect(() => createSafeRegex('(a+){2,}')).toThrow(/ReDoS/u)
        })

        test('includes pattern in error message', () => {
            expect(() => createSafeRegex('(a+)+')).toThrow('(a+)+')
        })
    })

    describe('inputs and flags', () => {
        test('accepts RegExp input and preserves flags', () => {
            const re = createSafeRegex(/abc/giu)

            expect(re.flags).toContain('g')
            expect(re.flags).toContain('i')
            expect(re.flags).toContain('u')
        })

        test('explicit flags override RegExp flags', () => {
            const re = createSafeRegex(/abc/gu, 'i')

            expect(re.flags).toBe('i')
        })

        test('propagates invalid regex errors from RegExp constructor', () => {
            expect(() => createSafeRegex('(')).toThrow(SyntaxError)
        })
    })
})
