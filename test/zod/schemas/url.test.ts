import { describe, expect, it } from 'bun:test'
import { z } from 'zod'
import { url } from '../../../src/zod/schemas'

describe('url', () => {
    describe('single protocol', () => {
        it('accepts http url for http protocol', () => {
            expect(z.safeParse(url('http'), 'http://example.com').success).toBe(true)
        })

        it('accepts https url for http protocol', () => {
            expect(z.safeParse(url('http'), 'https://example.com').success).toBe(true)
        })

        it('rejects ftp url for http protocol', () => {
            expect(z.safeParse(url('http'), 'ftp://example.com').success).toBe(false)
        })

        it('accepts ws url for ws protocol', () => {
            expect(z.safeParse(url('ws'), 'ws://example.com').success).toBe(true)
        })

        it('accepts wss url for ws protocol', () => {
            expect(z.safeParse(url('ws'), 'wss://example.com').success).toBe(true)
        })

        it('rejects http url for ws protocol', () => {
            expect(z.safeParse(url('ws'), 'http://example.com').success).toBe(false)
        })

        it('accepts file url for file protocol', () => {
            expect(z.safeParse(url('file'), 'file:///tmp/log.txt').success).toBe(true)
        })

        it('rejects http url for file protocol', () => {
            expect(z.safeParse(url('file'), 'http://example.com').success).toBe(false)
        })

        it('accepts ftp url for ftp protocol', () => {
            expect(z.safeParse(url('ftp'), 'ftp://files.example.com').success).toBe(true)
        })

        it('accepts ftps url for ftp protocol', () => {
            expect(z.safeParse(url('ftp'), 'ftps://files.example.com').success).toBe(true)
        })

        it('accepts ssh url for ssh protocol', () => {
            expect(z.safeParse(url('ssh'), 'ssh://host.example.com').success).toBe(true)
        })
    })

    describe('multiple protocols', () => {
        it('accepts http url for http + ws', () => {
            expect(z.safeParse(url('http', 'ws'), 'https://example.com').success).toBe(true)
        })

        it('accepts ws url for http + ws', () => {
            expect(z.safeParse(url('http', 'ws'), 'wss://example.com').success).toBe(true)
        })

        it('rejects ftp url for http + ws', () => {
            expect(z.safeParse(url('http', 'ws'), 'ftp://example.com').success).toBe(false)
        })
    })

    describe('array syntax', () => {
        it('accepts http url when passed as array', () => {
            expect(z.safeParse(url(['http', 'ws']), 'https://example.com').success).toBe(true)
        })

        it('accepts ws url when passed as array', () => {
            expect(z.safeParse(url(['http', 'ws']), 'wss://example.com').success).toBe(true)
        })

        it('rejects ftp url when passed as array', () => {
            expect(z.safeParse(url(['http', 'ws']), 'ftp://example.com').success).toBe(false)
        })
    })

    describe('mixed syntax', () => {
        it('accepts both rest and array protocols', () => {
            const schema = url('http', ['ws', 'ftp'])

            expect(z.safeParse(schema, 'https://example.com').success).toBe(true)
            expect(z.safeParse(schema, 'wss://example.com').success).toBe(true)
            expect(z.safeParse(schema, 'ftp://files.example.com').success).toBe(true)
            expect(z.safeParse(schema, 'ssh://host.example.com').success).toBe(false)
        })
    })

    describe('invalid inputs', () => {
        it('rejects non-url string', () => {
            expect(z.safeParse(url('http'), 'not a url').success).toBe(false)
        })

        it('rejects empty string', () => {
            expect(z.safeParse(url('http'), '').success).toBe(false)
        })
    })

    describe('pipe usage', () => {
        it('works with z.string().pipe()', () => {
            const schema = z.string().pipe(url('http'))

            expect(z.safeParse(schema, 'https://example.com').success).toBe(true)
            expect(z.safeParse(schema, 'ftp://example.com').success).toBe(false)
        })
    })
})
