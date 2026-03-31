import { describe, expect, it } from 'bun:test'
import { partition } from '@/arrays/operations'

describe('partition', () => {
    it('splits array by predicate', () => {
        const [even, odd] = partition([1, 2, 3, 4, 5], (n) => n % 2 === 0)

        expect(even).toEqual([2, 4])
        expect(odd).toEqual([1, 3, 5])
    })

    it('returns [[], []] for empty array', () => {
        expect(partition([], (x: number) => x > 0)).toEqual([[], []])
    })

    it('all match — second array is empty', () => {
        expect(partition([1, 2, 3], () => true)).toEqual([[1, 2, 3], []])
    })

    it('none match — first array is empty', () => {
        expect(partition([1, 2, 3], () => false)).toEqual([[], [1, 2, 3]])
    })

    it('preserves order in both partitions', () => {
        const [pass, fail] = partition([5, 1, 4, 2, 3], (n) => n > 3)

        expect(pass).toEqual([5, 4])
        expect(fail).toEqual([1, 2, 3])
    })

    it('single element matching', () => {
        expect(partition([42], (n) => n === 42)).toEqual([[42], []])
    })

    it('single element not matching', () => {
        expect(partition([42], (n) => n === 0)).toEqual([[], [42]])
    })

    it('works with objects', () => {
        const items = [{ active: true, id: 1 }, { active: false, id: 2 }, { active: true, id: 3 }]
        const [active, inactive] = partition(items, (item) => item.active)

        expect(active).toEqual([{ active: true, id: 1 }, { active: true, id: 3 }])
        expect(inactive).toEqual([{ active: false, id: 2 }])
    })

    it('array with nullish elements', () => {
        const items = [null, undefined, null, 1, undefined]
        const [truthy, falsy] = partition(items, (x) => x != null)

        expect(truthy).toEqual([1])
        expect(falsy).toEqual([null, undefined, null, undefined])
    })

    it('large array does not crash', () => {
        const items = Array.from({ length: 100_000 }, (_, i) => i)
        const [even, odd] = partition(items, (n) => n % 2 === 0)

        expect(even.length).toBe(50_000)
        expect(odd.length).toBe(50_000)
    })
})
