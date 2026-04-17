import type { BufferLike } from '../../../src/buffers/types'
import { bench, do_not_optimize, run, summary } from 'mitata'
import { toUint8Array } from '../../../src/buffers/conversions'

function approachTypedArrayIndexOf(input: BufferLike, maxBytes = 8000) {
    const u8 = toUint8Array(input)
    const view = u8.byteLength > maxBytes ? u8.subarray(0, maxBytes) : u8

    return view.indexOf(0) !== -1
}

function approachManualLoop(input: BufferLike, maxBytes = 8000) {
    const u8 = toUint8Array(input)
    const len = Math.min(u8.byteLength, maxBytes)

    for (let i = 0; i < len; i++) {
        if (u8[i] === 0) {
            return true
        }
    }

    return false
}

function approachNodeBufferIndexOf(input: BufferLike, maxBytes = 8000) {
    const u8 = toUint8Array(input)
    const len = Math.min(u8.byteLength, maxBytes)
    const buf = Buffer.from(u8.buffer, u8.byteOffset, len)

    return buf.indexOf(0) !== -1
}

function makeText(len: number) {
    const u8 = new Uint8Array(len)

    for (let i = 0; i < len; i++) {
        u8[i] = 65 + (i % 26)
    }

    return u8
}

function makeBinaryEarlyNul(len: number) {
    const u8 = makeText(len)
    u8[4] = 0

    return u8
}

function makeBinaryLateNul(len: number) {
    const u8 = makeText(len)
    u8[Math.min(len - 1, 7999)] = 0

    return u8
}

const textSmall = makeText(256)
const textLarge = makeText(8000)
const textHuge = makeText(100_000)
const binaryEarly = makeBinaryEarlyNul(8000)
const binaryLate = makeBinaryLateNul(8000)
const empty = new Uint8Array(0)

summary(() => {
    bench('indexOf / text small', () => do_not_optimize(approachTypedArrayIndexOf(textSmall)))
    bench('manual   / text small', () => do_not_optimize(approachManualLoop(textSmall)))
    bench('buffer   / text small', () => do_not_optimize(approachNodeBufferIndexOf(textSmall)))

    bench('indexOf / text 8KB', () => do_not_optimize(approachTypedArrayIndexOf(textLarge)))
    bench('manual   / text 8KB', () => do_not_optimize(approachManualLoop(textLarge)))
    bench('buffer   / text 8KB', () => do_not_optimize(approachNodeBufferIndexOf(textLarge)))

    bench('indexOf / text 100KB', () => do_not_optimize(approachTypedArrayIndexOf(textHuge)))
    bench('manual   / text 100KB', () => do_not_optimize(approachManualLoop(textHuge)))
    bench('buffer   / text 100KB', () => do_not_optimize(approachNodeBufferIndexOf(textHuge)))

    bench('indexOf / binary early', () => do_not_optimize(approachTypedArrayIndexOf(binaryEarly)))
    bench('manual   / binary early', () => do_not_optimize(approachManualLoop(binaryEarly)))
    bench('buffer   / binary early', () => do_not_optimize(approachNodeBufferIndexOf(binaryEarly)))

    bench('indexOf / binary late', () => do_not_optimize(approachTypedArrayIndexOf(binaryLate)))
    bench('manual   / binary late', () => do_not_optimize(approachManualLoop(binaryLate)))
    bench('buffer   / binary late', () => do_not_optimize(approachNodeBufferIndexOf(binaryLate)))

    bench('indexOf / empty', () => do_not_optimize(approachTypedArrayIndexOf(empty)))
    bench('manual   / empty', () => do_not_optimize(approachManualLoop(empty)))
    bench('buffer   / empty', () => do_not_optimize(approachNodeBufferIndexOf(empty)))
})

await run()
