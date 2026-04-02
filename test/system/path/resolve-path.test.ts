import { homedir } from 'node:os'
import { join, resolve } from 'node:path'
import { describe, expect, it } from 'bun:test'
import { resolvePath } from '../../../src/system/path'

describe('resolvePath', () => {
    it('resolves ~/path to home directory', () => {
        expect(resolvePath('~/documents')).toBe(join(homedir(), 'documents'))
    })

    it('resolves ~/nested/path to home directory', () => {
        expect(resolvePath('~/a/b/c')).toBe(join(homedir(), 'a', 'b', 'c'))
    })

    it('resolves relative path against cwd', () => {
        expect(resolvePath('foo/bar')).toBe(resolve('foo/bar'))
    })

    it('returns absolute path as-is', () => {
        expect(resolvePath('/usr/local/bin')).toBe('/usr/local/bin')
    })

    it('does not expand ~ in the middle of a path', () => {
        expect(resolvePath('/some/~/path')).toBe(resolve('/some/~/path'))
    })

    it('resolves ~ alone to home directory', () => {
        expect(resolvePath('~/')).toBe(homedir())
    })
})
