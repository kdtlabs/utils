import type { SerializeContext } from '../types'
import type { Jsonable } from '@/core/types'

export function serializeBlob(value: object, ctx: SerializeContext): Jsonable | undefined {
    if (typeof Blob === 'undefined' || !(value instanceof Blob)) {
        return undefined
    }

    const metadata: Record<string, Jsonable> = { size: value.size, type: value.type }

    if (typeof File !== 'undefined' && value instanceof File) {
        metadata.name = value.name

        return ctx.replacer({ metadata, type: 'file', value: null })
    }

    return ctx.replacer({ metadata, type: 'blob', value: null })
}
