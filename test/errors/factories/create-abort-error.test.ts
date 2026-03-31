import { describe, expect, it } from 'bun:test'
import { createAbortError } from '@/errors/factories'

describe('createAbortError', () => {
    it('creates a DOMException with default message and name', () => {
        const err = createAbortError()

        expect(err).toBeInstanceOf(DOMException)
        expect(err.message).toBe('This operation was aborted')
        expect(err.name).toBe('AbortError')
    })

    it('creates a DOMException with custom message', () => {
        const err = createAbortError('cancelled')

        expect(err.message).toBe('cancelled')
        expect(err.name).toBe('AbortError')
    })

    it('creates a DOMException with custom message and name', () => {
        const err = createAbortError('timed out', 'TimeoutError')

        expect(err.message).toBe('timed out')
        expect(err.name).toBe('TimeoutError')
    })
})
