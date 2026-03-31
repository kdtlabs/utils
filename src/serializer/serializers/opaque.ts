import type { SerializeContext } from '../types'
import type { Jsonable } from '@/core/types'
import { isGenerator } from '@/core/guards'
import { serializeFunction } from './function'

export function serializeOpaque(value: unknown, ctx: SerializeContext): Jsonable | undefined {
    if (typeof value === 'function') {
        return serializeFunction(value as (...args: unknown[]) => unknown, ctx)
    }

    if (value instanceof Promise) {
        return ctx.replacer({ type: 'promise', value: '[Promise]' })
    }

    if (value instanceof WeakMap) {
        return ctx.replacer({ type: 'weakmap', value: '[WeakMap]' })
    }

    if (value instanceof WeakSet) {
        return ctx.replacer({ type: 'weakset', value: '[WeakSet]' })
    }

    if (typeof WeakRef !== 'undefined' && value instanceof WeakRef) {
        return ctx.replacer({ type: 'weakref', value: '[WeakRef]' })
    }

    if (typeof ReadableStream !== 'undefined' && value instanceof ReadableStream) {
        return ctx.replacer({ type: 'readablestream', value: '[ReadableStream]' })
    }

    if (isGenerator(value)) {
        return ctx.replacer({ type: 'generator', value: '[Generator]' })
    }

    return undefined
}
