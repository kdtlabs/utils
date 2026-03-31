import type { EmptyArray, NonEmptyArray } from './types'

export const isArray = <T = any>(value: unknown): value is T[] => Array.isArray(value)

export const isEmptyArray = <T = any, TStrict extends boolean = true>(value: T[]): value is (TStrict extends true ? EmptyArray : T[]) => value.length === 0

export const isNonEmptyArray = <T = any, TStrict extends boolean = true>(value: T[]): value is (TStrict extends true ? NonEmptyArray<T> : T[]) => !isEmptyArray(value)
