export type MaybeArray<T> = Iterable<T> | T | T[]

export type EmptyArray = []

export type NonEmptyArray<T> = [T, ...T[]]

export type ElementOf<T> = T extends Array<infer E> ? E : never

export type Head<T extends readonly unknown[]> = T extends readonly [infer H, ...unknown[]] ? H : never

export type Tail<T extends readonly unknown[]> = T extends readonly [unknown, ...infer R] ? R : []

export type Last<T extends readonly unknown[]> = T extends readonly [...unknown[], infer L] ? L : never

export type Flatten<T extends readonly unknown[]> = T extends ReadonlyArray<infer U> ? U extends ReadonlyArray<infer V> ? V[] : U[] : never

export type TupleToUnion<T extends readonly unknown[]> = T[number]

export type FixedLength<T, N extends number, R extends T[] = []> = R['length'] extends N ? R : FixedLength<T, N, [...R, T]>

export type ReadonlyNonEmptyArray<T> = readonly [T, ...T[]]
