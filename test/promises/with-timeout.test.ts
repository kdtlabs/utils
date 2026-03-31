import { describe, expect, it } from 'bun:test'
import { withTimeout } from '../../src/promises'

function createDeferredPromise<T>() {
    let resolvePromise!: (value: PromiseLike<T> | T) => void
    let rejectPromise!: (reason?: unknown) => void

    const promise = new Promise<T>((resolve, reject) => {
        resolvePromise = resolve
        rejectPromise = reject
    })

    return { promise, rejectPromise, resolvePromise }
}

describe('withTimeout', () => {
    it('resolves when the promise settles before the timeout', async () => {
        const result = await withTimeout(Promise.resolve('done'), 50)

        expect(result).toBe('done')
    })

    it('rejects with the default timeout error when the promise stays pending', async () => {
        const promise = withTimeout(new Promise<string>(() => {}), 20)

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)

            expect(error).toMatchObject({
                message: 'The operation was aborted due to a timeout',
                name: 'TimeoutError',
            })
        }
    })

    it('rejects with a custom string timeout error', async () => {
        const promise = withTimeout(new Promise<string>(() => {}), 20, { error: 'custom timeout' })

        try {
            await promise
        } catch (error) {
            expect(error).toMatchObject({ message: 'custom timeout' })
        }
    })

    it('rejects with a custom Error timeout error', async () => {
        const customError = new TypeError('custom timeout error')
        const promise = withTimeout(new Promise<string>(() => {}), 20, { error: customError })

        try {
            await promise
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('rejects with a custom factory timeout error', async () => {
        const customError = new RangeError('factory timeout error')
        const promise = withTimeout(new Promise<string>(() => {}), 20, { error: () => customError })

        try {
            await promise
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('propagates the original rejection when it happens before the timeout', async () => {
        const originalError = new Error('original rejection')

        try {
            await withTimeout(Promise.reject(originalError), 50)
        } catch (error) {
            expect(error).toBe(originalError)
        }
    })

    it('rejects immediately when the external signal is already aborted', async () => {
        const controller = new AbortController()
        const reason = new Error('already aborted externally')
        controller.abort(reason)

        try {
            await withTimeout(new Promise<string>(() => {}), 50, { signal: controller.signal })
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('rejects when the external signal aborts while pending', async () => {
        const controller = new AbortController()
        const reason = new Error('external abort')
        const promise = withTimeout(new Promise<string>(() => {}), 100, { signal: controller.signal })

        setTimeout(() => controller.abort(reason), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('resolves when the promise settles before either timeout or external abort', async () => {
        const controller = new AbortController()
        const deferred = createDeferredPromise<string>()
        const promise = withTimeout(deferred.promise, 100, { signal: controller.signal })

        setTimeout(() => deferred.resolvePromise('winner'), 10)
        setTimeout(() => controller.abort(new Error('late external abort')), 30)

        const result = await promise

        expect(result).toBe('winner')
    })

    it('uses the external abort reason when it fires before the timeout', async () => {
        const controller = new AbortController()
        const deferred = createDeferredPromise<string>()
        const reason = new Error('external wins')
        const promise = withTimeout(deferred.promise, 100, { error: 'timeout error', signal: controller.signal })

        setTimeout(() => controller.abort(reason), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('uses the timeout error when it fires before the external signal aborts', async () => {
        const controller = new AbortController()
        const deferred = createDeferredPromise<string>()
        const promise = withTimeout(deferred.promise, 20, { error: 'timeout wins', signal: controller.signal })

        setTimeout(() => controller.abort(new Error('external lost')), 50)

        try {
            await promise
        } catch (error) {
            expect(error).toMatchObject({ message: 'timeout wins' })
        }
    })

    it('lets a rejection beat a later timeout', async () => {
        const deferred = createDeferredPromise<string>()
        const originalError = new Error('reject first')
        const promise = withTimeout(deferred.promise, 100)

        setTimeout(() => deferred.rejectPromise(originalError), 10)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(originalError)
        }
    })

    it('lets a resolution beat a same-tick external abort once the promise microtask is queued first', async () => {
        const controller = new AbortController()
        const deferred = createDeferredPromise<string>()
        const promise = withTimeout(deferred.promise, 100, { signal: controller.signal })

        deferred.resolvePromise('resolved first')
        queueMicrotask(() => controller.abort(new Error('too late')))

        const result = await promise

        expect(result).toBe('resolved first')
    })
})
