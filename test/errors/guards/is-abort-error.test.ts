import { describe, expect, it } from 'bun:test'
import { isAbortError } from '../../../src/errors/guards'

describe('isAbortError', () => {
    it('returns true for AbortError DOMException', () => {
        expect(isAbortError(new DOMException('aborted', 'AbortError'))).toBe(true)
    })

    it('returns false for DOMException with different name', () => {
        expect(isAbortError(new DOMException('timeout', 'TimeoutError'))).toBe(false)
    })

    it('returns false for plain Error with AbortError name', () => {
        const err = new Error('x')
        err.name = 'AbortError'

        expect(isAbortError(err)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isAbortError('AbortError')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isAbortError(null)).toBe(false)
    })
})
