import { describe, expect, it } from 'bun:test'
import { isMissingDirectoryError } from '../../../src/errors/guards'

describe('isMissingDirectoryError', () => {
    it('returns true when code is ENOENT', () => {
        const error = Object.assign(new Error('no such file or directory'), {
            code: 'ENOENT',
            errno: -2,
            path: '/missing/dir/file.txt',
            syscall: 'open',
        })

        expect(isMissingDirectoryError(error)).toBe(true)
    })

    it('returns false when code is EACCES', () => {
        const error = Object.assign(new Error('permission denied'), {
            code: 'EACCES',
            errno: -13,
            syscall: 'open',
        })

        expect(isMissingDirectoryError(error)).toBe(false)
    })

    it('returns false when code is EEXIST', () => {
        const error = Object.assign(new Error('file already exists'), {
            code: 'EEXIST',
            errno: -17,
            syscall: 'mkdir',
        })

        expect(isMissingDirectoryError(error)).toBe(false)
    })

    it('returns false when code is undefined', () => {
        const error = Object.assign(new Error('unknown'), {
            errno: -1,
        }) as NodeJS.ErrnoException

        expect(isMissingDirectoryError(error)).toBe(false)
    })
})
