import { describe, expect, it } from 'bun:test'
import { createTimeoutError } from '../../../src/errors/factories'

describe('createTimeoutError', () => {
    it('creates a DOMException with default timeout message', () => {
        const err = createTimeoutError()

        expect(err).toBeInstanceOf(DOMException)
        expect(err.message).toBe('The operation was aborted due to a timeout')
        expect(err.name).toBe('TimeoutError')
    })

    it('creates a DOMException with custom message', () => {
        const err = createTimeoutError('request timed out')

        expect(err.message).toBe('request timed out')
    })

    it('creates a DOMException with custom message and name', () => {
        const err = createTimeoutError('slow', 'CustomTimeout')

        expect(err.name).toBe('CustomTimeout')
    })
})
