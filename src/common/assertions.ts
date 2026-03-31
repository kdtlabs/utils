import { ensureError, type Errorable, type ErrorCtor } from '../errors'

export function assert(condition: unknown, message: Errorable, ctor?: ErrorCtor): asserts condition {
    if (!condition) {
        throw ensureError(message, ctor)
    }
}

export function assertParam(condition: unknown, message: Errorable, ctor?: ErrorCtor): asserts condition {
    assert(condition, message, ctor ?? TypeError)
}
