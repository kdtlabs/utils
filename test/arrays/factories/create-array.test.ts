import { describe, expect, it } from 'bun:test'
import { createArray } from '@/arrays/factories'

describe('createArray', () => {
    it('creates array of given length using value function', () => {
        expect(createArray(3, (i) => i)).toEqual([0, 1, 2])
    })

    it('creates array with transformed values', () => {
        expect(createArray(3, (i) => i * 2)).toEqual([0, 2, 4])
    })

    it('creates array of objects', () => {
        expect(createArray(2, (i) => ({ id: i }))).toEqual([{ id: 0 }, { id: 1 }])
    })

    it('creates empty array when length is 0', () => {
        expect(createArray(0, (i) => i)).toEqual([])
    })

    it('single element', () => {
        expect(createArray(1, () => 'x')).toEqual(['x'])
    })

    it('negative length returns empty array', () => {
        expect(createArray(-1, (i) => i) as number[]).toEqual([])
    })

    it('value function returning undefined', () => {
        expect(createArray(3, () => {})).toEqual([undefined, undefined, undefined])
    })

    it('value function returning null', () => {
        expect(createArray(3, () => null)).toEqual([null, null, null])
    })

    it('large length has correct length', () => {
        const result = createArray(1000, (i) => i)
        expect(result.length).toBe(1000)
        expect(result[0]).toBe(0)
        expect(result[999]).toBe(999)
    })
})
