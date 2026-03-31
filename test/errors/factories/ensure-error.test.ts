import { describe, expect, it } from 'bun:test'
import { ensureError } from '../../../src/errors/factories'

describe('ensureError', () => {
    it('wraps a string into Error', () => {
        const err = ensureError('boom')

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('boom')
    })

    it('wraps a string with custom constructor', () => {
        const err = ensureError('boom', TypeError)

        expect(err).toBeInstanceOf(TypeError)
        expect(err.message).toBe('boom')
    })

    it('returns an Error as-is', () => {
        const original = new Error('x')
        const err = ensureError(original)

        expect(err).toBe(original)
    })

    it('evaluates a function returning Error', () => {
        const original = new TypeError('x')
        const err = ensureError(() => original)

        expect(err).toBe(original)
    })

    it('evaluates a function returning string', () => {
        const err = ensureError(() => 'lazy')

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toBe('lazy')
    })

    it('evaluates a function returning string with custom constructor', () => {
        const err = ensureError(() => 'lazy', RangeError)

        expect(err).toBeInstanceOf(RangeError)
    })
})
