import { describe, expect, it } from 'bun:test'
import { createAbortController } from '../../../src/errors/factories'

describe('createAbortController', () => {
    it('returns an AbortController without timeout', () => {
        const controller = createAbortController()

        expect(controller).toBeInstanceOf(AbortController)
        expect(controller.signal.aborted).toBe(false)
    })

    it('does not auto-abort when timeout is 0', () => {
        const controller = createAbortController(0)

        expect(controller.signal.aborted).toBe(false)
    })

    it('does not auto-abort when timeout is negative', () => {
        const controller = createAbortController(-1)

        expect(controller.signal.aborted).toBe(false)
    })

    it('does not auto-abort when timeout exceeds MAX_SAFE_INTEGER', () => {
        const controller = createAbortController(Number.MAX_SAFE_INTEGER + 1)

        expect(controller.signal.aborted).toBe(false)
    })

    it('aborts after timeout with default error', async () => {
        const controller = createAbortController(10)

        await new Promise((resolve) => {
            controller.signal.addEventListener('abort', resolve)
        })

        expect(controller.signal.aborted).toBe(true)
        expect(controller.signal.reason).toBeInstanceOf(DOMException)
    })

    it('aborts with custom error string', async () => {
        const controller = createAbortController(10, 'custom abort')

        await new Promise((resolve) => {
            controller.signal.addEventListener('abort', resolve)
        })

        expect(controller.signal.reason).toBeInstanceOf(Error)
        expect(controller.signal.reason.message).toBe('custom abort')
    })

    it('aborts with custom error function', async () => {
        const controller = createAbortController(10, () => 'lazy error')

        await new Promise((resolve) => {
            controller.signal.addEventListener('abort', resolve)
        })

        expect(controller.signal.reason).toBeInstanceOf(Error)
        expect(controller.signal.reason.message).toBe('lazy error')
    })

    it('cleans up timeout when manually aborted', () => {
        const controller = createAbortController(60_000)

        controller.abort()

        expect(controller.signal.aborted).toBe(true)
    })
})
