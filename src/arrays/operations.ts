import type { Nullable } from '../core'
import type { MaybeArray } from './types'
import { toArray } from './conversions'

export const merge = <T>(...arrays: Array<Nullable<MaybeArray<T>>>) => arrays.flatMap((array) => toArray(array))

export const flatten = <T>(array?: Nullable<MaybeArray<T | T[]>>) => toArray(array).flat() as T[]

export function shuffle<T>(array: T[]): T[] {
    const result = [...array]

    for (let i = result.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        const temp = result[i]

        result[i] = result[j]!
        result[j] = temp!
    }

    return result
}

export function groupBy<T, K extends PropertyKey>(array: T[], keyFn: (item: T) => K): Record<K, T[]> {
    const result = {} as Record<K, T[]>

    for (const item of array) {
        const key = keyFn(item)
        const group = result[key]

        if (group) {
            group.push(item)
        } else {
            result[key] = [item]
        }
    }

    return result
}

export function keyBy<T, K extends PropertyKey>(array: T[], keyFn: (item: T) => K): Record<K, T> {
    const result = {} as Record<K, T>

    for (const item of array) {
        result[keyFn(item)] = item
    }

    return result
}

export function chunk<T>(array: T[], size: number): T[][] {
    if (size <= 0 || !Number.isFinite(size)) {
        throw new RangeError(`chunk size must be a positive finite number, got ${size}`)
    }

    const step = Math.floor(size)
    const result: T[][] = []

    for (let i = 0; i < array.length; i += step) {
        result.push(array.slice(i, i + step))
    }

    return result
}

export type SortDirection = 'asc' | 'desc'

export type SortKey<T> = ((item: T) => number | string) | { fn: (item: T) => number | string, order: SortDirection }

export function sortBy<T>(array: T[], ...keys: Array<SortKey<T>>): T[] {
    const normalizedKeys = keys.map((key) => (typeof key === 'function' ? { fn: key, order: 'asc' as const } : key))

    return array.toSorted((a, b) => {
        for (const { fn, order } of normalizedKeys) {
            const va = fn(a)
            const vb = fn(b)

            if (va < vb) {
                return order === 'asc' ? -1 : 1
            }

            if (va > vb) {
                return order === 'asc' ? 1 : -1
            }
        }

        return 0
    })
}

export function partition<T>(array: T[], predicate: (item: T) => boolean): [T[], T[]] {
    const pass: T[] = []
    const fail: T[] = []

    for (const item of array) {
        if (predicate(item)) {
            pass.push(item)
        } else {
            fail.push(item)
        }
    }

    return [pass, fail]
}
