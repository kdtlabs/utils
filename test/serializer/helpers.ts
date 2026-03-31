import type { Jsonable } from '@/core/types'
import type { SerializeContext } from '@/serializer/types'
import { createSymbolKeySerializer } from '@/serializer/symbol-registry'

export const identitySerialize = (value: unknown): Jsonable => value as Jsonable

export const createTestContext = (overrides: Partial<SerializeContext> = {}): SerializeContext => ({
    depth: 0,
    maxDepth: 10,
    onCircularRef: 'placeholder',
    onMaxDepth: 'placeholder',
    onPropertyAccess: 'placeholder',
    onUnserializable: false,
    replacer: (v) => ({ ...v, __serialized__: true }) as Jsonable,
    symbolRegistry: createSymbolKeySerializer(),
    visited: new Set(),
    ...overrides,
})
