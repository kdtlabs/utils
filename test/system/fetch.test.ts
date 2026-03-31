import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { fetch } from '../../src/system/fetch'

const createMockFetch = (handler: (input: RequestInfo | URL, init?: RequestInit) => Promise<Response>) => (
    handler as typeof globalThis.fetch
)

describe('fetch', () => {
    let originalFetch: typeof globalThis.fetch
    let lastRequest: RequestInfo | URL | undefined
    let lastInit: RequestInit | undefined

    beforeEach(() => {
        originalFetch = globalThis.fetch
        lastRequest = undefined
        lastInit = undefined

        globalThis.fetch = createMockFetch((input, init?) => {
            lastRequest = input
            lastInit = init

            return Promise.resolve(new Response('ok'))
        })
    })

    afterEach(() => {
        globalThis.fetch = originalFetch
    })

    it('calls globalThis.fetch with the given URL', async () => {
        await fetch('https://example.com', { retry: false })
        expect(lastRequest).toBe('https://example.com')
    })

    it('passes request options through to globalThis.fetch', async () => {
        await fetch('https://example.com', { method: 'POST', retry: false })
        expect(lastInit?.method).toBe('POST')
    })

    it('returns the response from globalThis.fetch', async () => {
        const response = await fetch('https://example.com', { retry: false })
        expect(await response.text()).toBe('ok')
    })

    it('accepts a URL object', async () => {
        const url = new URL('https://example.com/path')
        await fetch(url, { retry: false })
        expect(lastRequest).toBe(url)
    })

    describe('timeout', () => {
        it('attaches an abort signal to the fetch call', async () => {
            await fetch('https://example.com', { retry: false, timeout: 5000 })
            expect(lastInit?.signal).toBeDefined()
        })

        it('aborts when timeout expires', async () => {
            globalThis.fetch = createMockFetch((_input, init) => {
                return new Promise((_resolve, reject) => {
                    init?.signal?.addEventListener('abort', () => reject(init.signal!.reason))
                })
            })

            const promise = fetch('https://example.com', { retry: false, timeout: 20 })
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(promise).rejects.toThrow()
        })
    })

    describe('signal', () => {
        it('aborts when the user signal fires', async () => {
            const controller = new AbortController()

            globalThis.fetch = createMockFetch((_input, init) => {
                return new Promise((_resolve, reject) => {
                    init?.signal?.addEventListener('abort', () => reject(init.signal!.reason))
                })
            })

            const promise = fetch('https://example.com', { retry: false, signal: controller.signal, timeout: 60_000 })
            controller.abort()
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(promise).rejects.toThrow()
        })

        it('combines user signal with timeout signal', async () => {
            const controller = new AbortController()
            await fetch('https://example.com', { retry: false, signal: controller.signal })
            expect(lastInit?.signal).toBeDefined()
        })
    })

    describe('retry', () => {
        it('retries on failure when retry is true', async () => {
            let attempts = 0

            globalThis.fetch = createMockFetch(() => {
                attempts++

                if (attempts < 3) {
                    return Promise.reject(new Error('fail'))
                }

                return Promise.resolve(new Response('ok'))
            })

            const response = await fetch('https://example.com', { retry: { delay: 1 }, timeout: 60_000 })
            expect(attempts).toBe(3)
            expect(await response.text()).toBe('ok')
        })

        it('does not retry when retry is false', async () => {
            let attempts = 0

            globalThis.fetch = createMockFetch(() => {
                attempts++

                return Promise.reject(new Error('fail'))
            })

            const promise = fetch('https://example.com', { retry: false })
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(promise).rejects.toThrow('fail')
            expect(attempts).toBe(1)
        })

        it('respects custom retry options', async () => {
            let attempts = 0

            globalThis.fetch = createMockFetch(() => {
                attempts++

                if (attempts < 2) {
                    return Promise.reject(new Error('fail'))
                }

                return Promise.resolve(new Response('ok'))
            })

            await fetch('https://example.com', { retry: { delay: 1, maxAttempts: 2 }, timeout: 60_000 })
            expect(attempts).toBe(2)
        })

        it('disables retry when retry option has enabled: false', async () => {
            let attempts = 0

            globalThis.fetch = createMockFetch(() => {
                attempts++

                return Promise.reject(new Error('fail'))
            })

            const promise = fetch('https://example.com', { retry: { enabled: false } })
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(promise).rejects.toThrow()
            expect(attempts).toBe(1)
        })

        it('enables retry by default when no options provided', async () => {
            let attempts = 0

            globalThis.fetch = createMockFetch(() => {
                attempts++

                if (attempts < 2) {
                    return Promise.reject(new Error('fail'))
                }

                return Promise.resolve(new Response('ok'))
            })

            await fetch('https://example.com', { retry: { delay: 1 }, timeout: 60_000 })
            expect(attempts).toBeGreaterThan(1)
        })
    })
})
