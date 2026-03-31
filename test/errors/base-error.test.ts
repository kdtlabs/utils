import { describe, expect, it } from 'bun:test'
import { BaseError } from '@/errors/base-error'

class HttpError extends BaseError {
    public constructor(message: string, options?: ConstructorParameters<typeof BaseError>[1]) {
        super(message, options)
    }
}

describe('BaseError', () => {
    describe('constructor', () => {
        it('creates an error with message only', () => {
            const err = new BaseError('boom')

            expect(err.message).toBe('boom')
            expect(err.name).toBe('BaseError')
            expect(err.timestamp).toBeInstanceOf(Date)
            expect(err.code).toBeUndefined()
            expect(err.cause).toBeUndefined()
            expect(err.details).toBeUndefined()
            expect(err.exitCode).toBeUndefined()
            expect(err.retryable).toBeUndefined()
        })

        it('creates an error with all options', () => {
            const cause = new Error('root')
            const ts = new Date('2025-01-01')

            const err = new BaseError('boom', {
                cause,
                code: 'ERR_001',
                details: 'something broke',
                exitCode: 1,
                name: 'CustomError',
                retryable: true,
                timestamp: ts,
            })

            expect(err.message).toBe('boom')
            expect(err.name).toBe('CustomError')
            expect(err.timestamp).toBe(ts)
            expect(err.code).toBe('ERR_001')
            expect(err.cause).toBe(cause)
            expect(err.details).toBe('something broke')
            expect(err.exitCode).toBe(1)
            expect(err.retryable).toBe(true)
        })

        it('accepts numeric code', () => {
            const err = new BaseError('boom', { code: 404 })

            expect(err.code).toBe(404)
        })

        it('defaults name to constructor name', () => {
            expect(new BaseError('x').name).toBe('BaseError')
            expect(new HttpError('x').name).toBe('HttpError')
        })

        it('allows overriding name via options', () => {
            const err = new BaseError('x', { name: 'MyError' })

            expect(err.name).toBe('MyError')
        })

        it('auto-generates timestamp when not provided', () => {
            const before = new Date()
            const err = new BaseError('x')
            const after = new Date()

            expect(err.timestamp.getTime()).toBeGreaterThanOrEqual(before.getTime())
            expect(err.timestamp.getTime()).toBeLessThanOrEqual(after.getTime())
        })

        it('accepts custom timestamp', () => {
            const ts = new Date('2000-01-01')
            const err = new BaseError('x', { timestamp: ts })

            expect(err.timestamp).toBe(ts)
        })

        it('sets retryable to false without treating it as undefined', () => {
            const err = new BaseError('x', { retryable: false })

            expect(err.retryable).toBe(false)
        })

        it('sets exitCode to 0 without treating it as undefined', () => {
            const err = new BaseError('x', { exitCode: 0 })

            expect(err.exitCode).toBe(0)
        })

        it('sets code to empty string without treating it as undefined', () => {
            const err = new BaseError('x', { code: '' })

            expect(err.code).toBe('')
        })
    })

    describe('instanceof', () => {
        it('is instanceof Error', () => {
            expect(new BaseError('x')).toBeInstanceOf(Error)
        })

        it('is instanceof BaseError', () => {
            expect(new BaseError('x')).toBeInstanceOf(BaseError)
        })

        it('subclass is instanceof BaseError', () => {
            expect(new HttpError('x')).toBeInstanceOf(BaseError)
        })

        it('subclass is instanceof Error', () => {
            expect(new HttpError('x')).toBeInstanceOf(Error)
        })

        it('subclass is instanceof its own class', () => {
            expect(new HttpError('x')).toBeInstanceOf(HttpError)
        })
    })

    describe('stack trace', () => {
        it('has a stack trace', () => {
            const err = new BaseError('x')

            expect(err.stack).toBeDefined()
            expect(err.stack).toContain('BaseError: x')
        })

        it('subclass stack contains subclass name', () => {
            const err = new HttpError('x')

            expect(err.stack).toContain('HttpError: x')
        })
    })

    describe('immutability', () => {
        it('name is non-writable', () => {
            const err = new BaseError('x')

            expect(() => {
                (err as any).name = 'other'
            }).toThrow(TypeError)
        })

        it('timestamp is non-writable', () => {
            const err = new BaseError('x')

            expect(() => {
                (err as any).timestamp = new Date()
            }).toThrow(TypeError)
        })

        it('code is non-writable when set', () => {
            const err = new BaseError('x', { code: 'A' })

            expect(() => {
                (err as any).code = 'B'
            }).toThrow(TypeError)
        })

        it('cause is non-writable when set', () => {
            const cause = new Error('root')
            const err = new BaseError('x', { cause })

            expect(() => {
                (err as any).cause = new Error('other')
            }).toThrow(TypeError)
        })

        it('details is non-writable when set', () => {
            const err = new BaseError('x', { details: 'info' })

            expect(() => {
                (err as any).details = 'other'
            }).toThrow(TypeError)
        })

        it('exitCode is non-writable when set', () => {
            const err = new BaseError('x', { exitCode: 1 })

            expect(() => {
                (err as any).exitCode = 2
            }).toThrow(TypeError)
        })

        it('retryable is non-writable when set', () => {
            const err = new BaseError('x', { retryable: true })

            expect(() => {
                (err as any).retryable = false
            }).toThrow(TypeError)
        })

        it('properties set via withValue are non-writable', () => {
            const err = new BaseError('x').withValue('foo', 42)

            expect(() => {
                (err as any).foo = 99
            }).toThrow(TypeError)
        })
    })

    describe('withValue', () => {
        it('attaches a custom property', () => {
            const err = new BaseError('x').withValue('statusCode', 404)

            expect(err.statusCode).toBe(404)
        })

        it('supports fluent chaining', () => {
            const err = new BaseError('x')
                .withValue('statusCode', 404)
                .withValue('body', { error: 'not found' })
                .withValue('url', '/api/users')

            expect(err.statusCode).toBe(404)
            expect(err.body).toEqual({ error: 'not found' })
            expect(err.url).toBe('/api/users')
        })

        it('throws TypeError when redefining an existing property', () => {
            const err = new BaseError('x').withValue('statusCode', 404)

            expect(() => err.withValue('statusCode', 500)).toThrow(TypeError)
            expect(() => err.withValue('statusCode', 500)).toThrow(/Cannot redefine property 'statusCode'/u)
        })

        it('throws TypeError when redefining a constructor property', () => {
            const err = new BaseError('x', { code: 'ERR' })

            expect(() => err.withValue('code', 'NEW')).toThrow(TypeError)
            expect(() => err.withValue('code', 'NEW')).toThrow(/Cannot redefine property 'code'/u)
        })

        it('throws TypeError when redefining name', () => {
            expect(() => new BaseError('x').withValue('name', 'other')).toThrow(TypeError)
        })

        it('throws TypeError when redefining timestamp', () => {
            expect(() => new BaseError('x').withValue('timestamp', new Date())).toThrow(TypeError)
        })

        it('defines property even when value is undefined', () => {
            const err = new BaseError('x').withValue('foo', undefined)
            const descriptor = Object.getOwnPropertyDescriptor(err, 'foo')

            expect(descriptor).toBeDefined()
            expect(descriptor!.value).toBeUndefined()
        })

        it('creates own property for undefined value', () => {
            const err = new BaseError('x').withValue('key', undefined)

            expect(Object.hasOwn(err, 'key')).toBe(true)
        })

        it('allows null as a value', () => {
            const err = new BaseError('x').withValue('body', null)

            expect(err.body).toBeNull()
        })

        it('allows false as a value', () => {
            const err = new BaseError('x').withValue('cached', false)

            expect(err.cached).toBe(false)
        })

        it('allows 0 as a value', () => {
            const err = new BaseError('x').withValue('retryCount', 0)

            expect(err.retryCount).toBe(0)
        })

        it('allows empty string as a value', () => {
            const err = new BaseError('x').withValue('tag', '')

            expect(err.tag).toBe('')
        })

        it('custom properties are enumerable', () => {
            const err = new BaseError('x')
                .withValue('statusCode', 404)
                .withValue('body', 'not found')

            const keys = Object.keys(err)

            expect(keys).toContain('statusCode')
            expect(keys).toContain('body')
        })

        it('error message includes error name', () => {
            const err = new HttpError('x', { code: 'ERR' })

            expect(() => err.withValue('code', 'NEW')).toThrow(/HttpError/u)
        })
    })

    describe('cause without withValue', () => {
        it('sets cause own property even when cause is undefined', () => {
            const err = new BaseError('x')
            const descriptor = Object.getOwnPropertyDescriptor(err, 'cause')

            expect(descriptor).toBeDefined()
            expect(descriptor?.value).toBeUndefined()
            expect(descriptor?.writable).toBe(false)
        })

        it('sets cause as immutable when provided', () => {
            const cause = new Error('root')
            const err = new BaseError('x', { cause })
            const descriptor = Object.getOwnPropertyDescriptor(err, 'cause')

            expect(descriptor?.writable).toBe(false)
            expect(descriptor?.configurable).toBe(false)
        })
    })

    describe('enumerable properties', () => {
        it('constructor properties are enumerable', () => {
            const err = new BaseError('x', { code: 'A', details: 'info', exitCode: 1, retryable: true })
            const keys = Object.keys(err)

            expect(keys).toContain('name')
            expect(keys).toContain('timestamp')
            expect(keys).toContain('code')
            expect(keys).toContain('details')
            expect(keys).toContain('exitCode')
            expect(keys).toContain('retryable')
        })

        it('all properties appear in keys regardless of value', () => {
            const err = new BaseError('x')
            const keys = Object.keys(err)

            expect(keys).toContain('name')
            expect(keys).toContain('timestamp')
            expect(keys).toContain('code')
            expect(keys).toContain('details')
            expect(keys).toContain('exitCode')
            expect(keys).toContain('retryable')
            expect(keys).toContain('cause')
        })
    })

    describe('subclass behavior', () => {
        it('inherits withValue', () => {
            const err = new HttpError('fail').withValue('statusCode', 500)

            expect(err.statusCode).toBe(500)
            expect(err).toBeInstanceOf(HttpError)
        })

        it('passes options through to BaseError', () => {
            const err = new HttpError('fail', { code: 'HTTP_500', retryable: true })

            expect(err.code).toBe('HTTP_500')
            expect(err.retryable).toBe(true)
        })
    })
})
