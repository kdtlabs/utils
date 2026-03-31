import type { CollectionLike, MapLike, SetLike } from './types'

export const isIterable = <T>(value: unknown): value is Iterable<T> => value != null && typeof value === 'object' && Symbol.iterator in value && typeof value[Symbol.iterator] === 'function'

export const isCollectionLike = <T>(value: unknown): value is CollectionLike<T> => isIterable(value) && 'size' in value && typeof value.size === 'number'

export const isEmptyCollection = (value: CollectionLike) => value.size === 0

export const isSetLike = <T>(value: unknown): value is SetLike<T> => isCollectionLike(value) && 'has' in value && typeof value.has === 'function'

export const isMapLike = <K, V>(value: unknown): value is MapLike<K, V> => isCollectionLike(value) && 'get' in value && typeof value.get === 'function' && 'entries' in value && typeof value.entries === 'function'
