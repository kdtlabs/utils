import type { Jsonable } from '../../src/core/types'
import type { SerializeContext } from '../../src/serializer/types'
import { createSymbolKeySerializer } from '../../src/serializer/symbol-registry'

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
