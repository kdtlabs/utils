import type { Jsonable } from '@/core/types'
import type { SerializeOptions } from '@/serializer/types'
import { describe, expect, it } from 'bun:test'
import { serialize } from '@/index'
import { SERIALIZE } from '@/serializer/constants'

class CustomToJson {
    public toJSON() {
        return { serialized: true }
    }
}

class MyIterable {
    public * [Symbol.iterator]() {
        yield 1
        yield 2
        yield 3
    }
}

describe('serialize', () => {
    // ──────────────────────────────────────────
    // Circular references
    // ──────────────────────────────────────────
    describe('circular references', () => {
        it('detects self-reference in object', () => {
            const obj: Record<string, unknown> = { a: 1 }
            obj.self = obj
            const result = serialize(obj) as Record<string, unknown>
            expect((result.self as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('detects deep circular reference (A → B → A)', () => {
            const a: Record<string, unknown> = {}
            const b: Record<string, unknown> = { parent: a }
            a.child = b
            const result = serialize(a) as Record<string, unknown>
            const child = result.child as Record<string, unknown>
            expect((child.parent as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('detects 3-level circular reference (A → B → C → A)', () => {
            const a: Record<string, unknown> = {}
            const b: Record<string, unknown> = {}
            const c: Record<string, unknown> = { ref: a }
            a.b = b
            b.c = c
            const result = serialize(a) as Record<string, unknown>
            const bResult = result.b as Record<string, unknown>
            const cResult = bResult.c as Record<string, unknown>
            expect((cResult.ref as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('does NOT false-positive on shared references', () => {
            const shared = { x: 1 }
            const result = serialize({ a: shared, b: shared }) as Record<string, unknown>
            expect(result.a).toEqual({ x: 1 })
            expect(result.b).toEqual({ x: 1 })
        })

        it('does NOT false-positive on shared references across sibling arrays', () => {
            const shared = { val: 42 }
            const result = serialize([[shared], [shared]]) as unknown[][]
            expect(result[0]![0]).toEqual({ val: 42 })
            expect(result[1]![0]).toEqual({ val: 42 })
        })

        it('detects circular reference inside array', () => {
            const obj: Record<string, unknown> = {}
            obj.self = obj
            const result = serialize([obj]) as unknown[]
            const item = result[0] as Record<string, unknown>
            expect((item.self as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('detects circular ref in Map value', () => {
            const obj: Record<string, unknown> = {}
            obj.self = obj
            const map = new Map([['ref', obj]])
            const result = serialize(map) as Record<string, unknown>
            const pairs = result.value as unknown[][]
            const pair = pairs[0]!
            const mapObj = pair[1] as Record<string, unknown>
            expect((mapObj.self as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('detects circular ref in Set', () => {
            const obj: Record<string, unknown> = { a: 1 }
            obj.self = obj
            const set = new Set([obj])
            const result = serialize(set) as Record<string, unknown>
            const items = result.value as Array<Record<string, unknown>>
            const item = items[0]!
            expect((item.self as Record<string, unknown>).type).toBe('circular-ref')
        })
    })

    // ──────────────────────────────────────────
    // Custom [SERIALIZE]()
    // ──────────────────────────────────────────
    describe('custom [SERIALIZE]()', () => {
        it('calls custom serialize method', () => {
            const obj = { internal: 'hidden', [SERIALIZE]: () => ({ status: 'ok' }) }
            const result = serialize(obj)
            expect(result).toEqual({ status: 'ok' })
        })

        it('recursively serializes custom method result', () => {
            const obj = { [SERIALIZE]: () => ({ date: new Date('2026-01-01T00:00:00Z') }) }
            const result = serialize(obj) as Record<string, unknown>
            expect((result.date as Record<string, unknown>).type).toBe('date')
        })

        it('self-referencing [SERIALIZE]() produces circular ref', () => {
            const obj: Record<PropertyKey, unknown> = {}
            obj[SERIALIZE] = () => obj
            const result = serialize(obj) as Record<string, unknown>
            expect(result.type).toBe('circular-ref')
        })

        it('[SERIALIZE]() returning primitive', () => {
            const obj = { [SERIALIZE]: () => 42 }
            expect(serialize(obj)).toBe(42)
        })

        it('[SERIALIZE]() returning null', () => {
            const obj = { [SERIALIZE]: () => null }
            expect(serialize(obj)).toBe(null)
        })

        it('[SERIALIZE]() returning undefined wraps as serialized', () => {
            const obj = { [SERIALIZE]: () => {} }
            const result = serialize(obj) as Record<string, unknown>
            expect(result.type).toBe('undefined')
        })

        it('[SERIALIZE]() returning nested complex structure', () => {
            const obj = {
                [SERIALIZE]: () => ({
                    list: [1, 2n, Symbol('x')],
                    nested: { date: new Date('2026-01-01T00:00:00Z') },
                }),
            }

            const result = serialize(obj) as Record<string, unknown>
            const nested = result.nested as Record<string, unknown>
            expect((nested.date as Record<string, unknown>).type).toBe('date')
            const list = result.list as unknown[]
            expect(list[0]).toBe(1)
            expect((list[1] as Record<string, unknown>).type).toBe('bigint')
            expect((list[2] as Record<string, unknown>).type).toBe('symbol')
        })

        it('[SERIALIZE]() takes priority over toJSON', () => {
            const obj = {
                [SERIALIZE]: () => 'custom-wins',
                toJSON: () => 'toJSON-result',
            }

            expect(serialize(obj)).toBe('custom-wins')
        })
    })

    // ──────────────────────────────────────────
    // toJSON
    // ──────────────────────────────────────────
    describe('toJSON', () => {
        it('calls toJSON on non-matched objects', () => {
            const result = serialize(new CustomToJson())
            expect(result).toEqual({ serialized: true })
        })

        it('recursively serializes toJSON result', () => {
            class WithToJson {
                public toJSON() {
                    return { date: new Date('2026-01-01T00:00:00Z') }
                }
            }

            const result = serialize(new WithToJson()) as Record<string, unknown>
            expect((result.date as Record<string, unknown>).type).toBe('date')
        })

        it('toJSON returning primitive', () => {
            class Prim {
                public toJSON() {
                    return 42
                }
            }

            expect(serialize(new Prim())).toBe(42)
        })
    })

    // ──────────────────────────────────────────
    // Generic iterable
    // ──────────────────────────────────────────
    describe('generic iterable', () => {
        it('serializes custom iterable with metadata.name', () => {
            const result = serialize(new MyIterable()) as Record<string, unknown>
            expect(result.type).toBe('iterable')
            expect(result.value).toEqual([1, 2, 3])
            const metadata = result.metadata as Record<string, unknown>
            expect(metadata.name).toBe('MyIterable')
        })

        it('serializes iterable with complex elements', () => {
            class DateIterable {
                public * [Symbol.iterator]() {
                    yield new Date('2026-01-01T00:00:00Z')
                    yield 42n
                }
            }

            const result = serialize(new DateIterable()) as Record<string, unknown>
            const items = result.value as Array<Record<string, unknown>>
            expect(items[0]!.type).toBe('date')
            expect(items[1]!.type).toBe('bigint')
        })

        it('serializes empty iterable', () => {
            class EmptyIterable {
                public * [Symbol.iterator]() {
                    // yields nothing
                }
            }

            const result = serialize(new EmptyIterable()) as Record<string, unknown>
            expect(result.type).toBe('iterable')
            expect(result.value).toEqual([])
        })

        it('serializes iterable without constructor name', () => {
            const proto = {
                [Symbol.iterator]: function * () {
                    yield 42
                },
            }

            const iterable = Object.create(proto)
            Object.defineProperty(iterable, 'constructor', { value: undefined })

            const result = serialize(iterable) as Record<string, unknown>
            expect(result.type).toBe('iterable')
            expect(result.value).toEqual([42])
            expect((result.metadata as Record<string, Jsonable>).name).toBeUndefined()
        })
    })

    // ──────────────────────────────────────────
    // Options: maxDepth
    // ──────────────────────────────────────────
    describe('options — maxDepth', () => {
        it('respects maxDepth', () => {
            const deep = { a: { b: { c: 1 } } }
            const result = serialize(deep, { maxDepth: 2 }) as Record<string, unknown>
            const a = result.a as Record<string, unknown>
            expect((a.b as Record<string, unknown>).type).toBe('max-depth')
        })

        it('maxDepth 0 blocks all compound types', () => {
            const result = serialize({ a: 1 }, { maxDepth: 0 }) as Record<string, unknown>
            expect(result.type).toBe('max-depth')
        })

        it('maxDepth does not affect primitives', () => {
            expect(serialize(42, { maxDepth: 0 })).toBe(42)
            expect(serialize('hello', { maxDepth: 0 })).toBe('hello')
            expect(serialize(null, { maxDepth: 0 })).toBe(null)
            expect(serialize(true, { maxDepth: 0 })).toBe(true)
        })

        it('maxDepth does not affect leaf objects', () => {
            const opts: SerializeOptions = { maxDepth: 0 }
            expect((serialize(new Date('2026-01-01T00:00:00Z'), opts) as Record<string, unknown>).type).toBe('date')
            expect((serialize(/abc/u, opts) as Record<string, unknown>).type).toBe('regexp')
            expect((serialize(new URL('https://x.com'), opts) as Record<string, unknown>).type).toBe('url')
        })

        it('maxDepth 1 serializes top-level but not nested', () => {
            const result = serialize({ nested: { deep: true } }, { maxDepth: 1 }) as Record<string, unknown>
            expect((result.nested as Record<string, unknown>).type).toBe('max-depth')
        })

        it('maxDepth with throw strategy', () => {
            expect(() => serialize({ a: 1 }, { maxDepth: 0, onError: { maxDepth: 'throw' } })).toThrow('[Max Depth]')
        })

        it('maxDepth with omit strategy on object property', () => {
            const result = serialize({ deep: { nested: true }, shallow: 1 }, { maxDepth: 1, onError: { maxDepth: 'omit' } }) as Record<string, unknown>
            expect(result.shallow).toBe(1)
            expect('deep' in result).toBe(false)
        })

        it('maxDepth with deeply nested (10+ levels)', () => {
            let obj: Record<string, unknown> = { leaf: true }

            for (let i = 0; i < 10; i++) {
                obj = { child: obj }
            }

            const result = serialize(obj, { maxDepth: 5 }) as Record<string, unknown>
            let current = result

            for (let i = 0; i < 4; i++) {
                current = current.child as Record<string, unknown>
            }

            expect((current.child as Record<string, unknown>).type).toBe('max-depth')
        })
    })

    // ──────────────────────────────────────────
    // Options: onError strategies
    // ──────────────────────────────────────────
    describe('options — onError strategies', () => {
        it('onError string applies to all error types', () => {
            const obj: Record<string, unknown> = {}
            obj.self = obj
            expect(() => serialize(obj, { onError: 'throw' })).toThrow()
        })

        it('onError omit strategy for circular ref omits the property', () => {
            const obj: Record<string, unknown> = { a: 1 }
            obj.self = obj
            const result = serialize(obj, { onError: 'omit' }) as Record<string, unknown>
            expect(result.a).toBe(1)
            expect('self' in result).toBe(false)
        })

        it('onError per-case override — circularRef throw while maxDepth placeholder', () => {
            const obj: Record<string, unknown> = {}
            obj.self = obj
            expect(() => serialize(obj, { onError: { circularRef: 'throw', maxDepth: 'placeholder' } })).toThrow()
        })

        it('onError per-case override — maxDepth throw while circularRef placeholder', () => {
            expect(() => serialize({ a: 1 }, { maxDepth: 0, onError: { circularRef: 'placeholder', maxDepth: 'throw' } })).toThrow()
        })

        it('onError per-case with partial overrides uses placeholder as default', () => {
            const obj: Record<string, unknown> = {}
            obj.self = obj
            const result = serialize(obj, { onError: { maxDepth: 'throw' } }) as Record<string, unknown>
            expect((result.self as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('top-level omit normalizes to null', () => {
            const result = serialize({ a: 1 }, { maxDepth: 0, onError: 'omit' })
            expect(result).toBe(null)
        })

        it('handles onError: null without crashing', () => {
            const opts = { onError: null } as unknown as SerializeOptions
            expect(() => serialize({ a: 1 }, opts)).not.toThrow()
        })

        it('handles onError: undefined without crashing', () => {
            expect(() => serialize({ a: 1 }, { onError: undefined })).not.toThrow()
        })
    })

    // ──────────────────────────────────────────
    // Options: replacer
    // ──────────────────────────────────────────
    describe('options — replacer', () => {
        it('custom replacer transforms serialized values', () => {
            const result = serialize(42n, {
                replacer: (v) => ({ ...v, custom: true }),
            }) as Record<string, unknown>

            expect(result.custom).toBe(true)
            expect(result.type).toBe('bigint')
        })

        it('custom replacer removes __serialized__ marker', () => {
            const result = serialize(undefined, {
                replacer: (v) => v,
            }) as Record<string, unknown>

            expect(result.__serialized__).toBeUndefined()
            expect(result.type).toBe('undefined')
        })

        it('custom replacer applied to every serialized value', () => {
            const types: string[] = []

            serialize([undefined, 42n, Symbol('s')], {
                replacer: (v) => {
                    types.push(v.type)

                    return { ...v, __serialized__: true }
                },
            })

            expect(types).toContain('undefined')
            expect(types).toContain('bigint')
            expect(types).toContain('symbol')
        })
    })

    // ──────────────────────────────────────────
    // Options: onUnserializable
    // ──────────────────────────────────────────
    describe('options — onUnserializable', () => {
        it('onUnserializable callback', () => {
            class Exotic {}

            const result = serialize(new Exotic(), {
                onUnserializable: (v) => ({ type: 'custom', value: String(v) }),
            }) as Record<string, unknown>

            expect(result.type).toBe('custom')
        })

        it('default placeholder for unserializable', () => {
            class Exotic {}

            const result = serialize(new Exotic()) as Record<string, unknown>
            expect(result.__serialized__).toBe(true)
            expect(result.type).toBeDefined()
        })

        it('onUnserializable false uses default placeholder', () => {
            class Exotic {}

            const result = serialize(new Exotic(), { onUnserializable: false }) as Record<string, unknown>
            expect(result.__serialized__).toBe(true)
        })

        it('unserializable without constructor name', () => {
            const obj = Object.create(null)
            Object.defineProperty(obj, Symbol.iterator, { value: undefined })
            const result = serialize(obj) as Record<string, unknown>
            expect(result).toBeDefined()
        })
    })

    // ──────────────────────────────────────────
    // Deep nesting & mixed types
    // ──────────────────────────────────────────
    describe('deep nesting and mixed types', () => {
        it('serializes object containing array containing Map containing Set containing Error', () => {
            const error = new Error('deep')
            const set = new Set([error])
            const map = new Map([['s', set]])
            const arr = [map]
            const obj = { data: arr }

            const result = serialize(obj) as Record<string, unknown>
            const dataArr = result.data as unknown[]
            const mapResult = dataArr[0] as Record<string, unknown>
            expect(mapResult.type).toBe('map')
            const pairs = mapResult.value as unknown[][]
            const setResult = pairs[0]![1] as Record<string, unknown>
            expect(setResult.type).toBe('set')
            const setItems = setResult.value as Array<Record<string, unknown>>
            const errResult = setItems[0]!
            expect(errResult.type).toBe('error')
            expect((errResult.value as Record<string, unknown>).message).toBe('deep')
        })

        it('serializes deeply nested object with all primitive types', () => {
            const obj = {
                level1: {
                    level2: {
                        big: 42n,
                        bool: true,
                        n: null,
                        nan: Number.NaN,
                        num: 3.14,
                        str: 'leaf',
                        sym: Symbol('deep'),
                        undef: undefined,
                    },
                },
            }

            const result = serialize(obj) as Record<string, unknown>
            const l1 = result.level1 as Record<string, unknown>
            const l2 = l1.level2 as Record<string, unknown>
            expect(l2.str).toBe('leaf')
            expect(l2.num).toBe(3.14)
            expect(l2.bool).toBe(true)
            expect(l2.n).toBe(null)
            expect((l2.nan as Record<string, unknown>).type).toBe('number')
            expect((l2.big as Record<string, unknown>).type).toBe('bigint')
            expect((l2.sym as Record<string, unknown>).type).toBe('symbol')
            expect((l2.undef as Record<string, unknown>).type).toBe('undefined')
        })

        it('serializes array of diverse types', () => {
            const result = serialize([
                1,
                'str',
                true,
                null,
                undefined,
                42n,
                Symbol('x'),
                new Date('2026-01-01T00:00:00Z'),
                /test/u,
                new URL('https://x.com'),
                new Map([['a', 1]]),
                new Set([1]),
                new Uint8Array([1]),
                new Blob(['data']),
                new Error('e'),
                { nested: true },
                [1, 2],
                Promise.resolve(1),
            ]) as unknown[]

            expect(result.length).toBe(18)
            expect(result[0]).toBe(1)
            expect(result[1]).toBe('str')
            expect(result[2]).toBe(true)
            expect(result[3]).toBe(null)
            expect((result[4] as Record<string, unknown>).type).toBe('undefined')
            expect((result[5] as Record<string, unknown>).type).toBe('bigint')
            expect((result[6] as Record<string, unknown>).type).toBe('symbol')
            expect((result[7] as Record<string, unknown>).type).toBe('date')
            expect((result[8] as Record<string, unknown>).type).toBe('regexp')
            expect((result[9] as Record<string, unknown>).type).toBe('url')
            expect((result[10] as Record<string, unknown>).type).toBe('map')
            expect((result[11] as Record<string, unknown>).type).toBe('set')
            expect((result[12] as Record<string, unknown>).type).toBe('uint8array')
            expect((result[13] as Record<string, unknown>).type).toBe('blob')
            expect((result[14] as Record<string, unknown>).type).toBe('error')
            expect(result[15]).toEqual({ nested: true })
            expect(result[16]).toEqual([1, 2])
            expect((result[17] as Record<string, unknown>).type).toBe('promise')
        })

        it('multiple circular refs in same object are independent', () => {
            const a: Record<string, unknown> = {}
            const b: Record<string, unknown> = {}
            a.ref = a
            b.ref = b
            const result = serialize({ a, b }) as Record<string, unknown>
            const aResult = result.a as Record<string, unknown>
            const bResult = result.b as Record<string, unknown>
            expect((aResult.ref as Record<string, unknown>).type).toBe('circular-ref')
            expect((bResult.ref as Record<string, unknown>).type).toBe('circular-ref')
        })

        it('shared object across different nesting paths is not falsely circular', () => {
            const shared = { value: 42 }

            const obj = {
                arr: [shared],
                direct: shared,
                map: new Map([['k', shared]]),
            }

            const result = serialize(obj) as Record<string, unknown>
            expect(result.direct).toEqual({ value: 42 })
            expect((result.arr as unknown[])[0]).toEqual({ value: 42 })
            const mapResult = result.map as Record<string, unknown>
            const pairs = mapResult.value as unknown[][]
            expect(pairs[0]![1]).toEqual({ value: 42 })
        })
    })

    // ──────────────────────────────────────────
    // No options (defaults)
    // ──────────────────────────────────────────
    describe('default behavior', () => {
        it('serialize with no options', () => {
            const result = serialize({ a: 1 })
            expect(result).toEqual({ a: 1 })
        })

        it('serialize with empty options', () => {
            const result = serialize({ a: 1 }, {})
            expect(result).toEqual({ a: 1 })
        })
    })
})
