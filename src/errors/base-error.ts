import { notUndefined } from '../core'

export type BaseErrorCode = number | string

export interface BaseErrorOptions extends ErrorOptions {
    cause?: unknown
    code?: BaseErrorCode
    details?: string
    exitCode?: number
    name?: string
    retryable?: boolean
    timestamp?: Date
}

export class BaseError extends Error {
    public declare readonly timestamp: Date
    public declare readonly code?: BaseErrorCode
    public declare readonly cause?: unknown
    public declare readonly details?: string
    public declare readonly exitCode?: number
    public declare readonly retryable?: boolean

    public constructor(message: string, { code, details, exitCode, name, retryable, timestamp, ...options }: BaseErrorOptions = {}) {
        super(message, options)

        Object.setPrototypeOf(this, new.target.prototype)

        this.defineValue('name', name ?? this.constructor.name)
        this.defineValue('timestamp', timestamp ?? new Date())
        this.defineValue('cause', options.cause)
        this.defineValue('code', code)
        this.defineValue('details', details)
        this.defineValue('exitCode', exitCode)
        this.defineValue('retryable', retryable)
    }

    public withValue<K extends string, V>(key: K, value: V): Record<K, V> & this {
        if (Object.hasOwn(this, key)) {
            throw new TypeError(`Cannot redefine property '${key}' on ${this.name}`)
        }

        return this.defineValue(key, value) as Record<K, V> & this
    }

    protected defineValue(key: string, value: unknown) {
        if (notUndefined(value)) {
            Object.defineProperty(this, key, { configurable: false, enumerable: true, value, writable: false })
        }

        return this
    }
}
