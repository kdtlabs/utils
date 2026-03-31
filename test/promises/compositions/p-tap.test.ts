import { describe, expect, it } from 'bun:test'
import { pTap } from '@/promises/compositions'

describe('pTap', () => {
    it('returns the original value', async () => {
        const value = { id: 1 }

        const result = await pTap(() => {})(value)

        expect(result).toBe(value)
    })

    it('passes the value to the callback', async () => {
        let captured: unknown

        await pTap((value) => {
            captured = value
        })(42)

        expect(captured).toBe(42)
    })

    it('awaits an async callback before returning the value', async () => {
        const calls: string[] = []

        const result = await pTap(async (value: string) => {
            calls.push(`start:${value}`)
            await Promise.resolve()
            calls.push(`end:${value}`)
        })('ok')

        expect(result).toBe('ok')
        expect(calls).toEqual(['start:ok', 'end:ok'])
    })

    it('propagates a synchronous callback error', async () => {
        const promise = pTap(() => {
            throw new Error('tap failed')
        })('value')

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('tap failed')
    })

    it('propagates an async callback rejection', async () => {
        const promise = pTap(() => Promise.reject(new Error('async tap failed')))('value')

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('async tap failed')
    })
})

describe('pTap.catch', () => {
    it('calls the callback with the original error and rethrows that same error', async () => {
        const originalError = new Error('boom')
        let captured: unknown

        const promise = pTap.catch((error) => {
            captured = error
        })(originalError)

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toBe(originalError)
        expect(captured).toBe(originalError)
    })

    it('awaits an async callback before rethrowing the original error', async () => {
        const originalError = new Error('boom')
        const calls: string[] = []

        const promise = pTap.catch(async (error) => {
            calls.push(`start:${(error as Error).message}`)
            await Promise.resolve()
            calls.push(`end:${(error as Error).message}`)
        })(originalError)

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toBe(originalError)
        expect(calls).toEqual(['start:boom', 'end:boom'])
    })

    it('lets a synchronous callback error override the original error', async () => {
        const promise = pTap.catch(() => {
            throw new Error('side effect failed')
        })(new Error('original failure'))

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('side effect failed')
    })

    it('lets an async callback rejection override the original error', async () => {
        const promise = pTap.catch(() => {
            throw new Error('async side effect failed')
        })(
            new Error('original failure'),
        )

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('async side effect failed')
    })
})
