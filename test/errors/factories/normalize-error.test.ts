import { describe, expect, it } from 'bun:test'
import { normalizeError } from '../../../src/errors/factories'

describe('normalizeError', () => {
    it('returns Error instance as-is', () => {
        const original = new Error('x')

        expect(normalizeError(original)).toBe(original)
    })

    it('returns TypeError instance as-is', () => {
        const original = new TypeError('x')

        expect(normalizeError(original)).toBe(original)
    })

    it('wraps a string into Error', () => {
        const err = normalizeError('boom')

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('boom')
    })

    it('converts ErrorLike object to Error', () => {
        const err = normalizeError({ code: 'E01', message: 'fail', name: 'ApiError' })

        expect(err).toBeInstanceOf(Error)
        expect(err.name).toBe('ApiError')
        expect(err.message).toBe('fail')
        expect((err as any).code).toBe('E01')
    })

    it('wraps unknown value with default message', () => {
        const err = normalizeError(42)

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('Unknown error')
        expect(err.cause).toBe(42)
    })

    it('wraps null with default message', () => {
        const err = normalizeError(null)

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('Unknown error')
        expect(err.cause).toBeNull()
    })

    it('wraps undefined with default message', () => {
        const err = normalizeError(undefined)

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('Unknown error')
        expect(err.cause).toBeUndefined()
    })

    it('uses custom default message', () => {
        const err = normalizeError(42, { defaultMessage: 'Something went wrong' })

        expect(err.message).toBe('Something went wrong')
    })

    it('uses custom constructor', () => {
        const err = normalizeError('boom', { errorConstructor: TypeError })

        expect(err).toBeInstanceOf(TypeError)
    })

    it('returns instance of custom constructor as-is', () => {
        const original = new TypeError('x')
        const err = normalizeError(original, { errorConstructor: TypeError })

        expect(err).toBe(original)
    })

    it('does not return plain Error as-is when custom constructor is specified', () => {
        const original = new Error('x')
        const err = normalizeError(original, { errorConstructor: TypeError })

        expect(err).not.toBe(original)
        expect(err).toBeInstanceOf(TypeError)
    })
})
