import type { Primitive } from '../core'

export type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>

export type RequiredBy<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>

export type Mutable<T> = { -readonly [K in keyof T]: T[K] }

export type DeepPartial<T> = T extends object ? { [K in keyof T]?: DeepPartial<T[K]> } : T

export type DeepReadonly<T> = T extends Primitive ? T : T extends Array<infer U> ? ReadonlyArray<DeepReadonly<U>> : { readonly [K in keyof T]: DeepReadonly<T[K]> }

export type KeysOfType<T, V> = { [K in keyof T]-?: T[K] extends V ? K : never }[keyof T]

export type StringKeys<T> = Extract<keyof T, string>

export type Dictionary<T = unknown> = Record<string, T>

export type DiscriminateUnion<T, K extends keyof T, V extends T[K]> = T extends Record<K, V> ? T : never

export type AnyObject = Record<string, any>

export type UnknownObject = Record<string, unknown>

export type Constructor<T> = new (...args: any[]) => T

export type ClassMethods<T> = { [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never }[keyof T]

export type ClassMethodArgs<T, M extends ClassMethods<T>> = T[M] extends (...args: infer A) => any ? A : never

export type ClassMethodReturn<T, M extends ClassMethods<T>> = T[M] extends (...args: any[]) => infer R ? R : never

export type FilterPredicate<O, K extends keyof O> = (key: K, value: O[K], index: number) => boolean
