export type CollectionLike<T = unknown> = Iterable<T> & {
    readonly size: number
}

export type SetLike<T = unknown> = CollectionLike<T> & {
    has(value: T): boolean
}

export type MapLike<K = unknown, V = unknown> = CollectionLike<[K, V]> & {
    entries(): Iterable<[K, V]>
    get(key: K): V | undefined
}
