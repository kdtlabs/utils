import { describe, expect, it } from 'bun:test'
import { sleep } from '@/promises'

function createPendingAbort() {
    const controller = new AbortController()

    return { controller, signal: controller.signal }
}

describe('sleep', () => {
    it('resolves after the requested delay', async () => {
        const start = Date.now()

        await sleep(20)

        expect(Date.now() - start).toBeGreaterThanOrEqual(15)
    })

    it('rejects immediately when the signal is already aborted with the default abort error', async () => {
        const controller = new AbortController()
        controller.abort()

        try {
            await sleep(50, { signal: controller.signal })
            expect.unreachable('should have thrown')
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect((error as DOMException).name).toBe('AbortError')
        }
    })

    it('rejects immediately when the signal is already aborted with its abort reason', async () => {
        const controller = new AbortController()
        const reason = new Error('already aborted')
        controller.abort(reason)

        try {
            await sleep(50, { signal: controller.signal })
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('rejects immediately with a custom string error when the signal is already aborted', async () => {
        const controller = new AbortController()
        controller.abort('ignored reason')

        try {
            await sleep(50, { error: 'custom abort', signal: controller.signal })
        } catch (error) {
            expect(error).toMatchObject({ message: 'custom abort' })
        }
    })

    it('rejects immediately with a custom Error when the signal is already aborted', async () => {
        const controller = new AbortController()
        const customError = new TypeError('custom abort error')
        controller.abort()

        try {
            await sleep(50, { error: customError, signal: controller.signal })
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('rejects immediately with a custom factory error when the signal is already aborted', async () => {
        const controller = new AbortController()
        const customError = new RangeError('factory abort error')
        controller.abort()

        try {
            await sleep(50, { error: () => customError, signal: controller.signal })
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('rejects when aborted while pending', async () => {
        const { controller, signal } = createPendingAbort()
        const promise = sleep(100, { signal })

        setTimeout(() => controller.abort(), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect(error).toMatchObject({ name: 'AbortError' })
        }
    })

    it('rejects with the signal reason when aborted while pending', async () => {
        const { controller, signal } = createPendingAbort()
        const reason = new Error('pending abort reason')
        const promise = sleep(100, { signal })

        setTimeout(() => controller.abort(reason), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('rejects with a custom string error when aborted while pending', async () => {
        const { controller, signal } = createPendingAbort()
        const promise = sleep(100, { error: 'custom pending abort', signal })

        setTimeout(() => controller.abort(new Error('ignored')), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toMatchObject({ message: 'custom pending abort' })
        }
    })

    it('rejects with a custom Error when aborted while pending', async () => {
        const { controller, signal } = createPendingAbort()
        const customError = new Error('custom pending error')
        const promise = sleep(100, { error: customError, signal })

        setTimeout(() => controller.abort(), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('resolves when the sleep completes before abort', async () => {
        const controller = new AbortController()
        const promise = sleep(10, { signal: controller.signal })

        await promise

        controller.abort(new Error('late abort'))
    })
})
