import { mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { isFile } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-is-file-${randomStr(8)}`)

describe('isFile', () => {
    it('returns true for a file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            expect(isFile(filePath)).toBe(true)
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a directory', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            expect(isFile(tmpBase)).toBe(false)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-existent path', () => {
        expect(isFile('/non/existent/path')).toBe(false)
    })
})
