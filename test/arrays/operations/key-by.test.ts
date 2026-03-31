import { describe, expect, it } from 'bun:test'
import { keyBy } from '../../../src/arrays/operations'

describe('keyBy', () => {
    it('creates lookup by key function', () => {
        const items = [{ id: 1, name: 'a' }, { id: 2, name: 'b' }]
        const result = keyBy(items, (item) => item.id)

        expect(result).toEqual({ 1: { id: 1, name: 'a' }, 2: { id: 2, name: 'b' } })
    })

    it('returns empty object for empty array', () => {
        expect(keyBy([], (x: { id: number }) => x.id)).toEqual({})
    })

    it('last item wins on duplicate keys', () => {
        const items = [{ id: 1, v: 'first' }, { id: 1, v: 'second' }]
        const result = keyBy(items, (item) => item.id)

        expect(result).toEqual({ 1: { id: 1, v: 'second' } })
    })

    it('works with string keys', () => {
        const items = [{ code: 'us', name: 'USA' }, { code: 'vn', name: 'Vietnam' }]
        const result = keyBy(items, (item) => item.code)

        expect(result).toEqual({ us: { code: 'us', name: 'USA' }, vn: { code: 'vn', name: 'Vietnam' } })
    })

    it('single item', () => {
        expect(keyBy([{ id: 42 }], (x) => x.id)).toEqual({ 42: { id: 42 } })
    })

    it('array with undefined values as items', () => {
        const items = [undefined, undefined]
        const result = keyBy(items, () => 'key')

        expect(result.key).toBeUndefined()
    })

    it('large array does not crash', () => {
        const items = Array.from({ length: 10_000 }, (_, i) => ({ id: i }))
        const result = keyBy(items, (x) => x.id)

        expect(result[0]).toEqual({ id: 0 })
        expect(result[9999]).toEqual({ id: 9999 })
    })
})
