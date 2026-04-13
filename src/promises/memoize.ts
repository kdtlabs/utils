import type { Args, AsyncFn, MemoizeCache } from '../functions'

export interface PMemoizeOptions<T extends AsyncFn> {
    cache?: MemoizeCache<ReturnType<T>>
    cacheRejection?: boolean
    resolver?: (...args: Args<T>) => unknown
}

export function pMemoize<T extends AsyncFn>(fn: T, { cache = new Map(), cacheRejection = false, resolver }: PMemoizeOptions<T> = {}) {
    const memoized = function (this: unknown, ...args: Args<T>) {
        const key = resolver ? resolver(...args) : args[0]

        if (cache.has(key)) {
            return cache.get(key)!
        }

        const promise = Promise.resolve(fn.apply(this, args)) as ReturnType<T>

        cache.set(key, promise)

        if (!cacheRejection) {
            promise.catch(() => cache.delete(key))
        }

        return promise
    } as unknown as T & { cache: MemoizeCache<ReturnType<T>> }

    memoized.cache = cache

    return memoized
}
