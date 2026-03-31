import { describe, expect, it } from 'bun:test'
import { createSymbolKeySerializer } from '@/serializer/symbol-registry'

describe('createSymbolKeySerializer', () => {
    it('returns a function', () => {
        expect(typeof createSymbolKeySerializer()).toBe('function')
    })

    it('serializes symbol with description', () => {
        const resolve = createSymbolKeySerializer()
        expect(resolve(Symbol('foo'))).toBe('[Symbol(foo)]')
    })

    it('serializes symbol without description', () => {
        const resolve = createSymbolKeySerializer()
        const result = resolve(Symbol(undefined))
        expect(result).toMatch(/^\[Symbol\(@@\d+\)\]$/u)
    })

    it('serializes symbol with empty string description', () => {
        const resolve = createSymbolKeySerializer()
        const result = resolve(Symbol(''))
        expect(result).toMatch(/^\[Symbol\(@@\d+\)\]$/u)
    })

    it('returns cached result for same symbol', () => {
        const resolve = createSymbolKeySerializer()
        const sym = Symbol('test')
        expect(resolve(sym)).toBe(resolve(sym))
    })

    it('produces unique keys for symbols with same description', () => {
        const resolve = createSymbolKeySerializer()
        const a = resolve(Symbol('dup'))
        const b = resolve(Symbol('dup'))
        const c = resolve(Symbol('dup'))

        expect(a).toBe('[Symbol(dup)]')
        expect(b).not.toBe(a)
        expect(c).not.toBe(a)
        expect(c).not.toBe(b)
    })

    it('produces continuous suffix sequence (no off-by-one)', () => {
        const resolve = createSymbolKeySerializer()
        const results = Array.from({ length: 4 }, () => resolve(Symbol('x')))

        expect(results[0]).toBe('[Symbol(x)]')
        expect(results[1]).toContain('@@')
        expect(results[2]).toContain('@@')
        expect(results[3]).toContain('@@')

        const unique = new Set(results)
        expect(unique.size).toBe(4)
    })

    it('handles Symbol.for() without crashing', () => {
        const resolve = createSymbolKeySerializer()
        expect(() => resolve(Symbol.for('registered'))).not.toThrow()
        expect(resolve(Symbol.for('registered'))).toBe('[Symbol(registered)]')
    })

    it('caches Symbol.for() results', () => {
        const resolve = createSymbolKeySerializer()
        expect(resolve(Symbol.for('cached'))).toBe(resolve(Symbol.for('cached')))
    })

    it('does not collide user description with generated suffix', () => {
        const resolve = createSymbolKeySerializer()
        resolve(Symbol('foo'))
        resolve(Symbol('foo'))
        const suffixed = resolve(Symbol('foo'))

        const manual = resolve(Symbol(suffixed.slice(8, -2)))
        expect(manual).not.toBe(suffixed)
    })

    it('separate instances have independent state', () => {
        const resolve1 = createSymbolKeySerializer()
        const resolve2 = createSymbolKeySerializer()
        const sym = Symbol('independent')

        expect(resolve1(sym)).toBe('[Symbol(independent)]')
        expect(resolve2(sym)).toBe('[Symbol(independent)]')
    })
})
