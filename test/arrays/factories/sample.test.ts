import { describe, expect, it } from 'bun:test'
import { sample } from '@/arrays/factories'

describe('sample', () => {
    it('returns 1 element by default', () => {
        expect(sample([1, 2, 3]).length).toBe(1)
    })

    it('returns requested quantity', () => {
        expect(sample([1, 2, 3, 4, 5], 3).length).toBe(3)
    })

    it('all sampled elements come from the source array', () => {
        const source = [10, 20, 30, 40, 50]
        const result = sample(source, 10)

        expect(result.every((v) => source.includes(v!))).toBe(true)
    })

    it('returns empty array when quantity is 0', () => {
        expect(sample([1, 2, 3], 0)).toEqual([])
    })

    it('eventually picks different elements', () => {
        const source = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
        const results = Array.from({ length: 30 }, () => sample(source, 1)[0])
        const uniqueResults = new Set(results)

        expect(uniqueResults.size).toBeGreaterThan(1)
    })

    it('sample from empty array returns array of undefined', () => {
        const result = sample([], 3)
        expect(result).toHaveLength(3)
        expect(result.every((v) => v === undefined)).toBe(true)
    })

    it('sample with quantity larger than array length returns duplicates', () => {
        const result = sample([1, 2], 10)
        expect(result).toHaveLength(10)
        expect(result.every((v) => v === 1 || v === 2)).toBe(true)
    })

    it('sample from single element array always returns that element', () => {
        const result = sample([42], 5)
        expect(result).toHaveLength(5)
        expect(result.every((v) => v === 42)).toBe(true)
    })

    it('sample with negative quantity returns empty array', () => {
        expect(sample([1, 2, 3], -5)).toEqual([])
    })

    it('sample from array with nullish elements can return nullish values', () => {
        const source = [null, undefined, 0, false, '']
        const result = sample(source, 20)
        expect(result).toHaveLength(20)
        expect(result.every((v) => source.includes(v as null))).toBe(true)
    })

    it('all sampled indices are within valid array bounds', () => {
        const source = [10, 20, 30]
        const results = Array.from({ length: 1000 }, () => sample(source, 1)[0])

        expect(results.every((v) => v === 10 || v === 20 || v === 30)).toBe(true)
    })

    it('can reach every index in the array', () => {
        const source = [0, 1, 2, 3, 4]
        const seen = new Set<number | undefined>()

        for (let i = 0; i < 1000; i++) {
            seen.add(sample(source, 1)[0])
        }

        for (const item of source) {
            expect(seen.has(item)).toBe(true)
        }
    })
})
