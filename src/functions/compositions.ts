import { isFunction } from './guards'

export function tap<T>(value: T, callback: (value: T) => void) {
    callback(value)

    return value
}

export const transform = <T, R>(value: T, callback: (value: T) => R) => callback(value)

export function tryCatch<T>(fn: () => T, fallback: T | ((error: unknown) => T)) {
    try {
        return fn()
    } catch (error) {
        return isFunction(fallback) ? fallback(error) : fallback
    }
}
