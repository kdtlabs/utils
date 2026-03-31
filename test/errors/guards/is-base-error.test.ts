import { describe, expect, it } from 'bun:test'
import { BaseError } from '../../../src/errors/base-error'
import { isBaseError } from '../../../src/errors/guards'

describe('isBaseError', () => {
    it('returns true for BaseError', () => {
        expect(isBaseError(new BaseError('x'))).toBe(true)
    })

    it('returns true for BaseError subclass', () => {
        class HttpError extends BaseError {}

        expect(isBaseError(new HttpError('x'))).toBe(true)
    })

    it('returns false for plain Error', () => {
        expect(isBaseError(new Error('x'))).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isBaseError('error')).toBe(false)
    })

    it('returns false for null', () => {
        expect(isBaseError(null)).toBe(false)
    })
})
