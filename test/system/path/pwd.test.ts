import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'bun:test'
import { pwd } from '@/system/path'

const thisDir = dirname(fileURLToPath(import.meta.url))

describe('pwd', () => {
    it('returns the directory of the calling module when no paths given', () => {
        const result = pwd(import.meta)
        expect(result).toBe(thisDir)
    })

    it('joins a single relative path segment', () => {
        const result = pwd(import.meta, 'src')
        expect(result).toBe(join(thisDir, 'src'))
    })

    it('joins multiple path segments', () => {
        const result = pwd(import.meta, 'src', 'utils', 'index.ts')
        expect(result).toBe(join(thisDir, 'src', 'utils', 'index.ts'))
    })

    it('handles Buffer path segments', () => {
        const result = pwd(import.meta, Buffer.from('dist'))
        expect(result).toBe(join(thisDir, 'dist'))
    })

    it('handles a mix of string and Buffer path segments', () => {
        const result = pwd(import.meta, 'src', Buffer.from('lib'))
        expect(result).toBe(join(thisDir, 'src', 'lib'))
    })
})
