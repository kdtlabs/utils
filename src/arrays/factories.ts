import type { EmptyArray, NonEmptyArray } from './types'

export const createArray = <T, TStrict extends boolean = true, TLength extends number = number>(length: TLength, value: (index: number) => T) => (
    Array.from({ length }, (_, i) => value(i)) as TStrict extends false ? T[] : (TLength extends 0 ? EmptyArray : NonEmptyArray<T>)
)

export const range = (from: number, to: number, step = 1) => (
    Array.from({ length: Math.floor((to - from) / step) + 1 }, (_, i) => from + (i * step))
)

export const sample = <T>(array: T[], quantity = 1) => (
    Array.from({ length: quantity }, () => array[Math.floor(Math.random() * array.length)])
)
