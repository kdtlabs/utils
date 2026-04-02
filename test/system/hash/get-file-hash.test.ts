import { mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { computeHash, getFileHash } from '../../../src/system/hash'

const tmpBase = join(tmpdir(), `test-file-hash-${randomStr(8)}`)

describe('getFileHash', () => {
    it('returns sha256 hash of file contents', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            const result = getFileHash(filePath, 'sha256')

            expect(result).toBe(computeHash('hello', 'sha256'))
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns md5 hash of file contents', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            const result = getFileHash(filePath, 'md5')

            expect(result).toBe(computeHash('hello', 'md5'))
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('throws for non-existent file', () => {
        expect(() => getFileHash('/non/existent/file', 'sha256')).toThrow()
    })
})
