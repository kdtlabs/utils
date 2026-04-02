import { chmodSync, mkdirSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { isWritableDirectory } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-writable-${randomStr(8)}`)

describe('isWritableDirectory', () => {
    it('returns true for a writable directory', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            expect(isWritableDirectory(tmpBase)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns true for a non-existent path when parent is writable', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            const nonExistent = join(tmpBase, 'child')

            expect(isWritableDirectory(nonExistent)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns true for deeply non-existent path when ancestor is writable', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            const deep = join(tmpBase, 'a', 'b', 'c')

            expect(isWritableDirectory(deep)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-writable directory', () => {
        mkdirSync(tmpBase, { recursive: true })
        chmodSync(tmpBase, 0o444)

        try {
            expect(isWritableDirectory(tmpBase)).toBe(false)
        } finally {
            chmodSync(tmpBase, 0o755)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-existent path under non-writable parent', () => {
        mkdirSync(tmpBase, { recursive: true })
        chmodSync(tmpBase, 0o444)

        try {
            const nonExistent = join(tmpBase, 'child')

            expect(isWritableDirectory(nonExistent)).toBe(false)
        } finally {
            chmodSync(tmpBase, 0o755)
            rmdirSync(tmpBase)
        }
    })

    it('returns true for tmpdir', () => {
        expect(isWritableDirectory(tmpdir())).toBe(true)
    })
})
