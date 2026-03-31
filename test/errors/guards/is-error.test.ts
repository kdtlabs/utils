import { describe, expect, it } from 'bun:test'
import { BaseError } from '@/errors/base-error'
import { isError } from '@/errors/guards'

describe('isError', () => {
    it('returns true for Error', () => {
        expect(isError(new Error('x'))).toBe(true)
    })

    it('returns true for TypeError', () => {
        expect(isError(new TypeError('x'))).toBe(true)
    })

    it('returns true for BaseError', () => {
        expect(isError(new BaseError('x'))).toBe(true)
    })

    it('returns false for a string', () => {
        expect(isError('error')).toBe(false)
    })

    it('returns false for an error-like object', () => {
        expect(isError({ message: 'x', name: 'Error' })).toBe(false)
    })

    it('returns false for null', () => {
        expect(isError(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isError(undefined)).toBe(false)
    })
})
