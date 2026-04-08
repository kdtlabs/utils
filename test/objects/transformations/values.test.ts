import { describe, expect, it } from 'bun:test'
import { values } from '../../../src/objects/transformations'

describe('values', () => {
    it('returns an empty array for an empty object', () => {
        expect(values({})).toEqual([])
    })

    it('returns values for an object with string keys', () => {
        expect(values({ a: 1, b: 2 })).toEqual([1, 2])
    })

    it('returns a single value for a single property object', () => {
        expect(values({ only: 'one' })).toEqual(['one'])
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

        const result = values(obj)

        expect(result).toEqual([arr, true, nested, null, 42, 'hello', undefined])
    })

    it('handles numeric string keys', () => {
        expect(values({ '0': 'a', '1': 'b' })).toEqual(['a', 'b'])
    })

    it('does not include inherited properties', () => {
        const proto = { inherited: true }
        const obj = Object.create(proto) as Record<string, unknown>
        obj.own = 'value'

        expect(values(obj)).toEqual(['value'])
    })

    it('does not include symbol-keyed properties', () => {
        const sym = Symbol('test')
        const obj = { [sym]: 'hidden', visible: 1 }

        expect(values(obj)).toEqual([1])
    })

    it('does not include non-enumerable properties', () => {
        const obj = { enumerable: 'yes' }
        Object.defineProperty(obj, 'hidden', { enumerable: false, value: 'no' })

        expect(values(obj)).toEqual(['yes'])
    })

    it('returns references to nested objects without copying', () => {
        const nested = { deep: { deeper: 42 } }
        const obj = { child: nested }

        const result = values(obj)

        expect(result).toEqual([nested])
        expect(result[0]).toBe(nested)
    })
})
