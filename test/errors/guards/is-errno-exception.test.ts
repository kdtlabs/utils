import { describe, expect, it } from 'bun:test'
import { isErrnoException } from '../../../src/errors/guards'

describe('isErrnoException', () => {
    it('returns true for a Node.js ErrnoException', () => {
        const error = Object.assign(new Error('ENOENT'), {
            code: 'ENOENT',
            errno: -2,
            path: '/not/found',
            syscall: 'open',
        })

        expect(isErrnoException(error)).toBe(true)
    })

    it('returns true when only code and errno are present', () => {
        const error = Object.assign(new Error('fail'), {
            code: 'EACCES',
            errno: -13,
        })

        expect(isErrnoException(error)).toBe(true)
    })

    it('returns false for a plain Error', () => {
        expect(isErrnoException(new Error('plain'))).toBe(false)
    })

    it('returns false for a TypeError', () => {
        expect(isErrnoException(new TypeError('bad arg'))).toBe(false)
    })

    it('returns false for an Error with only code', () => {
        const error = Object.assign(new Error('partial'), { code: 'ENOENT' })

        expect(isErrnoException(error)).toBe(false)
    })

    it('returns false for an Error with only errno', () => {
        const error = Object.assign(new Error('partial'), { errno: -2 })

        expect(isErrnoException(error)).toBe(false)
    })

    it('returns false for a non-Error object with code and errno', () => {
        expect(isErrnoException({ code: 'ENOENT', errno: -2, message: 'fake' })).toBe(false)
    })

    it('returns false for null', () => {
        expect(isErrnoException(null)).toBe(false)
    })

    it('returns false for undefined', () => {
        expect(isErrnoException(undefined)).toBe(false)
    })

    it('returns false for a string', () => {
        expect(isErrnoException('ENOENT')).toBe(false)
    })

    it('returns false for a number', () => {
        expect(isErrnoException(-2)).toBe(false)
    })
})
