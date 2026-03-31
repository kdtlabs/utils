import { describe, expect, it } from 'bun:test'
import { chunkStr } from '../../../src/strings/manipulations'

describe('chunkStr', () => {
    it('chunks string into equal parts', () => {
        expect([...chunkStr('abcdef', 2)]).toEqual(['ab', 'cd', 'ef'])
    })

    it('handles last chunk smaller than size', () => {
        expect([...chunkStr('abcde', 2)]).toEqual(['ab', 'cd', 'e'])
    })

    it('handles size equal to string length', () => {
        expect([...chunkStr('abc', 3)]).toEqual(['abc'])
    })

    it('handles size larger than string length', () => {
        expect([...chunkStr('ab', 5)]).toEqual(['ab'])
    })

    it('handles empty string', () => {
        expect([...chunkStr('', 3)]).toEqual([])
    })

    it('handles size of 1', () => {
        expect([...chunkStr('abc', 1)]).toEqual(['a', 'b', 'c'])
    })

    it('is a generator (lazy evaluation)', () => {
        const gen = chunkStr('abcdef', 2)

        expect(gen.next().value).toBe('ab')
        expect(gen.next().value).toBe('cd')
    })

    it('throws RangeError when size is 0', () => {
        expect(() => [...chunkStr('abc', 0)]).toThrow(RangeError)
    })

    it('throws RangeError when size is negative', () => {
        expect(() => [...chunkStr('abc', -1)]).toThrow(RangeError)
    })
})
