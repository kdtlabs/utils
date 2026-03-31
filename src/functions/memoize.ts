import type { Args, Fn } from './types'

export interface MemoizeCache<V = unknown> {
    delete(key: unknown): boolean
    get(key: unknown): V | undefined
    has(key: unknown): boolean
    set(key: unknown, value: V): void
}

export interface MemoizeOptions<T extends Fn> {
    cache?: MemoizeCache<ReturnType<T>>
    resolver?: (...args: Args<T>) => unknown
}

export function memoize<T extends Fn>(fn: T, { cache = new Map(), resolver }: MemoizeOptions<T> = {}) {
    const memoized = function (this: unknown, ...args: Args<T>) {
        const key = resolver ? resolver(...args) : args[0]

        if (cache.has(key)) {
            return cache.get(key)
        }

        const result = fn.apply(this, args)

        cache.set(key, result)

        return result
    } as T & { cache: MemoizeCache<ReturnType<T>> }

    memoized.cache = cache

    return memoized
}
