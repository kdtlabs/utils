import { describe, expect, it } from 'bun:test'
import { map } from '../../../src/objects/transformations'

describe('map', () => {
    it('transforms both keys and values', () => {
        const result = map({ a: 1, b: 2, c: 3 }, (k, v) => [k.toUpperCase(), v * 2])

        expect(result).toEqual({ A: 2, B: 4, C: 6 })
    })

    it('transforms only keys', () => {
        const result = map({ x: 10, y: 20 }, (k, v) => [`key_${k}`, v])

        expect(result).toEqual({ key_x: 10, key_y: 20 })
    })

    it('transforms only values', () => {
        const result = map({ a: 1, b: 2 }, (k, v) => [k, v + 100])

        expect(result).toEqual({ a: 101, b: 102 })
    })

    it('returns identical structure with identity transform', () => {
        const result = map({ baz: 'qux', foo: 'bar' }, (k, v) => [k, v])

        expect(result).toEqual({ baz: 'qux', foo: 'bar' })
    })

    it('returns empty object for empty input', () => {
        const result = map({}, (k, v) => [k, v])

        expect(result).toEqual({})
    })

    it('handles single property object', () => {
        const result = map({ only: 42 }, (k, v) => [`${k}!`, v * 10])

        expect(result).toEqual({ 'only!': 420 })
    })

    it('passes correct key, value, and index to callback', () => {
        const keys: string[] = []
        const values: number[] = []
        const indices: number[] = []

        map({ a: 1, b: 2, c: 3 }, (k, v, i) => {
            keys.push(k as string)
            values.push(v)
            indices.push(i)

            return [k, v]
        })

        expect(keys).toEqual(['a', 'b', 'c'])
        expect(values).toEqual([1, 2, 3])
        expect(indices).toEqual([0, 1, 2])
    })

    it('maps to completely different key names', () => {
        const result = map({ firstName: 'John', lastName: 'Doe' }, (_k, v) => [v, true])

        expect(result).toEqual({ Doe: true, John: true })
    })

    it('maps values to different types', () => {
        const result = map({ a: 1, b: 2, c: 3 }, (k, v) => [k, `value_${String(v)}`])

        expect(result).toEqual({ a: 'value_1', b: 'value_2', c: 'value_3' })
    })

    it('uses last entry when duplicate keys are produced', () => {
        const result = map({ a: 1, b: 2, c: 3 }, (_k, v) => ['same', v])

        expect(result).toEqual({ same: 3 })
    })

    it('handles object with many properties', () => {
        const input: Record<string, number> = {}
        const expected: Record<string, number> = {}

        for (let i = 0; i < 100; i++) {
            input[`k${i}`] = i
            expected[`K${i}`] = i * i
        }

        const result = map(input, (k, v) => [(k).toUpperCase(), v * v])

        expect(result).toEqual(expected)
    })

    it('preserves value references for objects and arrays', () => {
        const obj = { nested: 'data' }
        const arr = [1, 2, 3]
        const input = { a: obj, b: arr }

        const result = map(input, (k, v) => [k, v])

        expect(result.a).toBe(obj)
        expect(result.b).toBe(arr)
    })
})
