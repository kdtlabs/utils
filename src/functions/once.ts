import type { Args, Fn } from './types'
import { normalizeError } from '../errors'

export function once<T extends Fn>(fn: T) {
    let called = false
    let result: ReturnType<T>
    let error: unknown

    const cb = (...args: Args<T>): ReturnType<T> => {
        if (called) {
            if (error) {
                throw normalizeError(error)
            }

            return result
        }

        called = true

        try {
            return (result = fn(...args))
        } catch (error_) {
            throw error = normalizeError(error_)
        }
    }

    cb.reset = () => {
        called = false
        error = undefined
    }

    return cb
}
