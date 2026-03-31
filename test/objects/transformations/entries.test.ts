import { describe, expect, it } from 'bun:test'
import { entries } from '../../../src/objects/transformations'

describe('entries', () => {
    it('returns an empty array for an empty object', () => {
        expect(entries({})).toEqual([])
    })

    it('returns key-value pairs for an object with string keys', () => {
        expect(entries({ a: 1, b: 2 })).toEqual([['a', 1], ['b', 2]])
    })

    it('returns a single entry for a single property object', () => {
        expect(entries({ only: 'one' })).toEqual([['only', 'one']])
    })

    it('handles mixed value types', () => {
        const nested = { x: 1 }
        const arr = [1, 2, 3]

        const obj = {
            arr,
            bool: true,
            nested,
            nil: null,
            num: 42,
            str: 'hello',
            undef: undefined,
        }

        const result = entries(obj)

        expect(result).toEqual([
            ['arr', arr],
            ['bool', true],
            ['nested', nested],
            ['nil', null],
            ['num', 42],
            ['str', 'hello'],
            ['undef', undefined],
        ])
    })

    it('handles numeric string keys', () => {
        expect(entries({ '0': 'a', '1': 'b' })).toEqual([['0', 'a'], ['1', 'b']])
    })

    it('does not include inherited properties', () => {
        const proto = { inherited: true }
        const obj = Object.create(proto) as Record<string, unknown>
        obj.own = 'value'

        const result = entries(obj)

        expect(result).toEqual([['own', 'value']])
    })

    it('does not include symbol-keyed properties', () => {
        const sym = Symbol('test')
        const obj = { [sym]: 'hidden', visible: 1 }

        const result = entries(obj)

        expect(result).toEqual([['visible', 1]])
    })

    it('does not include non-enumerable properties', () => {
        const obj = { enumerable: 'yes' }
        Object.defineProperty(obj, 'hidden', { enumerable: false, value: 'no' })

        const result = entries(obj)

        expect(result).toEqual([['enumerable', 'yes']])
    })

    it('returns references to nested objects without flattening', () => {
        const nested = { deep: { deeper: 42 } }
        const obj = { child: nested }

        const result = entries(obj)

        expect(result).toEqual([['child', nested]])
        expect(result[0]![1]).toBe(nested)
    })
})
