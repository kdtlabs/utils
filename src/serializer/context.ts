import type { Jsonable } from '../core'
import type { SerializeContext, SerializedValue, SerializeErrorStrategy, SerializeOptions, SharedSerializeContext } from './types'
import { createSymbolKeySerializer } from './symbol-registry'

export const DEFAULT_REPLACER = (value: Omit<SerializedValue, '__serialized__'>): Jsonable => ({ ...value, __serialized__: true }) as Jsonable

export function createSharedContext(options: SerializeOptions = {}): SharedSerializeContext {
    const { maxDepth = Number.POSITIVE_INFINITY, onUnserializable = false, replacer = DEFAULT_REPLACER } = options
    let onCircularRef: SerializeErrorStrategy = 'placeholder'
    let onMaxDepth: SerializeErrorStrategy = 'placeholder'
    let onPropertyAccess: SerializeErrorStrategy = 'placeholder'

    if (typeof options.onError === 'string') {
        onCircularRef = options.onError
        onMaxDepth = options.onError
        onPropertyAccess = options.onError
    } else if (typeof options.onError === 'object' && options.onError != null) {
        onCircularRef = options.onError.circularRef ?? 'placeholder'
        onMaxDepth = options.onError.maxDepth ?? 'placeholder'
        onPropertyAccess = options.onError.propertyAccess ?? 'placeholder'
    }

    return { maxDepth, onCircularRef, onMaxDepth, onPropertyAccess, onUnserializable, replacer, symbolRegistry: createSymbolKeySerializer() }
}

export const createContext = (options: SerializeOptions = {}): SerializeContext => ({
    ...createSharedContext(options), depth: 0, visited: new Set(),
})
