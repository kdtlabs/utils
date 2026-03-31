import { describe, expect, it } from 'bun:test'
import { abortable } from '@/promises'

describe('abortable', () => {
    it('returns the original promise when no signal is provided', async () => {
        const original = Promise.resolve(42)
        const result = abortable(original)

        expect(result).toBe(original)
        expect(await result).toBe(42)
    })

    it('returns the original promise when signal is undefined', () => {
        const original = Promise.resolve('hello')
        const result = abortable(original)

        expect(result).toBe(original)
    })

    it('propagates the original rejection when no signal is provided', async () => {
        const originalError = new Error('original rejection')
        const original = Promise.reject(originalError)
        const result = abortable(original)

        expect(result).toBe(original)
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(result).rejects.toBe(originalError)
    })

    it('resolves with value when promise resolves before abort', async () => {
        const controller = new AbortController()
        const result = await abortable(Promise.resolve('value'), controller.signal)

        expect(result).toBe('value')
    })

    it('rejects with abort error when signal is already aborted', async () => {
        const controller = new AbortController()
        controller.abort()

        const promise = abortable(Promise.resolve('ignored'), controller.signal)

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow()

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect((error as DOMException).name).toBe('AbortError')
        }
    })

    it('rejects with abort error when signal aborts while pending', async () => {
        const controller = new AbortController()
        const pending = new Promise<string>(() => {})

        const promise = abortable(pending, controller.signal)
        controller.abort()

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow()

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect((error as DOMException).name).toBe('AbortError')
        }
    })

    it('rejects with custom string error when signal is already aborted', async () => {
        const controller = new AbortController()
        controller.abort()

        const promise = abortable(Promise.resolve('ignored'), controller.signal, 'custom abort')

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow('custom abort')

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect((error as Error).message).toBe('custom abort')
        }
    })

    it('rejects with custom Error when signal aborts while pending', async () => {
        const controller = new AbortController()
        const pending = new Promise<string>(() => {})
        const customError = new TypeError('custom type error')

        const promise = abortable(pending, controller.signal, customError)
        controller.abort()

        try {
            await promise
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('rejects with custom function errorable', async () => {
        const controller = new AbortController()
        controller.abort()
        const customError = new RangeError('from factory')

        const promise = abortable(Promise.resolve('ignored'), controller.signal, () => customError)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(customError)
        }
    })

    it('rejects with custom function errorable returning a string', async () => {
        const controller = new AbortController()
        controller.abort()

        const promise = abortable(Promise.resolve('ignored'), controller.signal, () => 'factory string')

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(Error)
            expect((error as Error).message).toBe('factory string')
        }
    })

    it('uses signal.reason when available and no custom error', async () => {
        const controller = new AbortController()
        const reason = new Error('specific reason')
        controller.abort(reason)

        const promise = abortable(Promise.resolve('ignored'), controller.signal)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(reason)
        }
    })

    it('uses signal.reason (non-Error) when no custom error', async () => {
        const controller = new AbortController()
        controller.abort('string reason')

        const promise = abortable(Promise.resolve('ignored'), controller.signal)

        try {
            await promise
        } catch (error) {
            expect(error).toBe('string reason')
        }
    })

    it('prefers custom error over signal.reason', async () => {
        const controller = new AbortController()
        const reason = new Error('reason')
        const custom = new Error('custom')
        controller.abort(reason)

        const promise = abortable(Promise.resolve('ignored'), controller.signal, custom)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(custom)
        }
    })

    it('rejects with promise error when promise rejects before abort', async () => {
        const controller = new AbortController()
        const promiseError = new Error('promise failed')

        const result = abortable(Promise.reject(promiseError), controller.signal)

        try {
            await result
        } catch (error) {
            expect(error).toBe(promiseError)
        }
    })

    it('resolves when promise resolves then signal aborts (race: resolve first)', async () => {
        const controller = new AbortController()

        const result = await abortable(Promise.resolve('winner'), controller.signal)
        controller.abort()

        expect(result).toBe('winner')
    })

    it('rejects with promise error when promise rejects then signal aborts (race: reject first)', async () => {
        const controller = new AbortController()
        const promiseError = new Error('original error')

        const promise = abortable(Promise.reject(promiseError), controller.signal)

        try {
            await promise
        } catch (error) {
            expect(error).toBe(promiseError)
            controller.abort()
        }
    })

    it('abort wins when signal aborts and promise resolves at same tick (sync event beats microtask)', async () => {
        const controller = new AbortController()
        let resolvePromise!: (value: string) => void

        const pending = new Promise<string>((resolve) => {
            resolvePromise = resolve
        })

        const promise = abortable(pending, controller.signal)

        resolvePromise('resolved')
        controller.abort()

        // eslint-disable-next-line @typescript-eslint/await-thenable
        await expect(promise).rejects.toThrow()
    })

    it('abort wins when signal aborts and promise rejects at same tick (sync event beats microtask)', async () => {
        const controller = new AbortController()
        let rejectPromise!: (reason: Error) => void

        const pending = new Promise<string>((_resolve, reject) => {
            rejectPromise = reject
        })

        const promise = abortable(pending, controller.signal)

        rejectPromise(new Error('promise error'))
        controller.abort()

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect((error as DOMException).name).toBe('AbortError')
        }
    })

    it('removes abort listener after promise resolves', async () => {
        const controller = new AbortController()
        const signal = controller.signal as AbortSignal & { listeners?: (event: string) => unknown[] }
        const listenerCountBefore = signal.listeners?.('abort')?.length ?? 0

        await abortable(Promise.resolve('done'), controller.signal)

        const listenerCountAfter = signal.listeners?.('abort')?.length ?? 0
        expect(listenerCountAfter).toBe(listenerCountBefore)
    })

    it('removes abort listener after promise rejects', async () => {
        const controller = new AbortController()
        const signal = controller.signal as AbortSignal & { listeners?: (event: string) => unknown[] }
        const listenerCountBefore = signal.listeners?.('abort')?.length ?? 0

        try {
            await abortable(Promise.reject(new Error('fail')), controller.signal)
        } catch {
            // expected
        }

        const listenerCountAfter = signal.listeners?.('abort')?.length ?? 0
        expect(listenerCountAfter).toBe(listenerCountBefore)
    })

    it('removes abort listener after signal aborts', async () => {
        const controller = new AbortController()
        const pending = new Promise<string>(() => {})

        const promise = abortable(pending, controller.signal)
        controller.abort()

        try {
            await promise
        } catch {
            // expected
        }

        const signal = controller.signal as AbortSignal & { listeners?: (event: string) => unknown[] }
        const listenerCountAfter = signal.listeners?.('abort')?.length ?? 0
        expect(listenerCountAfter).toBe(0)
    })

    it('cleanup is idempotent — second abort after resolve does not reject', async () => {
        const controller = new AbortController()
        let resolvePromise!: (value: number) => void

        const pending = new Promise<number>((resolve) => {
            resolvePromise = resolve
        })

        const promise = abortable(pending, controller.signal)
        resolvePromise(99)

        const result = await promise
        expect(result).toBe(99)

        controller.abort()
        expect(result).toBe(99)
    })

    it('cleanup is idempotent — second settlement from promise after abort does nothing', async () => {
        const controller = new AbortController()
        let resolvePromise!: (value: string) => void

        const pending = new Promise<string>((resolve) => {
            resolvePromise = resolve
        })

        const promise = abortable(pending, controller.signal)
        controller.abort()

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
        }

        resolvePromise('late')
    })

    it('works with PromiseLike (thenable) wrapped in Promise.resolve', async () => {
        const controller = new AbortController()

        const thenable = {
            // eslint-disable-next-line unicorn/no-thenable
            then<TResult1 = number>(onFulfilled?: ((value: number) => PromiseLike<TResult1> | TResult1) | null) {
                if (onFulfilled) {
                    return Promise.resolve(onFulfilled(777))
                }

                return Promise.resolve(777 as unknown as TResult1)
            },
        }

        const result = await abortable(Promise.resolve(thenable), controller.signal)

        expect(result).toBe(777)
    })

    it('falls back to createAbortError when signal.reason is undefined', async () => {
        const controller = new AbortController()
        const pending = new Promise<string>(() => {})
        const promise = abortable(pending, controller.signal)

        Object.defineProperty(controller.signal, 'reason', { value: undefined })
        controller.abort()

        try {
            await promise
        } catch (error) {
            expect(error).toBeInstanceOf(DOMException)
            expect((error as DOMException).name).toBe('AbortError')
        }
    })

    it('preserves generic type — resolves with correct typed value', async () => {
        const controller = new AbortController()
        const result = await abortable(Promise.resolve({ x: 1, y: 'hello' }), controller.signal)

        expect(result).toEqual({ x: 1, y: 'hello' })
    })
})
