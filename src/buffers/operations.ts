import type { BufferLike } from './types'
import { toUint8Array } from './conversions'

export function concatBuffers(buffers: BufferLike[]) {
    if (buffers.length === 0) {
        return new Uint8Array(0)
    }

    const normalized = buffers.map(toUint8Array)

    let totalLength = 0
    let offset = 0

    for (const buf of normalized) {
        totalLength += buf.byteLength
    }

    const result = new Uint8Array(totalLength)

    for (const buf of normalized) {
        result.set(buf, offset)
        offset += buf.byteLength
    }

    return result
}

export function bufferEquals(a: BufferLike, b: BufferLike) {
    if (a === b) {
        return true
    }

    const u8a = toUint8Array(a)
    const u8b = toUint8Array(b)

    if (u8a.byteLength !== u8b.byteLength) {
        return false
    }

    const bufA = Buffer.from(u8a.buffer, u8a.byteOffset, u8a.byteLength)
    const bufB = Buffer.from(u8b.buffer, u8b.byteOffset, u8b.byteLength)

    return bufA.equals(bufB)
}
