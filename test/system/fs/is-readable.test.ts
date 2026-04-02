import { chmodSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { isReadable } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-readable-${randomStr(8)}`)

describe('isReadable', () => {
    it('returns true for a readable file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            expect(isReadable(filePath)).toBe(true)
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns true for a readable directory', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            expect(isReadable(tmpBase)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-readable file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'secret.txt')

        writeFileSync(filePath, 'secret')
        chmodSync(filePath, 0o000)

        try {
            expect(isReadable(filePath)).toBe(false)
        } finally {
            chmodSync(filePath, 0o644)
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-existent path', () => {
        expect(isReadable('/non/existent/path')).toBe(false)
    })

    it('returns true for tmpdir', () => {
        expect(isReadable(tmpdir())).toBe(true)
    })
})
