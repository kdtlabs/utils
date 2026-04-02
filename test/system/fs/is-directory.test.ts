import { mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { isDirectory } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-is-dir-${randomStr(8)}`)

describe('isDirectory', () => {
    it('returns true for a directory', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            expect(isDirectory(tmpBase)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            expect(isDirectory(filePath)).toBe(false)
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-existent path', () => {
        expect(isDirectory('/non/existent/path')).toBe(false)
    })

    it('returns true for tmpdir', () => {
        expect(isDirectory(tmpdir())).toBe(true)
    })
})
