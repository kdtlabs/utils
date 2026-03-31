import { describe, expect, it } from 'bun:test'
import { isErrorLike } from '@/errors/guards'

describe('isErrorLike', () => {
    it('returns true for object with name string', () => {
        expect(isErrorLike({ name: 'Error' })).toBe(true)
    })

    it('returns true for object with name and message', () => {
        expect(isErrorLike({ message: 'bad type', name: 'TypeError' })).toBe(true)
    })

    it('returns true for object with name, message, and stack', () => {
        expect(isErrorLike({ message: 'x', name: 'Error', stack: 'at ...' })).toBe(true)
    })

    it('returns true for object with extra properties', () => {
        expect(isErrorLike({ code: 'ERR_001', foo: 42, name: 'Error' })).toBe(true)
    })

    it('returns false for object without name', () => {
        expect(isErrorLike({ message: 'x' })).toBe(false)
    })

    it('returns false for object with non-string name', () => {
        expect(isErrorLike({ name: 42 })).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isErrorLike('error')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isErrorLike(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isErrorLike(undefined)).toBe(false)
    })

    it('returns false for an array', () => {
        expect(isErrorLike([1, 2])).toBe(false)
    })
})
