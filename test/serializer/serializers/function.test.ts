import { describe, expect, it } from 'bun:test'
import { serializeFunction } from '@/serializer/serializers/function'
import { createTestContext } from '../helpers'

async function asyncFn() {}

// eslint-disable-next-line @typescript-eslint/require-await
async function * asyncGenFn() {
    yield 1
}

function * genFn() {
    yield 1
}

const arrowFn = (a: number, b: number) => a + b

function namedThenCleared() {}

describe('serializeFunction', () => {
    it('serializes named function', () => {
        const ctx = createTestContext()
        const result = serializeFunction(asyncFn, ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'function',
            value: { length: 0, name: 'asyncFn' },
        }))
    })

    it('serializes arrow function', () => {
        const ctx = createTestContext()
        const result = serializeFunction(arrowFn as (...args: unknown[]) => unknown, ctx)

        expect(result).toEqual(expect.objectContaining({
            type: 'function',
            value: { length: 2, name: 'arrowFn' },
        }))
    })

    it('serializes async function with async metadata', () => {
        const ctx = createTestContext()
        const result = serializeFunction(asyncFn, ctx)

        expect(result).toEqual(expect.objectContaining({
            metadata: expect.objectContaining({ async: true }),
        }))
    })

    it('serializes generator function with generator metadata', () => {
        const ctx = createTestContext()
        const result = serializeFunction(genFn as unknown as (...args: unknown[]) => unknown, ctx)

        expect(result).toEqual(expect.objectContaining({
            metadata: expect.objectContaining({ generator: true }),
        }))
    })

    it('serializes async generator function with both flags', () => {
        const ctx = createTestContext()
        const result = serializeFunction(asyncGenFn as unknown as (...args: unknown[]) => unknown, ctx)

        expect(result).toEqual(expect.objectContaining({
            metadata: expect.objectContaining({ async: true, generator: true }),
        }))
    })

    it('serializes function with zero length', () => {
        const ctx = createTestContext()
        const result = serializeFunction(asyncFn, ctx)

        expect(result).toEqual(expect.objectContaining({
            value: expect.objectContaining({ length: 0 }),
        }))
    })

    it('uses anonymous for unnamed function', () => {
        const ctx = createTestContext()
        Object.defineProperty(namedThenCleared, 'name', { value: '' })

        const result = serializeFunction(namedThenCleared, ctx)

        expect(result).toEqual(expect.objectContaining({
            value: expect.objectContaining({ name: 'anonymous' }),
        }))
    })
})
