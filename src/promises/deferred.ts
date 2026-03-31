import { combineSignals, createAbortController, createAbortError, type Errorable } from '../errors'

export interface DeferredPromiseOptions<T> {
    onCallbackError?: (error: unknown) => void
    onReject?: (reason: unknown) => void
    onResolve?: (value: PromiseLike<T> | T) => void
    onSettle?: () => void
    signal?: AbortSignal
    synchronousCallbacks?: boolean
}

export interface DeferredPromise<T> extends Promise<T> {
    isPending: boolean
    isRejected: boolean
    isResolved: boolean
    isSettled: boolean
    reject: (reason?: unknown) => void
    resolve: (value: PromiseLike<T> | T) => void
}

export function cleanupAbortSignal(signal: AbortSignal | undefined, abortHandler: (() => void) | undefined) {
    if (abortHandler) {
        signal?.removeEventListener('abort', abortHandler)
    }
}

export function setupAbortSignal(signal: AbortSignal | undefined, onAbort: () => void) {
    const abortHandler = () => onAbort()

    if (signal?.aborted) {
        onAbort()
    } else {
        signal?.addEventListener('abort', abortHandler)
    }

    return abortHandler
}

export function invokeSettleCallback(cb: () => void, onSettle: (() => void) | undefined, onCallbackError: ((error: unknown) => void) | undefined, synchronousCallbacks: boolean) {
    const callback = () => {
        try {
            cb()
        } catch (error) {
            onCallbackError?.(error)
        }

        try {
            onSettle?.()
        } catch (error) {
            onCallbackError?.(error)
        }
    }

    if (synchronousCallbacks) {
        callback()
    } else {
        queueMicrotask(callback)
    }
}

export function createDeferred<T>({ onCallbackError, onReject, onResolve, onSettle, signal, synchronousCallbacks = false }: DeferredPromiseOptions<T> = {}): DeferredPromise<T> {
    let resolveFn: (value: PromiseLike<T> | T) => void
    let rejectFn: (reason?: unknown) => void
    let abortHandler: (() => void) | undefined

    let isSettled = false
    let isResolved = false
    let isRejected = false

    const promise = <DeferredPromise<T>> new Promise<T>((resolve, reject) => {
        resolveFn = resolve
        rejectFn = reject
    })

    const afterSettle = (cb: () => void) => {
        cleanupAbortSignal(signal, abortHandler)
        invokeSettleCallback(cb, onSettle, onCallbackError, synchronousCallbacks)
    }

    Object.defineProperty(promise, 'isSettled', { enumerable: true, get: () => isSettled })
    Object.defineProperty(promise, 'isPending', { enumerable: true, get: () => !isSettled })
    Object.defineProperty(promise, 'isResolved', { enumerable: true, get: () => isResolved })
    Object.defineProperty(promise, 'isRejected', { enumerable: true, get: () => isRejected })

    promise.resolve = (value: PromiseLike<T> | T) => {
        if (isSettled) {
            return
        }

        isSettled = true
        isResolved = true

        resolveFn(value)
        afterSettle(() => onResolve?.(value))
    }

    promise.reject = (reason?: unknown) => {
        if (isSettled) {
            return
        }

        isSettled = true
        isRejected = true

        rejectFn(reason)
        afterSettle(() => onReject?.(reason))
    }

    abortHandler = setupAbortSignal(signal, () => {
        promise.reject(signal?.reason ?? createAbortError())
    })

    return promise
}

export interface DeferredPromiseWithTimeoutOptions<T> extends DeferredPromiseOptions<T> {
    error?: Errorable
}

export const createDeferredWithTimeout = <T>(ms: number, { error, signal, ...options }: DeferredPromiseWithTimeoutOptions<T> = {}) => {
    const timeoutController = createAbortController(ms, error)

    return createDeferred<T>({
        ...options,
        onSettle() {
            timeoutController.abort()
            options.onSettle?.()
        },
        signal: combineSignals(signal, timeoutController.signal),
    })
}
