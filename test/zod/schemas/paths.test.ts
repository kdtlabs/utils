import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { afterAll, beforeAll, describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { directoryPath, filePath, readable, writable, writableDirectory } from '../../../src/zod/schemas'

const TEST_DIR = join(tmpdir(), 'kdtlabs-utils-zod-test')
const TEST_FILE = join(TEST_DIR, 'test-file.txt')
const NONEXISTENT_PATH = join(TEST_DIR, 'nonexistent')

beforeAll(() => {
    rmSync(TEST_DIR, { force: true, recursive: true })
    mkdirSync(TEST_DIR, { recursive: true })
    writeFileSync(TEST_FILE, 'test content')
})

afterAll(() => {
    rmSync(TEST_DIR, { force: true, recursive: true })
})

describe('filePath', () => {
    describe('valid paths', () => {
        it('accepts existing file', () => {
            expect(z.safeParse(filePath(), TEST_FILE).success).toBe(true)
        })
    })

    describe('invalid paths', () => {
        it('rejects nonexistent path', () => {
            expect(z.safeParse(filePath(), NONEXISTENT_PATH).success).toBe(false)
        })

        it('rejects directory path', () => {
            expect(z.safeParse(filePath(), TEST_DIR).success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(filePath(), NONEXISTENT_PATH)

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Path is not a file')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().min(1).pipe(filePath())

            expect(z.safeParse(schema, TEST_FILE).success).toBe(true)
            expect(z.safeParse(schema, NONEXISTENT_PATH).success).toBe(false)
        })
    })
})

describe('directoryPath', () => {
    describe('valid paths', () => {
        it('accepts existing directory', () => {
            expect(z.safeParse(directoryPath(), TEST_DIR).success).toBe(true)
        })
    })

    describe('invalid paths', () => {
        it('rejects nonexistent path', () => {
            expect(z.safeParse(directoryPath(), NONEXISTENT_PATH).success).toBe(false)
        })

        it('rejects file path', () => {
            expect(z.safeParse(directoryPath(), TEST_FILE).success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(directoryPath(), NONEXISTENT_PATH)

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Path is not a directory')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().pipe(directoryPath())

            expect(z.safeParse(schema, TEST_DIR).success).toBe(true)
            expect(z.safeParse(schema, NONEXISTENT_PATH).success).toBe(false)
        })
    })
})

describe('readable', () => {
    describe('valid paths', () => {
        it('accepts readable file', () => {
            expect(z.safeParse(readable(), TEST_FILE).success).toBe(true)
        })

        it('accepts readable directory', () => {
            expect(z.safeParse(readable(), TEST_DIR).success).toBe(true)
        })
    })

    describe('invalid paths', () => {
        it('rejects nonexistent path', () => {
            expect(z.safeParse(readable(), NONEXISTENT_PATH).success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(readable(), NONEXISTENT_PATH)

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Path is not readable')
            }
        })
    })
})

describe('writable', () => {
    describe('valid paths', () => {
        it('accepts writable file', () => {
            expect(z.safeParse(writable(), TEST_FILE).success).toBe(true)
        })

        it('accepts writable directory', () => {
            expect(z.safeParse(writable(), TEST_DIR).success).toBe(true)
        })
    })

    describe('invalid paths', () => {
        it('rejects nonexistent path', () => {
            expect(z.safeParse(writable(), NONEXISTENT_PATH).success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(writable(), NONEXISTENT_PATH)

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Path is not writable')
            }
        })
    })
})

describe('writableDirectory', () => {
    describe('valid paths', () => {
        it('accepts writable directory', () => {
            expect(z.safeParse(writableDirectory(), TEST_DIR).success).toBe(true)
        })

        it('accepts nonexistent path under writable parent', () => {
            expect(z.safeParse(writableDirectory(), join(TEST_DIR, 'new-subdir')).success).toBe(true)
        })
    })

    describe('invalid paths', () => {
        it('rejects deeply nested nonexistent path under unwritable root', () => {
            expect(z.safeParse(writableDirectory(), '/nonexistent/deep/nested/path').success).toBe(false)
        })
    })

    describe('error messages', () => {
        it('returns custom error message', () => {
            const result = z.safeParse(writableDirectory(), '/nonexistent/deep/nested/path')

            expect(result.success).toBe(false)

            if (!result.success) {
                expect(result.error.issues[0]?.message).toBe('Path is not a writable directory')
            }
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().min(1).pipe()', () => {
            const schema = z.string().min(1).pipe(writableDirectory())

            expect(z.safeParse(schema, TEST_DIR).success).toBe(true)
            expect(z.safeParse(schema, '/nonexistent/deep/nested/path').success).toBe(false)
        })
    })
})
