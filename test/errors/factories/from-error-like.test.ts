import { describe, expect, it } from 'bun:test'
import { fromErrorLike } from '../../../src/errors/factories'

describe('fromErrorLike', () => {
    it('creates Error from ErrorLike object', () => {
        const err = fromErrorLike({ message: 'x', name: 'CustomError', stack: 'at foo' })

        expect(err).toBeInstanceOf(Error)
        expect(err.name).toBe('CustomError')
        expect(err.message).toBe('x')
        expect(err.stack).toBe('at foo')
    })

    it('preserves cause', () => {
        const cause = new Error('root')
        const err = fromErrorLike({ cause, name: 'E' })

        expect(err.cause).toBe(cause)
    })

    it('copies extra properties', () => {
        const err = fromErrorLike({ code: 'ERR_001', name: 'E', statusCode: 404 })

        expect((err as any).code).toBe('ERR_001')
        expect((err as any).statusCode).toBe(404)
    })

    it('uses custom constructor', () => {
        const err = fromErrorLike({ message: 'x', name: 'E' }, TypeError)

        expect(err).toBeInstanceOf(TypeError)
    })

    it('handles ErrorLike with only name', () => {
        const err = fromErrorLike({ name: 'MinimalError' })

        expect(err).toBeInstanceOf(Error)
        expect(err.name).toBe('MinimalError')
    })
})
