import type { SerializeOptions } from '@/serializer/types'
import { describe, expect, it } from 'bun:test'
import { createContext, DEFAULT_REPLACER } from '@/serializer/context'

describe('createContext', () => {
    it('creates context with default options (no args)', () => {
        const ctx = createContext()

        expect(ctx.maxDepth).toBe(Number.POSITIVE_INFINITY)
        expect(ctx.onUnserializable).toBe(false)
        expect(ctx.replacer).toBe(DEFAULT_REPLACER)
        expect(ctx.onCircularRef).toBe('placeholder')
        expect(ctx.onMaxDepth).toBe('placeholder')
        expect(ctx.onPropertyAccess).toBe('placeholder')
        expect(ctx.depth).toBe(0)
        expect(ctx.visited.size).toBe(0)
        expect(typeof ctx.symbolRegistry).toBe('function')
    })

    it('creates context with empty options object', () => {
        const ctx = createContext({})

        expect(ctx.maxDepth).toBe(Number.POSITIVE_INFINITY)
        expect(ctx.onUnserializable).toBe(false)
        expect(ctx.replacer).toBe(DEFAULT_REPLACER)
    })

    it('sets maxDepth from options', () => {
        const ctx = createContext({ maxDepth: 5 })
        expect(ctx.maxDepth).toBe(5)
    })

    it('defaults maxDepth to Infinity', () => {
        const ctx = createContext()
        expect(ctx.maxDepth).toBe(Number.POSITIVE_INFINITY)
    })

    it('sets replacer from options', () => {
        const custom = () => 'custom' as never
        const ctx = createContext({ replacer: custom })
        expect(ctx.replacer).toBe(custom)
    })

    it('defaults replacer to DEFAULT_REPLACER', () => {
        const ctx = createContext()
        expect(ctx.replacer).toBe(DEFAULT_REPLACER)
    })

    it('sets onUnserializable from options', () => {
        const handler = () => 'handled' as never
        const ctx = createContext({ onUnserializable: handler })
        expect(ctx.onUnserializable).toBe(handler)
    })

    it('onError string sets all three strategies', () => {
        const ctx = createContext({ onError: 'throw' })

        expect(ctx.onCircularRef).toBe('throw')
        expect(ctx.onMaxDepth).toBe('throw')
        expect(ctx.onPropertyAccess).toBe('throw')
    })

    it('onError object extracts per-case strategies', () => {
        const ctx = createContext({
            onError: { circularRef: 'throw', maxDepth: 'omit', propertyAccess: 'placeholder' },
        })

        expect(ctx.onCircularRef).toBe('throw')
        expect(ctx.onMaxDepth).toBe('omit')
        expect(ctx.onPropertyAccess).toBe('placeholder')
    })

    it('onError object with partial overrides defaults missing to placeholder', () => {
        const ctx = createContext({ onError: { circularRef: 'throw' } })

        expect(ctx.onCircularRef).toBe('throw')
        expect(ctx.onMaxDepth).toBe('placeholder')
        expect(ctx.onPropertyAccess).toBe('placeholder')
    })

    it('onError undefined defaults all to placeholder', () => {
        const ctx = createContext({ onError: undefined })

        expect(ctx.onCircularRef).toBe('placeholder')
        expect(ctx.onMaxDepth).toBe('placeholder')
        expect(ctx.onPropertyAccess).toBe('placeholder')
    })

    it('onError null defaults all to placeholder', () => {
        const ctx = createContext({ onError: null } as unknown as SerializeOptions)

        expect(ctx.onCircularRef).toBe('placeholder')
        expect(ctx.onMaxDepth).toBe('placeholder')
        expect(ctx.onPropertyAccess).toBe('placeholder')
    })

    it('creates fresh visited Set (empty)', () => {
        const ctx = createContext()
        expect(ctx.visited).toBeInstanceOf(Set)
        expect(ctx.visited.size).toBe(0)
    })

    it('depth starts at 0', () => {
        const ctx = createContext()
        expect(ctx.depth).toBe(0)
    })

    it('symbolRegistry is a function', () => {
        const ctx = createContext()
        expect(typeof ctx.symbolRegistry).toBe('function')
    })
})

describe('DEFAULT_REPLACER', () => {
    it('adds __serialized__: true to value', () => {
        const result = DEFAULT_REPLACER({ type: 'test', value: 'val' })
        expect(result).toHaveProperty('__serialized__', true)
    })

    it('preserves type and value fields', () => {
        const result = DEFAULT_REPLACER({ type: 'MyType', value: 42 }) as Record<string, unknown>

        expect(result.type).toBe('MyType')
        expect(result.value).toBe(42)
    })

    it('preserves metadata field', () => {
        const metadata = { key: 'info' }
        const result = DEFAULT_REPLACER({ metadata, type: 'T', value: 'v' }) as Record<string, unknown>

        expect(result.metadata).toEqual({ key: 'info' })
    })
})
