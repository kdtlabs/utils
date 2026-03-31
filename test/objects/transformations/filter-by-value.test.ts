import { describe, expect, it } from 'bun:test'
import { filterByValue } from '../../../src/objects/transformations'

describe('filterByValue', () => {
    it('filters truthy values only', () => {
        const obj = { a: 1, b: null, c: 'hello', d: undefined, e: 0, f: '', g: false }

        expect(filterByValue(obj, (v) => !!v)).toEqual({ a: 1, c: 'hello' })
    })

    it('keeps only number values', () => {
        const obj = { a: 1, b: 'two', c: 3, d: true, e: null }

        expect(filterByValue(obj, (v) => typeof v === 'number')).toEqual({ a: 1, c: 3 })
    })

    it('keeps only string values', () => {
        const obj = { a: 1, b: 'two', c: 3, d: 'four', e: null }

        expect(filterByValue(obj, (v) => typeof v === 'string')).toEqual({ b: 'two', d: 'four' })
    })

    it('filters values greater than a threshold', () => {
        const obj = { a: 5, b: 15, c: 3, d: 20, e: 10 }

        expect(filterByValue(obj, (v) => v > 10)).toEqual({ b: 15, d: 20 })
    })

    it('filters non-empty strings', () => {
        const obj = { a: 'hello', b: '', c: 'world', d: '' }

        expect(filterByValue(obj, (v) => v !== '')).toEqual({ a: 'hello', c: 'world' })
    })

    it('returns empty object when no values match', () => {
        const obj = { a: 1, b: 2, c: 3 }

        expect(filterByValue(obj, (v) => v > 100)).toEqual({})
    })

    it('returns all entries when all values match', () => {
        const obj = { a: 1, b: 2, c: 3 }

        expect(filterByValue(obj, (v) => v > 0)).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('returns empty object for empty object input', () => {
        expect(filterByValue({}, () => true)).toEqual({})
    })

    it('returns empty object when all values are null or undefined', () => {
        const obj: Record<string, null | undefined> = { a: null, b: undefined, c: null, d: undefined }
        const isNotNullish = (v: null | undefined): boolean => v !== null && v !== undefined

        expect(filterByValue(obj, isNotNullish)).toEqual({})
    })

    it('handles mixed types correctly', () => {
        const nested = { x: 1 }
        const arr = [1, 2]

        const obj = {
            arr,
            bool: true,
            nil: null,
            num: 42,
            obj: nested,
            str: 'hello',
            undef: undefined,
        }

        expect(filterByValue(obj, (v) => typeof v === 'object' && v !== null)).toEqual({
            arr,
            obj: nested,
        })
    })

    it('single property object that matches', () => {
        expect(filterByValue({ only: 42 }, (v) => v === 42)).toEqual({ only: 42 })
    })

    it('single property object that does not match', () => {
        expect(filterByValue({ only: 42 }, (v) => v === 0)).toEqual({})
    })

    it('preserves value references for nested objects', () => {
        const inner = { deep: true }
        const obj = { a: inner, b: 'skip' }
        const result = filterByValue(obj, (v) => typeof v === 'object')

        expect(result).toEqual({ a: inner })
        expect(result.a).toBe(inner)
    })
})
