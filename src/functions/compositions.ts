import { isFunction } from './guards'

export function tap<T>(value: T, callback: (value: T) => void) {
    callback(value)

    return value
}

export const transform = <T, R>(value: T, callback: (value: T) => R) => callback(value)

export function tryCatch<T, R>(fn: () => T, fallback: R | ((error: unknown) => R)) {
    try {
        return fn()
    } catch (error) {
        return isFunction(fallback) ? fallback(error) : fallback
    }
}
