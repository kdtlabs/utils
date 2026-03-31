import { createAbortError, ensureError, type Errorable } from '../errors'

export function abortable<T>(promise: Promise<T>, signal?: AbortSignal, error?: Errorable): Promise<T> {
    if (!signal) {
        return promise
    }

    const createError = () => (error ? ensureError(error) : (signal.reason ?? createAbortError()))

    if (signal.aborted) {
        return Promise.reject(createError())
    }

    return new Promise<T>((resolve, reject) => {
        let isSettled = false
        let onAbort: () => void

        const cleanup = (afterCleanup?: () => void) => {
            if (!isSettled) {
                isSettled = true
                signal.removeEventListener('abort', onAbort)
                afterCleanup?.()
            }
        }

        onAbort = () => {
            cleanup(() => reject(createError()))
        }

        signal.addEventListener('abort', onAbort)

        promise.then(
            (value) => cleanup(() => resolve(value)),
            (error_) => cleanup(() => reject(error_)),
        )
    })
}
