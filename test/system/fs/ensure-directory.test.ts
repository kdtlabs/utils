import { existsSync, rmdirSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { randomStr } from '../../../src/strings'
import { ensureDirectory } from '../../../src/system/fs'

const tmpBase = join(tmpdir(), `test-ensure-${randomStr(8)}`)

describe('ensureDirectory', () => {
    it('creates a directory that does not exist', () => {
        const dir = join(tmpBase, 'new-dir')

        try {
            ensureDirectory(dir)

            expect(existsSync(dir)).toBe(true)
        } finally {
            rmdirSync(dir)
            rmdirSync(tmpBase)
        }
    })

    it('creates nested directories recursively', () => {
        const deep = join(tmpBase, 'a', 'b', 'c')

        try {
            ensureDirectory(deep)

            expect(existsSync(deep)).toBe(true)
        } finally {
            rmdirSync(join(tmpBase, 'a', 'b', 'c'))
            rmdirSync(join(tmpBase, 'a', 'b'))
            rmdirSync(join(tmpBase, 'a'))
            rmdirSync(tmpBase)
        }
    })

    it('does nothing when directory already exists', () => {
        const dir = join(tmpBase, 'existing')

        try {
            ensureDirectory(dir)
            ensureDirectory(dir)

            expect(existsSync(dir)).toBe(true)
        } finally {
            rmdirSync(dir)
            rmdirSync(tmpBase)
        }
    })

    it('passes options to mkdirSync', () => {
        const dir = join(tmpBase, 'with-mode')

        try {
            ensureDirectory(dir, { mode: 0o755 })

            expect(existsSync(dir)).toBe(true)
        } finally {
            rmdirSync(dir)
            rmdirSync(tmpBase)
        }
    })
})
