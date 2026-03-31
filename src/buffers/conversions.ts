import type { BufferLike } from './types'
import { isArrayBuffer, isBuffer, isSharedArrayBuffer } from './guards'

export function bufferToString(buffer: BufferLike, encoding: BufferEncoding = 'utf8') {
    if (isBuffer(buffer)) {
        return buffer.toString(encoding)
    }

    if (isArrayBuffer(buffer) || isSharedArrayBuffer(buffer)) {
        return Buffer.from(buffer).toString(encoding)
    }

    return Buffer.from(buffer.buffer, buffer.byteOffset, buffer.byteLength).toString(encoding)
}

export function toUint8Array(input: BufferLike) {
    if (input instanceof Uint8Array) {
        return input
    }

    if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer) {
        return new Uint8Array(input)
    }

    return new Uint8Array(input.buffer, input.byteOffset, input.byteLength)
}
