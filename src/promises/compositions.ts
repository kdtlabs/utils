import type { Awaitable } from './types'

export const pTap = <T>(fn: (value: T) => Awaitable<unknown>) => async (value: T): Promise<T> => {
    return Promise.resolve(fn(value)).then(() => value)
}

pTap.catch = (fn: (error: unknown) => Awaitable<unknown>) => async (error: unknown): Promise<never> => {
    await fn(error)
    throw error
}

export async function tryCatchAsync<T, R>(fn: () => Awaitable<T>, fallback: (error: unknown) => Awaitable<R>) {
    try {
        return await fn()
    } catch (error) {
        return await fallback(error)
    }
}
