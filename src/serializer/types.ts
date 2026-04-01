import type { Jsonable } from '../core'
import type { OMIT_SENTINEL } from './constants'

export interface SerializedValue {
    __serialized__: true
    metadata?: Record<string, Jsonable>
    type: string
    value: Jsonable
}

export type SerializeReplacer = (value: Omit<SerializedValue, '__serialized__'>) => Jsonable

export type SerializeErrorStrategy = 'omit' | 'placeholder' | 'throw'

export interface SerializeErrorHandlers {
    circularRef?: SerializeErrorStrategy
    maxDepth?: SerializeErrorStrategy
    propertyAccess?: SerializeErrorStrategy
}

export interface SerializeOptions {
    maxDepth?: number
    onError?: SerializeErrorHandlers | SerializeErrorStrategy
    onUnserializable?: ((value: unknown) => Jsonable) | false
    replacer?: SerializeReplacer
}

export interface SerializeContext {
    depth: number
    readonly maxDepth: number
    readonly onCircularRef: SerializeErrorStrategy
    readonly onMaxDepth: SerializeErrorStrategy
    readonly onPropertyAccess: SerializeErrorStrategy
    readonly onUnserializable: ((value: unknown) => Jsonable) | false
    readonly replacer: SerializeReplacer
    readonly symbolRegistry: (symbol: symbol) => string
    readonly visited: Set<object>
}

export type SharedSerializeContext = Omit<SerializeContext, 'depth' | 'visited'>

export type SerializeValueFn = (value: unknown, ctx: SerializeContext) => Jsonable | typeof OMIT_SENTINEL

export type ErrorPropertyValue = Jsonable | typeof OMIT_SENTINEL | undefined
