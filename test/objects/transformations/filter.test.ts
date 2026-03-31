import { describe, expect, it } from 'bun:test'
import { filter } from '@/objects/transformations'

describe('filter', () => {
    it('filters by key', () => {
        const result = filter({ a: 1, b: 2, c: 3 }, (key) => key === 'a' || key === 'c')

        expect(result).toEqual({ a: 1, c: 3 })
    })

    it('filters by value', () => {
        const result = filter({ a: 1, b: 0, c: '', d: null, e: 'hello' }, (_key, value) => !!value)

        expect(result).toEqual({ a: 1, e: 'hello' })
    })

    it('filters by index', () => {
        const result = filter({ a: 1, b: 2, c: 3, d: 4 }, (_key, _value, index) => index < 2)

        expect(result).toEqual({ a: 1, b: 2 })
    })

    it('predicate receives correct arguments: key, value, index', () => {
        const received: Array<[string, number, number]> = []

        filter({ x: 10, y: 20, z: 30 }, (key, value, index) => {
            received.push([key as string, value, index])

            return true
        })

        expect(received).toEqual([
            ['x', 10, 0],
            ['y', 20, 1],
            ['z', 30, 2],
        ])
    })

    it('returns empty object when no entries match', () => {
        const result = filter({ a: 1, b: 2, c: 3 }, () => false)

        expect(result).toEqual({})
    })

    it('returns all entries when all match', () => {
        const result = filter({ a: 1, b: 2, c: 3 }, () => true)

        expect(result).toEqual({ a: 1, b: 2, c: 3 })
    })

    it('returns empty object for empty object input', () => {
        const result = filter({}, () => true)

        expect(result).toEqual({})
    })

    it('preserves value references for nested objects', () => {
        const nested = { deep: true }
        const obj = { a: nested, b: { deep: false } }

        const result = filter(obj, (key) => key === 'a')

        expect(result).toEqual({ a: nested })
        expect(result.a).toBe(nested)
    })

    it('single property object kept', () => {
        const result = filter({ only: 42 }, () => true)

        expect(result).toEqual({ only: 42 })
    })

    it('single property object removed', () => {
        const result = filter({ only: 42 }, () => false)

        expect(result).toEqual({})
    })

    it('handles object with many properties', () => {
        const obj = Object.fromEntries(Array.from({ length: 100 }, (_, i) => [`key${i}`, i]))
        const result = filter(obj, (_key, value) => (value) % 2 === 0)

        expect(Object.keys(result).length).toBe(50)
        expect(result.key0).toBe(0)
        expect(result.key98).toBe(98)
        expect(result.key1).toBeUndefined()
    })

    it('filters by combined key and value condition', () => {
        const result = filter(
            { active: true, age: 30, name: 'Alice' },
            (key, value) => key === 'name' || value === true,
        )

        expect(result).toEqual({ active: true, name: 'Alice' })
    })

    it('filters out null and undefined while keeping other falsy values', () => {
        const result = filter(
            { a: undefined, b: null, c: 0, d: '' } as Record<string, unknown>,
            (_key, value) => value != null,
        )

        expect(result).toEqual({ c: 0, d: '' })
    })

    it('does not mutate the original object', () => {
        const obj = { a: 1, b: 2, c: 3 }
        filter(obj, (key) => key !== 'b')

        expect(obj).toEqual({ a: 1, b: 2, c: 3 })
    })
})
