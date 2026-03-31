import { describe, expect, it } from 'bun:test'
import { createDeferred } from '@/promises'

describe('createDeferred', () => {
    describe('initial state', () => {
        it('starts with isPending true', () => {
            const deferred = createDeferred()

            expect(deferred.isPending).toBe(true)
        })

        it('starts with isSettled false', () => {
            const deferred = createDeferred()

            expect(deferred.isSettled).toBe(false)
        })

        it('starts with isResolved false', () => {
            const deferred = createDeferred()

            expect(deferred.isResolved).toBe(false)
        })

        it('starts with isRejected false', () => {
            const deferred = createDeferred()

            expect(deferred.isRejected).toBe(false)
        })

        it('is an instance of Promise', () => {
            const deferred = createDeferred()

            expect(deferred).toBeInstanceOf(Promise)
        })
    })

    describe('resolve path', () => {
        it('resolves the promise with the given value', async () => {
            const deferred = createDeferred<number>()

            deferred.resolve(42)

            expect(await deferred).toBe(42)
        })

        it('sets isResolved to true synchronously', () => {
            const deferred = createDeferred<string>()

            deferred.resolve('done')

            expect(deferred.isResolved).toBe(true)
        })

        it('sets isSettled to true synchronously', () => {
            const deferred = createDeferred<string>()

            deferred.resolve('done')

            expect(deferred.isSettled).toBe(true)
        })

        it('sets isPending to false synchronously', () => {
            const deferred = createDeferred<string>()

            deferred.resolve('done')

            expect(deferred.isPending).toBe(false)
        })

        it('keeps isRejected as false', () => {
            const deferred = createDeferred<string>()

            deferred.resolve('done')

            expect(deferred.isRejected).toBe(false)
        })

        it('resolves with undefined when given undefined', async () => {
            const deferred = createDeferred<undefined>()

            deferred.resolve(undefined)

            expect(await deferred).toBeUndefined()
        })
    })

    describe('reject path', () => {
        it('rejects the promise with the given reason', async () => {
            const deferred = createDeferred()
            const error = new Error('fail')

            deferred.reject(error)

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }
        })

        it('sets isRejected to true synchronously', () => {
            const deferred = createDeferred()

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(deferred.isRejected).toBe(true)
        })

        it('sets isSettled to true synchronously', () => {
            const deferred = createDeferred()

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(deferred.isSettled).toBe(true)
        })

        it('sets isPending to false synchronously', () => {
            const deferred = createDeferred()

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(deferred.isPending).toBe(false)
        })

        it('keeps isResolved as false', () => {
            const deferred = createDeferred()

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(deferred.isResolved).toBe(false)
        })

        it('rejects with undefined when no reason is provided', async () => {
            const deferred = createDeferred()

            deferred.reject()

            try {
                await deferred
            } catch (error) {
                expect(error).toBeUndefined()
            }
        })
    })

    describe('thenable resolution', () => {
        it('resolves with the unwrapped value of a Promise', async () => {
            const deferred = createDeferred<number>()

            deferred.resolve(Promise.resolve(99))

            expect(await deferred).toBe(99)
        })

        it('rejects when resolved with a PromiseLike that rejects', async () => {
            const deferred = createDeferred<string>()
            const error = new Error('thenable rejection')

            deferred.resolve(Promise.reject(error))

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }
        })
    })

    describe('duplicate settle attempts', () => {
        it('ignores a second resolve after already resolved', async () => {
            const deferred = createDeferred<string>()

            deferred.resolve('first')
            deferred.resolve('second')

            expect(await deferred).toBe('first')
            expect(deferred.isResolved).toBe(true)
        })

        it('ignores reject after already resolved', async () => {
            const deferred = createDeferred<string>()

            deferred.resolve('first')
            deferred.reject(new Error('fail'))

            expect(await deferred).toBe('first')
            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
        })

        it('ignores a second reject after already rejected', async () => {
            const deferred = createDeferred()
            const first = new Error('first')

            deferred.reject(first)
            deferred.reject(new Error('second'))

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(first)
            }

            expect(deferred.isRejected).toBe(true)
        })

        it('ignores resolve after already rejected', async () => {
            const deferred = createDeferred<string>()

            deferred.reject(new Error('fail'))
            deferred.resolve('late')

            try {
                await deferred
            } catch {
                // expected
            }

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isResolved).toBe(false)
        })

        it('does not fire onResolve callback on duplicate resolve', () => {
            let callCount = 0

            const deferred = createDeferred<string>({
                onResolve() {
                    callCount++
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('first')
            deferred.resolve('second')

            expect(callCount).toBe(1)
        })

        it('does not fire onReject callback on duplicate reject', () => {
            let callCount = 0

            const deferred = createDeferred({
                onReject() {
                    callCount++
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('first'))
            deferred.reject(new Error('second'))

            expect(callCount).toBe(1)
        })

        it('does not fire onSettle callback on duplicate settle', () => {
            let callCount = 0

            const deferred = createDeferred<string>({
                onSettle() {
                    callCount++
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('first')
            deferred.resolve('second')
            deferred.reject(new Error('third'))

            expect(callCount).toBe(1)
        })
    })

    describe('abort via signal', () => {
        it('rejects immediately when signal is already aborted', async () => {
            const controller = new AbortController()
            controller.abort()

            const deferred = createDeferred({ signal: controller.signal })

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isSettled).toBe(true)
            expect(deferred.isPending).toBe(false)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
                expect((error as DOMException).name).toBe('AbortError')
            }
        })

        it('uses signal.reason when signal is already aborted with a custom reason', async () => {
            const controller = new AbortController()
            const reason = new Error('custom reason')
            controller.abort(reason)

            const deferred = createDeferred({ signal: controller.signal })

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(reason)
            }
        })

        it('rejects when signal aborts while pending', async () => {
            const controller = new AbortController()
            const deferred = createDeferred({ signal: controller.signal })

            expect(deferred.isPending).toBe(true)

            controller.abort()

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isPending).toBe(false)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
                expect((error as DOMException).name).toBe('AbortError')
            }
        })

        it('uses signal.reason when signal aborts with a custom reason while pending', async () => {
            const controller = new AbortController()
            const deferred = createDeferred({ signal: controller.signal })
            const reason = new Error('custom abort reason')

            controller.abort(reason)

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(reason)
            }
        })

        it('ignores abort after already resolved', async () => {
            const controller = new AbortController()
            const deferred = createDeferred<string>({ signal: controller.signal })

            deferred.resolve('done')
            controller.abort()

            expect(await deferred).toBe('done')
            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
        })

        it('ignores abort after already rejected', async () => {
            const controller = new AbortController()
            const deferred = createDeferred({ signal: controller.signal })
            const error = new Error('manual reject')

            deferred.reject(error)
            controller.abort()

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }

            expect(deferred.isRejected).toBe(true)
        })

        it('removes abort listener after resolve so late abort is a no-op', () => {
            const controller = new AbortController()
            const deferred = createDeferred<string>({ signal: controller.signal })

            deferred.resolve('done')
            controller.abort()

            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
        })

        it('removes abort listener after reject so late abort is a no-op', () => {
            const controller = new AbortController()
            const deferred = createDeferred({ signal: controller.signal })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))
            controller.abort()

            expect(deferred.isRejected).toBe(true)
        })

        it('fires onReject callback when aborted', () => {
            let received: unknown
            const controller = new AbortController()

            const deferred = createDeferred({
                onReject(reason) {
                    received = reason
                },
                signal: controller.signal,
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            controller.abort()

            expect(received).toBeInstanceOf(DOMException)
        })

        it('fires onSettle callback when aborted', () => {
            let settled = false
            const controller = new AbortController()

            const deferred = createDeferred({
                onSettle() {
                    settled = true
                },
                signal: controller.signal,
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            controller.abort()

            expect(settled).toBe(true)
        })
    })

    describe('onResolve callback', () => {
        it('receives the resolved value', () => {
            let received: unknown

            const deferred = createDeferred<number>({
                onResolve(value) {
                    received = value
                },
                synchronousCallbacks: true,
            })

            deferred.resolve(42)

            expect(received).toBe(42)
        })

        it('does not fire on reject', () => {
            let called = false

            const deferred = createDeferred({
                onResolve() {
                    called = true
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(called).toBe(false)
        })

        it('receives the PromiseLike value as-is without unwrapping', () => {
            let received: unknown
            const thenable = Promise.resolve(99)

            const deferred = createDeferred<number>({
                onResolve(value) {
                    received = value
                },
                synchronousCallbacks: true,
            })

            deferred.resolve(thenable)

            expect(received).toBe(thenable)
        })
    })

    describe('onReject callback', () => {
        it('receives the rejection reason', () => {
            let received: unknown
            const error = new Error('fail')

            const deferred = createDeferred({
                onReject(reason) {
                    received = reason
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(error)

            expect(received).toBe(error)
        })

        it('receives undefined when reject is called without a reason', () => {
            let received: unknown = 'sentinel'

            const deferred = createDeferred({
                onReject(reason) {
                    received = reason
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject()

            expect(received).toBeUndefined()
        })

        it('does not fire on resolve', () => {
            let called = false

            const deferred = createDeferred<string>({
                onReject() {
                    called = true
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(called).toBe(false)
        })
    })

    describe('onSettle callback', () => {
        it('fires after resolve', () => {
            let settled = false

            const deferred = createDeferred<string>({
                onSettle() {
                    settled = true
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(settled).toBe(true)
        })

        it('fires after reject', () => {
            let settled = false

            const deferred = createDeferred({
                onSettle() {
                    settled = true
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(settled).toBe(true)
        })

        it('fires when signal is already aborted at creation', () => {
            let settled = false
            const controller = new AbortController()
            controller.abort()

            createDeferred({
                onSettle() {
                    settled = true
                },
                signal: controller.signal,
                synchronousCallbacks: true,
            }).catch(() => {})

            expect(settled).toBe(true)
        })

        it('fires when signal aborts while pending', () => {
            let settled = false
            const controller = new AbortController()

            createDeferred({
                onSettle() {
                    settled = true
                },
                signal: controller.signal,
                synchronousCallbacks: true,
            }).catch(() => {})

            controller.abort()

            expect(settled).toBe(true)
        })
    })

    describe('synchronousCallbacks behavior', () => {
        it('fires resolve callbacks synchronously when enabled', () => {
            const order: string[] = []

            const deferred = createDeferred<string>({
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

        it('fires reject callbacks synchronously when enabled', () => {
            const order: string[] = []

            const deferred = createDeferred({
                onReject() {
                    order.push('onReject')
                },
                onSettle() {
                    order.push('onSettle')
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))
            order.push('after-reject')

            expect(order).toEqual(['onReject', 'onSettle', 'after-reject'])
        })

        it('defers resolve callbacks to microtask when disabled (default)', async () => {
            const order: string[] = []

            const deferred = createDeferred<string>({
                onResolve() {
                    order.push('onResolve')
                },
                onSettle() {
                    order.push('onSettle')
                },
            })

            deferred.resolve('ok')
            order.push('after-resolve')

            expect(order).toEqual(['after-resolve'])

            await Promise.resolve()

            expect(order).toEqual(['after-resolve', 'onResolve', 'onSettle'])
        })

        it('defers reject callbacks to microtask when disabled (default)', async () => {
            const order: string[] = []

            const deferred = createDeferred({
                onReject() {
                    order.push('onReject')
                },
                onSettle() {
                    order.push('onSettle')
                },
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))
            order.push('after-reject')

            expect(order).toEqual(['after-reject'])

            await Promise.resolve()

            expect(order).toEqual(['after-reject', 'onReject', 'onSettle'])
        })

        it('always calls onResolve before onSettle regardless of mode', async () => {
            const syncOrder: string[] = []

            const syncDeferred = createDeferred<string>({
                onResolve() {
                    syncOrder.push('onResolve')
                },
                onSettle() {
                    syncOrder.push('onSettle')
                },
                synchronousCallbacks: true,
            })

            syncDeferred.resolve('ok')

            expect(syncOrder).toEqual(['onResolve', 'onSettle'])

            const asyncOrder: string[] = []

            const asyncDeferred = createDeferred<string>({
                onResolve() {
                    asyncOrder.push('onResolve')
                },
                onSettle() {
                    asyncOrder.push('onSettle')
                },
            })

            asyncDeferred.resolve('ok')
            await Promise.resolve()

            expect(asyncOrder).toEqual(['onResolve', 'onSettle'])
        })

        it('always calls onReject before onSettle regardless of mode', async () => {
            const syncOrder: string[] = []

            const syncDeferred = createDeferred({
                onReject() {
                    syncOrder.push('onReject')
                },
                onSettle() {
                    syncOrder.push('onSettle')
                },
                synchronousCallbacks: true,
            })

            syncDeferred.catch(() => {})
            syncDeferred.reject(new Error('fail'))

            expect(syncOrder).toEqual(['onReject', 'onSettle'])

            const asyncOrder: string[] = []

            const asyncDeferred = createDeferred({
                onReject() {
                    asyncOrder.push('onReject')
                },
                onSettle() {
                    asyncOrder.push('onSettle')
                },
            })

            asyncDeferred.catch(() => {})
            asyncDeferred.reject(new Error('fail'))
            await Promise.resolve()

            expect(asyncOrder).toEqual(['onReject', 'onSettle'])
        })
    })

    describe('onCallbackError', () => {
        it('catches errors thrown in onResolve', () => {
            const errors: unknown[] = []
            const thrown = new Error('resolve callback error')

            const deferred = createDeferred<string>({
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

        it('catches errors thrown in onReject', () => {
            const errors: unknown[] = []
            const thrown = new Error('reject callback error')

            const deferred = createDeferred({
                onCallbackError(error) {
                    errors.push(error)
                },
                onReject() {
                    throw thrown
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(errors).toEqual([thrown])
        })

        it('catches errors thrown in onSettle', () => {
            const errors: unknown[] = []
            const thrown = new Error('settle callback error')

            const deferred = createDeferred<string>({
                onCallbackError(error) {
                    errors.push(error)
                },
                onSettle() {
                    throw thrown
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(errors).toEqual([thrown])
        })

        it('catches errors from both onResolve and onSettle independently', () => {
            const errors: unknown[] = []
            const resolveError = new Error('resolve error')
            const settleError = new Error('settle error')

            const deferred = createDeferred<string>({
                onCallbackError(error) {
                    errors.push(error)
                },
                onResolve() {
                    throw resolveError
                },
                onSettle() {
                    throw settleError
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(errors).toEqual([resolveError, settleError])
        })

        it('catches errors from both onReject and onSettle independently', () => {
            const errors: unknown[] = []
            const rejectError = new Error('reject error')
            const settleError = new Error('settle error')

            const deferred = createDeferred({
                onCallbackError(error) {
                    errors.push(error)
                },
                onReject() {
                    throw rejectError
                },
                onSettle() {
                    throw settleError
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(errors).toEqual([rejectError, settleError])
        })

        it('still fires onSettle even when onResolve throws', () => {
            let settled = false

            const deferred = createDeferred<string>({
                onCallbackError() {},
                onResolve() {
                    throw new Error('boom')
                },
                onSettle() {
                    settled = true
                },
                synchronousCallbacks: true,
            })

            deferred.resolve('ok')

            expect(settled).toBe(true)
        })

        it('still fires onSettle even when onReject throws', () => {
            let settled = false

            const deferred = createDeferred({
                onCallbackError() {},
                onReject() {
                    throw new Error('reject boom')
                },
                onSettle() {
                    settled = true
                },
                synchronousCallbacks: true,
            })

            deferred.catch(() => {})
            deferred.reject(new Error('fail'))

            expect(settled).toBe(true)
        })

        it('catches errors from deferred callbacks in async mode', async () => {
            const errors: unknown[] = []
            const thrown = new Error('async callback error')

            const deferred = createDeferred<string>({
                onCallbackError(error) {
                    errors.push(error)
                },
                onResolve() {
                    throw thrown
                },
            })

            deferred.resolve('ok')

            expect(errors).toEqual([])

            await Promise.resolve()

            expect(errors).toEqual([thrown])
        })
    })

    describe('race conditions', () => {
        it('resolve then abort keeps resolved state', async () => {
            const controller = new AbortController()
            const deferred = createDeferred<string>({ signal: controller.signal })

            deferred.resolve('winner')
            controller.abort()

            expect(deferred.isResolved).toBe(true)
            expect(deferred.isRejected).toBe(false)
            expect(await deferred).toBe('winner')
        })

        it('abort then resolve keeps rejected state', async () => {
            const controller = new AbortController()
            const deferred = createDeferred<string>({ signal: controller.signal })

            controller.abort()
            deferred.resolve('late')

            expect(deferred.isRejected).toBe(true)
            expect(deferred.isResolved).toBe(false)

            try {
                await deferred
            } catch (error) {
                expect(error).toBeInstanceOf(DOMException)
            }
        })

        it('reject then abort keeps original rejection reason', async () => {
            const controller = new AbortController()
            const deferred = createDeferred({ signal: controller.signal })
            const original = new Error('original')

            deferred.reject(original)
            controller.abort()

            try {
                await deferred
            } catch (error) {
                expect(error).toBe(original)
            }
        })
    })

    describe('no options', () => {
        it('resolves without options', async () => {
            const deferred = createDeferred<number>()

            deferred.resolve(1)

            expect(await deferred).toBe(1)
        })

        it('rejects without options', async () => {
            const deferred = createDeferred()
            const error = new Error('no options')

            deferred.reject(error)

            try {
                await deferred
            } catch (error_) {
                expect(error_).toBe(error)
            }
        })
    })
})
