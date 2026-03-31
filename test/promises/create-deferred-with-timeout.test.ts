import { describe, expect, it } from 'bun:test'
import { createDeferredWithTimeout } from '../../src/promises'

describe('createDeferredWithTimeout', () => {
    describe('timeout rejection', () => {
        it('rejects after the timeout elapses', async () => {
            const deferred = createDeferredWithTimeout(10)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
                expect((error as DOMException).name).toBe('TimeoutError')
            }
        })

        it('sets flags correctly after timeout', async () => {
            const deferred = createDeferredWithTimeout(10)

            try {
                await deferred
            } catch {
                // expected
            }

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isSettled).toBe(true)
            expect(deferred.isPending).toBe(false)
            expect(deferred.isResolved).toBe(false)
        })

        it('rejects with custom error string', async () => {
            const deferred = createDeferredWithTimeout(10, { error: 'custom timeout' })

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(Error)
                expect((error as Error).message).toBe('custom timeout')
            }
        })

        it('rejects with custom Error instance', async () => {
            const customError = new TypeError('operation timed out')
            const deferred = createDeferredWithTimeout(10, { error: customError })

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(customError)
            }
        })

        it('rejects with custom error factory', async () => {
            const customError = new RangeError('lazy timeout')
            const deferred = createDeferredWithTimeout(10, { error: () => customError })

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(customError)
            }
        })
    })

    describe('early resolve before timeout', () => {
        it('resolves with the given value', async () => {
            const deferred = createDeferredWithTimeout<string>(60_000)

            deferred.resolve('done')

            expect(await deferred).toBe('done')
            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
        })

        it('cancels timeout timer so no late rejection occurs', async () => {
            const deferred = createDeferredWithTimeout<number>(50)

            deferred.resolve(42)

            expect(await deferred).toBe(42)

            await new Promise((resolve) => setTimeout(resolve, 100))

            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
        })
    })

    describe('early reject before timeout', () => {
        it('rejects with the given reason', async () => {
            const deferred = createDeferredWithTimeout(60_000)
            const error = new Error('manual reject')

            deferred.reject(error)

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }

            expect(deferred.isRejected).toBe(true)
        })

        it('cancels timeout timer so no late timeout rejection occurs', async () => {
            const deferred = createDeferredWithTimeout(50)
            const error = new Error('early')

            deferred.reject(error)

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }

            await new Promise((resolve) => setTimeout(resolve, 100))

            expect(deferred.isRejected).toBe(true)
        })
    })

    describe('external signal integration', () => {
        it('rejects via external signal before timeout', async () => {
            const controller = new AbortController()
            const deferred = createDeferredWithTimeout(60_000, { signal: controller.signal })

            controller.abort()

            expect(deferred.isRejected).toBe(true)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
            }
        })

        it('rejects via external signal that is already aborted', async () => {
            const controller = new AbortController()
            controller.abort()

            const deferred = createDeferredWithTimeout(60_000, { signal: controller.signal })

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isPending).toBe(false)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
            }
        })

        it('uses external signal reason when aborted with a custom reason', async () => {
            const controller = new AbortController()
            const reason = new Error('external reason')
            const deferred = createDeferredWithTimeout(60_000, { signal: controller.signal })

            controller.abort(reason)

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(reason)
            }
        })

        it('timeout wins when it fires before external signal', async () => {
            const controller = new AbortController()
            const deferred = createDeferredWithTimeout(10, { signal: controller.signal })

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
                expect((error as DOMException).name).toBe('TimeoutError')
            }

            expect(deferred.isRejected).toBe(true)
        })
    })

    describe('callback passthrough', () => {
        it('calls onResolve when resolved before timeout', async () => {
            let received: unknown

            const deferred = createDeferredWithTimeout<string>(60_000, {
                onResolve(value) {
                    received = value
                },
            })

            deferred.resolve('done')
            await Promise.resolve()
            await Promise.resolve()

            expect(received).toBe('done')
        })

        it('calls onReject when timeout fires', async () => {
            let received: unknown

            const deferred = createDeferredWithTimeout(10, {
                onReject(reason) {
                    received = reason
                },
            })

            try {
                await deferred
            } catch {
                // expected
            }

            await Promise.resolve()

            expect(received).toBeInstanceOf(DOMException)
        })

        it('calls onSettle when resolved before timeout', async () => {
            let settled = false

            const deferred = createDeferredWithTimeout<string>(60_000, {
                onSettle() {
                    settled = true
                },
            })

            deferred.resolve('done')
            await Promise.resolve()
            await Promise.resolve()

            expect(settled).toBe(true)
        })

        it('calls onSettle when timeout fires', async () => {
            let settled = false

            const deferred = createDeferredWithTimeout(10, {
                onSettle() {
                    settled = true
                },
            })

            try {
                await deferred
            } catch {
                // expected
            }

            await Promise.resolve()

            expect(settled).toBe(true)
        })

        it('passes onCallbackError through to createDeferred', () => {
            const errors: unknown[] = []
            const thrown = new Error('callback error')

            const deferred = createDeferredWithTimeout<string>(60_000, {
                onCallbackError(error) {
                    errors.push(error)
                },
                onResolve() {
                    throw thrown
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(errors).toEqual([thrown])
        })

        it('passes synchronousCallbacks through to createDeferred', () => {
            const order: string[] = []

            const deferred = createDeferredWithTimeout<string>(60_000, {
                onResolve() {
                    order.push('onResolve')
                },
                onSettle() {
                    order.push('onSettle')
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')
            order.push('after-resolve')

            expect(order).toEqual(['onResolve', 'onSettle', 'after-resolve'])
        })
    })

    describe('default options', () => {
        it('works with only the timeout argument', async () => {
            const deferred = createDeferredWithTimeout(10)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
            }

            expect(deferred.isRejected).toBe(true)
        })

        it('is an instance of Promise', () => {
            const deferred = createDeferredWithTimeout(60_000)

            expect(deferred).toBeInstanceOf(Promise)

            deferred.resolve(undefined)
        })

        it('starts pending before timeout elapses', () => {
            const deferred = createDeferredWithTimeout(60_000)

            expect(deferred.isPending).toBe(true)
            expect(deferred.isSettled).toBe(false)

            deferred.resolve(undefined)
        })
    })
})
