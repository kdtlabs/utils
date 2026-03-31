import { describe, expect, it } from 'bun:test'
import { tryCatchAsync } from '@/promises/compositions'

describe('tryCatchAsync', () => {
    it('returns the result when fn succeeds synchronously', async () => {
        let fallbackCalled = false

        const result = await tryCatchAsync(
            () => 42,
            () => {
                fallbackCalled = true

                return 0
            },
        )

        expect(result).toBe(42)
        expect(fallbackCalled).toBe(false)
    })

    it('returns the result when fn succeeds asynchronously', async () => {
        let fallbackCalled = false

        const result = await tryCatchAsync(
            () => Promise.resolve('done'),
            () => {
                fallbackCalled = true

                return Promise.resolve('fallback')
            },
        )

        expect(result).toBe('done')
        expect(fallbackCalled).toBe(false)
    })

    it('calls fallback with a synchronous thrown error', async () => {
        const error = new Error('sync boom')
        let captured: unknown

        const result = await tryCatchAsync(
            () => {
                throw error
            },
            (receivedError) => {
                captured = receivedError

                return 'recovered'
            },
        )

        expect(result).toBe('recovered')
        expect(captured).toBe(error)
    })

    it('calls fallback with an async rejection', async () => {
        const error = new Error('async boom')
        let captured: unknown

        const result = await tryCatchAsync(
            () => Promise.reject(error),
            (receivedError) => {
                captured = receivedError

                return Promise.resolve('recovered async')
            },
        )

        expect(result).toBe('recovered async')
        expect(captured).toBe(error)
    })

    it('returns an async fallback result', async () => {
        const result = await tryCatchAsync(
            () => {
                throw new Error('boom')
            },
            async (error) => {
                await Promise.resolve()

                return (error as Error).message
            },
        )

        expect(result).toBe('boom')
    })

    it('propagates a fallback throw', async () => {
        const promise = tryCatchAsync(
            () => {
                throw new Error('original failure')
            },
            () => {
                throw new Error('fallback failed')
            },
        )

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('fallback failed')
    })

    it('propagates a fallback rejection', async () => {
        const promise = tryCatchAsync(
            () => Promise.reject(new Error('original failure')),
            () => Promise.reject(new Error('async fallback failed')),
        )

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('async fallback failed')
    })
})
