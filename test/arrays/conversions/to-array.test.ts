import { describe, expect, it } from 'bun:test'
import { toArray } from '../../../src/arrays/conversions'

function * gen() {
    yield 1
    yield 2
    yield 3
}

describe('toArray', () => {
    it('converts iterable (Set) to array', () => {
        expect(toArray(new Set([1, 2, 3]))).toEqual([1, 2, 3])
    })

    it('converts iterable (Map values) to array', () => {
        const map = new Map([['a', 1], ['b', 2]])

        expect(toArray(map)).toEqual([['a', 1], ['b', 2]])
    })

    it('wraps a single value in an array', () => {
        expect(toArray(5)).toEqual([5])
    })

    it('returns array as-is for array input', () => {
        expect(toArray([1, 2])).toEqual([1, 2])
    })

    it('returns empty array for null', () => {
        expect(toArray(null)).toEqual([])
    })

    it('returns empty array for undefined', () => {
        expect(toArray()).toEqual([])
    })

    it('returns empty array when called with no args', () => {
        expect(toArray()).toEqual([])
    })

    it('wraps string as single element (isIterable excludes primitives)', () => {
        expect(toArray('abc')).toEqual(['abc'])
    })

    it('converts generator output to array', () => {
        expect(toArray(gen())).toEqual([1, 2, 3])
    })

    it('converts empty Set to empty array', () => {
        expect(toArray(new Set())).toEqual([])
    })

    it('converts empty Map to empty array', () => {
        expect(toArray(new Map())).toEqual([])
    })

    it('preserves nullish elements inside an array', () => {
        expect(toArray([1, null, undefined, 2])).toEqual([1, null, undefined, 2])
    })
})
