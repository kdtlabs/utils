import { isFunction } from '@/functions'
import { isObject } from '@/objects'

export const isPromiseLike = <T>(value: unknown): value is PromiseLike<T> => isObject(value) && isFunction(value.then)

export const isPromise = <T>(value: unknown): value is Promise<T> => (
    isObject(value) && isFunction(value.then) && isFunction(value.catch) && isFunction(value.finally)
)
