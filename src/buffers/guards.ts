import type { BufferLike } from './types'

export const isBuffer = (value: unknown): value is Buffer => Buffer.isBuffer(value)

export const isArrayBuffer = (value: unknown): value is ArrayBuffer => value instanceof ArrayBuffer

export const isSharedArrayBuffer = (value: unknown): value is SharedArrayBuffer => value instanceof SharedArrayBuffer

export const isArrayBufferView = (value: unknown): value is ArrayBufferView => ArrayBuffer.isView(value)

export const isBufferLike = (value: unknown): value is BufferLike => (
    isBuffer(value) || isArrayBuffer(value) || isSharedArrayBuffer(value) || isArrayBufferView(value)
)
