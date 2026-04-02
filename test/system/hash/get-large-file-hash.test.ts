import { mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { computeHash, getLargeFileHash } from '../../../src/system/hash'

const tmpBase = join(tmpdir(), `test-large-hash-${randomStr(8)}`)

describe('getLargeFileHash', () => {
    it('returns sha256 hash of file contents', async () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            const result = await getLargeFileHash(filePath, 'sha256')

            expect(result).toBe(computeHash('hello', 'sha256'))
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns same hash as getFileHash for same file', async () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')
        const content = randomStr(1024)

        writeFileSync(filePath, content)

        try {
            const result = await getLargeFileHash(filePath, 'sha256')

            expect(result).toBe(computeHash(content, 'sha256'))
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('rejects for non-existent file', () => {
        expect(getLargeFileHash('/non/existent/file', 'sha256')).rejects.toThrow()
    })
})
