import { describe, expect, it } from 'bun:test'
import { nullToUndefined } from '@/common/transformations'

describe('nullToUndefined', () => {
    it('converts null to undefined', () => {
        expect(nullToUndefined(null)).toBeUndefined()
    })

    it('converts undefined to undefined', () => {
        expect(nullToUndefined(undefined)).toBeUndefined()
    })

    it('returns primitives unchanged', () => {
        expect(nullToUndefined(42)).toBe(42)
        expect(nullToUndefined('hello')).toBe('hello')
        expect(nullToUndefined(true)).toBe(true)
        expect(nullToUndefined(0)).toBe(0)
        expect(nullToUndefined('')).toBe('')
        expect(nullToUndefined(false)).toBe(false)
    })

    it('converts null values in a shallow object', () => {
        const input = { a: 1, b: null, c: 'ok' }

        expect(nullToUndefined(input)).toEqual({ a: 1, b: undefined, c: 'ok' })
    })

    it('converts null values in nested objects', () => {
        const input = { a: { b: { c: null, d: 'keep' } }, e: null }

        expect(nullToUndefined(input)).toEqual({
            a: { b: { c: undefined, d: 'keep' } },
            e: undefined,
        })
    })

    it('converts null values in arrays', () => {
        expect(nullToUndefined([1, null, 'a', null])).toEqual([1, undefined, 'a', undefined])
    })

    it('converts null values in arrays nested inside objects', () => {
        const input = { tags: [null, 'a'], meta: { items: [null, 1] } }

        expect(nullToUndefined(input)).toEqual({
            tags: [undefined, 'a'],
            meta: { items: [undefined, 1] },
        })
    })

    it('converts null values in objects nested inside arrays', () => {
        const input = [{ a: null }, { b: { c: null } }]

        expect(nullToUndefined(input)).toEqual([{ a: undefined }, { b: { c: undefined } }])
    })

    it('handles empty object', () => {
        expect(nullToUndefined({})).toEqual({})
    })

    it('handles empty array', () => {
        expect(nullToUndefined([])).toEqual([])
    })

    it('does not recurse into non-plain objects', () => {
        const date = new Date('2024-01-01')
        const map = new Map([['key', null]])
        const set = new Set([null, 1])

        expect(nullToUndefined(date)).toBe(date)
        expect(nullToUndefined(map)).toBe(map)
        expect(nullToUndefined(set)).toBe(set)
    })

    it('preserves non-plain objects inside structures', () => {
        const date = new Date('2024-01-01')
        const input = { created: date, value: null }

        const result = nullToUndefined(input)

        expect(result.created).toBe(date)
        expect(result.value).toBeUndefined()
    })

    it('handles deeply nested structure', () => {
        let input: Record<string, unknown> = { value: null }

        for (let i = 0; i < 10; i++) {
            input = { child: input }
        }

        let result = nullToUndefined(input) as Record<string, unknown>

        for (let i = 0; i < 10; i++) {
            expect(result).toHaveProperty('child')
            result = result.child as Record<string, unknown>
        }

        expect(result.value).toBeUndefined()
    })
})
