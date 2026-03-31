import type { Jsonable } from '../../core'
import type { SerializeContext } from '../types'

export function serializeBinary(value: object, ctx: SerializeContext): Jsonable | undefined {
    if (ArrayBuffer.isView(value) && !(value instanceof DataView)) {
        const typed = value as unknown as { [Symbol.toStringTag]: string, byteLength: number, byteOffset: number, length: number }

        return ctx.replacer({
            metadata: { byteLength: typed.byteLength, byteOffset: typed.byteOffset },
            type: typed[Symbol.toStringTag]?.toLowerCase() ?? 'typedarray',
            value: Array.from({ length: typed.length }, (_, index) => (value as unknown as ArrayLike<number>)[index]!),
        })
    }

    if (value instanceof ArrayBuffer || (typeof SharedArrayBuffer !== 'undefined' && value instanceof SharedArrayBuffer)) {
        return ctx.replacer({ metadata: { byteLength: value.byteLength }, type: 'arraybuffer', value: [...new Uint8Array(value)] })
    }

    if (value instanceof DataView) {
        return ctx.replacer({ metadata: { byteLength: value.byteLength, byteOffset: value.byteOffset }, type: 'dataview', value: null })
    }

    return undefined
}
