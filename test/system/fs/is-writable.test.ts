import { chmodSync, mkdirSync, rmdirSync, unlinkSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { isWritable } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-writable-${randomStr(8)}`)

describe('isWritable', () => {
    it('returns true for a writable file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'file.txt')

        writeFileSync(filePath, 'hello')

        try {
            expect(isWritable(filePath)).toBe(true)
        } finally {
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns true for a writable directory', () => {
        mkdirSync(tmpBase, { recursive: true })

        try {
            expect(isWritable(tmpBase)).toBe(true)
        } finally {
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-writable file', () => {
        mkdirSync(tmpBase, { recursive: true })

        const filePath = join(tmpBase, 'readonly.txt')

        writeFileSync(filePath, 'data')
        chmodSync(filePath, 0o444)

        try {
            expect(isWritable(filePath)).toBe(false)
        } finally {
            chmodSync(filePath, 0o644)
            unlinkSync(filePath)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-writable directory', () => {
        mkdirSync(tmpBase, { recursive: true })
        chmodSync(tmpBase, 0o444)

        try {
            expect(isWritable(tmpBase)).toBe(false)
        } finally {
            chmodSync(tmpBase, 0o755)
            rmdirSync(tmpBase)
        }
    })

    it('returns false for a non-existent path', () => {
        expect(isWritable('/non/existent/path')).toBe(false)
    })

    it('returns true for tmpdir', () => {
        expect(isWritable(tmpdir())).toBe(true)
    })
})
