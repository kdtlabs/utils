import type { Errorable, ErrorCtor, ErrorLike } from './types'
import { isString, notNullish } from '../core'
import { isErrorLike } from './guards'

export const createAbortError = (message = 'This operation was aborted', name = 'AbortError') => new DOMException(message, name)

export const createTimeoutError = (message = 'The operation was aborted due to a timeout', name = 'TimeoutError') => createAbortError(message, name)

export function createAbortController(timeout?: number, timeoutError?: Errorable) {
    const controller = new AbortController()

    if (notNullish(timeout) && timeout > 0 && timeout <= Number.MAX_SAFE_INTEGER) {
        let timeoutId: NodeJS.Timeout

        const cleanup = () => {
            clearTimeout(timeoutId)
            controller.signal.removeEventListener('abort', cleanup)
        }

        controller.signal.addEventListener('abort', cleanup)
        timeoutId = setTimeout(() => controller.abort(ensureError(timeoutError ?? createTimeoutError())), timeout)
    }

    return controller
}

export function ensureError(input: Errorable, ctor?: ErrorCtor) {
    if (typeof input === 'string') {
        return ctor ? new ctor(input) : new Error(input)
    }

    if (typeof input === 'function') {
        return ensureError(input(), ctor)
    }

    return input
}

export function fromErrorLike({ cause, message, name, stack, ...properties }: ErrorLike, ctor?: ErrorCtor) {
    const errorClass = ctor ?? Error
    const error = new errorClass(message, { cause })

    Object.defineProperty(error, 'name', { configurable: true, enumerable: false, value: name, writable: true })
    Object.defineProperty(error, 'stack', { configurable: true, enumerable: false, value: stack, writable: true })

    for (const [key, value] of Object.entries(properties)) {
        Object.defineProperty(error, key, Object.getOwnPropertyDescriptor(properties, key) ?? { configurable: true, enumerable: true, value, writable: true })
    }

    return error
}

export interface NormalizeErrorOptions {
    defaultMessage?: string
    errorConstructor?: ErrorCtor
}

export function normalizeError(error: unknown, { defaultMessage = 'Unknown error', errorConstructor }: NormalizeErrorOptions = {}) {
    const errorClass = errorConstructor ?? Error

    if (error instanceof errorClass) {
        return error
    }

    if (isString(error)) {
        return ensureError(error, errorConstructor)
    }

    if (isErrorLike(error)) {
        return fromErrorLike(error, errorConstructor)
    }

    return new errorClass(defaultMessage, { cause: error })
}
