import { DEFAULT } from './constants'
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

export type MatchCases = Record<PropertyKey, unknown> & { [DEFAULT]?: unknown }

export type ResolveMatchValue<V> = V extends () => infer R ? R : V

export type MatchResult<C extends MatchCases> = ResolveMatchValue<C[keyof C]> | undefined

export function match<C extends MatchCases>(condition: PropertyKey, cases: C): MatchResult<C> {
    const value = (condition in cases) ? cases[condition] : cases[DEFAULT]

    return (isFunction(value) ? value() : value) as MatchResult<C>
}

export type MatchWhenCase<C, T> = [condition: C | C[] | typeof DEFAULT, value: T | (() => T)]

export function matchWhen<C, T>(subject: C, cases: Array<MatchWhenCase<C, T>>) {
    for (const [condition, value] of cases) {
        const matched = condition === DEFAULT || (Array.isArray(condition) ? condition.includes(subject) : condition === subject)

        if (matched) {
            return isFunction(value) ? value() : value
        }
    }

    return void 0
}
