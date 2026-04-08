import { describe, expect, it } from 'bun:test'
import { keys } from '../../../src/objects/transformations'

describe('keys', () => {
    it('returns an empty array for an empty object', () => {
        expect(keys({})).toEqual([])
    })

    it('returns keys for an object with string keys', () => {
        expect(keys({ a: 1, b: 2 })).toEqual(['a', 'b'])
    })

    it('returns a single key for a single property object', () => {
        expect(keys({ only: 'one' })).toEqual(['only'])
    })

    it('handles mixed value types', () => {
        const obj = {
            arr: [1, 2, 3],
            bool: true,
            nested: { x: 1 },
            nil: null,
            num: 42,
            str: 'hello',
            undef: undefined,
        }

        expect(keys(obj)).toEqual(['arr', 'bool', 'nested', 'nil', 'num', 'str', 'undef'])
    })

    it('handles numeric string keys', () => {
        expect(keys({ '0': 'a', '1': 'b' })).toEqual(['0', '1'])
    })

    it('does not include inherited properties', () => {
        const proto = { inherited: true }
        const obj = Object.create(proto) as Record<string, unknown>
        obj.own = 'value'

        expect(keys(obj)).toEqual(['own'])
    })

    it('does not include symbol-keyed properties', () => {
        const sym = Symbol('test')
        const obj = { [sym]: 'hidden', visible: 1 }

        expect(keys(obj)).toEqual(['visible'])
    })

    it('does not include non-enumerable properties', () => {
        const obj = { enumerable: 'yes' }
        Object.defineProperty(obj, 'hidden', { enumerable: false, value: 'no' })

        expect(keys(obj)).toEqual(['enumerable'])
    })
})
