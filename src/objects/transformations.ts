import type { AnyObject, FilterPredicate } from './types'
import { isNullish, type Nullish } from '../core'

export const entries = <O extends AnyObject>(obj: O) => Object.entries(obj) as Array<[keyof O, O[keyof O]]>

export const filter = <O extends AnyObject>(obj: O, predicate: FilterPredicate<O, keyof O>): Partial<O> => (
    Object.fromEntries(entries(obj).filter(([key, value], index) => predicate(key, value, index))) as Partial<O>
)

export const filterByValue = <O extends AnyObject>(obj: O, predicate: (value: O[keyof O]) => boolean) => filter(obj, (_, value) => predicate(value))

export const pick = <O extends AnyObject, K extends keyof O>(obj: O, ...keys: K[]) => {
    const set = new Set<PropertyKey>(keys)

    return filter(obj, (key) => set.has(key)) as Pick<O, K>
}

export const omit = <O extends AnyObject, K extends keyof O>(object: O, ...keys: K[]) => {
    const set = new Set<PropertyKey>(keys)

    return filter(object, (key) => !set.has(key)) as Omit<O, K>
}

export const map = <K extends PropertyKey, V, NK extends PropertyKey, NV>(obj: Record<K, V>, fn: (k: K, v: V, i: number) => [NK, NV]) => (
    Object.fromEntries(entries(obj).map(([k, v], i) => fn(k, v, i))) as Record<NK, NV>
)

export function resolveOptions<T extends AnyObject>(options: Nullish<T | boolean>, defaultValue: T | false): T | false {
    if (options === false) {
        return false
    }

    return isNullish(options) || options === true ? defaultValue : options
}
