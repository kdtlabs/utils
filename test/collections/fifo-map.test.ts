import { describe, expect, it } from 'bun:test'
import { FifoMap } from '@/collections/fifo-map'

describe('FifoMap', () => {
    describe('construction', () => {
        it('creates an empty map without maxSize', () => {
            const map = new FifoMap()

            expect(map.size).toBe(0)
            expect(map.maxSize).toBeUndefined()
        })

        it('creates an empty map with maxSize', () => {
            const map = new FifoMap(3)

            expect(map.size).toBe(0)
            expect(map.maxSize).toBe(3)
        })

        it('throws RangeError for maxSize of 0', () => {
            expect(() => new FifoMap(0)).toThrow(RangeError)
        })

        it('throws RangeError for negative maxSize', () => {
            expect(() => new FifoMap(-1)).toThrow(RangeError)
        })

        it('throws RangeError for non-integer maxSize', () => {
            expect(() => new FifoMap(1.5)).toThrow(RangeError)
        })
    })

    describe('set', () => {
        it('adds a key-value pair', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1)

            expect(map.size).toBe(1)
            expect(map.get('a')).toBe(1)
        })

        it('returns this for chaining', () => {
            const map = new FifoMap<string, number>()

            const result = map.set('a', 1)

            expect(result).toBe(map)
        })

        it('supports chaining multiple set calls', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            expect(map.size).toBe(3)
            expect(map.get('a')).toBe(1)
            expect(map.get('b')).toBe(2)
            expect(map.get('c')).toBe(3)
        })

        it('updates value of existing key without changing position', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('a', 100)

            expect(map.get('a')).toBe(100)
            expect(map.size).toBe(3)
            expect([...map.keys()]).toEqual(['a', 'b', 'c'])
        })
    })

    describe('get', () => {
        it('returns the value for an existing key', () => {
            const map = new FifoMap<string, number>()

            map.set('x', 42)

            expect(map.get('x')).toBe(42)
        })

        it('returns undefined for a non-existing key', () => {
            const map = new FifoMap<string, number>()

            expect(map.get('missing')).toBeUndefined()
        })
    })

    describe('has', () => {
        it('returns true for an existing key', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1)

            expect(map.has('a')).toBe(true)
        })

        it('returns false for a non-existing key', () => {
            const map = new FifoMap<string, number>()

            expect(map.has('a')).toBe(false)
        })
    })

    describe('delete', () => {
        it('removes an existing key and returns true', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            expect(map.delete('a')).toBe(true)
            expect(map.has('a')).toBe(false)
            expect(map.size).toBe(1)
        })

        it('returns false for a non-existing key', () => {
            const map = new FifoMap<string, number>()

            expect(map.delete('missing')).toBe(false)
        })

        it('allows adding a new key after deleting', () => {
            const map = new FifoMap<string, number>(2)

            map.set('a', 1).set('b', 2)
            map.delete('a')
            map.set('c', 3)

            expect(map.size).toBe(2)
            expect(map.has('a')).toBe(false)
            expect(map.has('b')).toBe(true)
            expect(map.has('c')).toBe(true)
        })
    })

    describe('clear', () => {
        it('removes all entries', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)
            map.clear()

            expect(map.size).toBe(0)
            expect(map.has('a')).toBe(false)
            expect(map.has('b')).toBe(false)
            expect(map.has('c')).toBe(false)
        })

        it('allows adding entries after clear', () => {
            const map = new FifoMap<string, number>(2)

            map.set('a', 1).set('b', 2)
            map.clear()
            map.set('c', 3)

            expect(map.size).toBe(1)
            expect(map.get('c')).toBe(3)
        })
    })

    describe('FIFO eviction', () => {
        it('evicts oldest entry when exceeding maxSize', () => {
            const map = new FifoMap<string, number>(2)

            map.set('a', 1).set('b', 2).set('c', 3)

            expect(map.size).toBe(2)
            expect(map.has('a')).toBe(false)
            expect(map.has('b')).toBe(true)
            expect(map.has('c')).toBe(true)
        })

        it('evicts multiple oldest entries as new ones are added', () => {
            const map = new FifoMap<string, number>(2)

            map.set('a', 1).set('b', 2).set('c', 3).set('d', 4)

            expect(map.size).toBe(2)
            expect(map.has('a')).toBe(false)
            expect(map.has('b')).toBe(false)
            expect(map.has('c')).toBe(true)
            expect(map.has('d')).toBe(true)
        })

        it('does not evict when updating an existing key', () => {
            const map = new FifoMap<string, number>(2)

            map.set('a', 1).set('b', 2)
            map.set('a', 100)

            expect(map.size).toBe(2)
            expect(map.has('a')).toBe(true)
            expect(map.has('b')).toBe(true)
        })

        it('does not evict without maxSize', () => {
            const map = new FifoMap<string, number>()

            for (let i = 0; i < 100; i++) {
                map.set(`key-${i}`, i)
            }

            expect(map.size).toBe(100)
        })
    })

    describe('maxSize=1', () => {
        it('keeps only the latest entry', () => {
            const map = new FifoMap<string, number>(1)

            map.set('a', 1)

            expect(map.size).toBe(1)
            expect(map.get('a')).toBe(1)

            map.set('b', 2)

            expect(map.size).toBe(1)
            expect(map.has('a')).toBe(false)
            expect(map.get('b')).toBe(2)
        })

        it('updates value in-place without eviction', () => {
            const map = new FifoMap<string, number>(1)

            map.set('a', 1)

            expect(map.get('a')).toBe(1)

            map.set('a', 99)

            expect(map.size).toBe(1)
            expect(map.get('a')).toBe(99)
        })
    })

    describe('peekOldest', () => {
        it('returns undefined for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect(map.peekOldest()).toBeUndefined()
        })

        it('returns the only entry for a single-item map', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1)

            expect(map.peekOldest()).toEqual(['a', 1])
        })

        it('returns the oldest (first inserted) entry', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            expect(map.peekOldest()).toEqual(['a', 1])
        })
    })

    describe('peekNewest', () => {
        it('returns undefined for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect(map.peekNewest()).toBeUndefined()
        })

        it('returns the only entry for a single-item map', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1)

            expect(map.peekNewest()).toEqual(['a', 1])
        })

        it('returns the newest (last inserted) entry', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            expect(map.peekNewest()).toEqual(['c', 3])
        })
    })

    describe('iteration order', () => {
        it('iterates in insertion order (oldest first)', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            expect([...map]).toEqual([
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ])
        })

        it('preserves order after updating existing key', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('b', 200)

            expect([...map]).toEqual([
                ['a', 1],
                ['b', 200],
                ['c', 3],
            ])
        })
    })

    describe('keys', () => {
        it('yields keys in insertion order', () => {
            const map = new FifoMap<string, number>()

            map.set('x', 10).set('y', 20).set('z', 30)

            expect([...map.keys()]).toEqual(['x', 'y', 'z'])
        })

        it('yields nothing for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect([...map.keys()]).toEqual([])
        })
    })

    describe('values', () => {
        it('yields values in insertion order', () => {
            const map = new FifoMap<string, number>()

            map.set('x', 10).set('y', 20).set('z', 30)

            expect([...map.values()]).toEqual([10, 20, 30])
        })

        it('yields nothing for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect([...map.values()]).toEqual([])
        })
    })

    describe('entries', () => {
        it('yields [key, value] pairs in insertion order', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            expect([...map.entries()]).toEqual([
                ['a', 1],
                ['b', 2],
            ])
        })

        it('yields nothing for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect([...map.entries()]).toEqual([])
        })
    })

    describe('forEach', () => {
        it('calls callback for each entry in insertion order', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            const collected: Array<[string, number]> = []
            const each = map.forEach.bind(map)

            each((value, key) => {
                collected.push([key, value])
            })

            expect(collected).toEqual([
                ['a', 1],
                ['b', 2],
                ['c', 3],
            ])
        })

        it('passes the map as third argument', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1)

            let ref: unknown
            const each = map.forEach.bind(map)

            each((_value, _key, m) => {
                ref = m
            })

            expect(ref).toBe(map)
        })

        it('does not call callback for an empty map', () => {
            const map = new FifoMap<string, number>()
            let called = false
            const each = map.forEach.bind(map)

            each(() => {
                called = true
            })

            expect(called).toBe(false)
        })
    })

    describe('Symbol.iterator', () => {
        it('supports for-of loop in insertion order', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            const collected: Array<[string, number]> = []

            for (const entry of map) {
                collected.push(entry)
            }

            expect(collected).toEqual([
                ['a', 1],
                ['b', 2],
            ])
        })

        it('supports spread operator', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            expect([...map]).toEqual([
                ['a', 1],
                ['b', 2],
            ])
        })
    })

    describe('toJSON', () => {
        it('returns entries as an array of [key, value] tuples', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            expect(map.toJSON()).toEqual([
                ['a', 1],
                ['b', 2],
            ])
        })

        it('returns an empty array for an empty map', () => {
            const map = new FifoMap<string, number>()

            expect(map.toJSON()).toEqual([])
        })

        it('is serializable with JSON.stringify', () => {
            const map = new FifoMap<string, number>()

            map.set('a', 1).set('b', 2)

            expect(JSON.stringify(map)).toBe('[["a",1],["b",2]]')
        })
    })

    describe('Symbol.toStringTag', () => {
        it('returns the class name', () => {
            const map = new FifoMap<string, number>()

            expect(Object.prototype.toString.call(map)).toBe('[object FifoMap]')
        })
    })

    describe('construction edge cases', () => {
        it('throws RangeError for NaN', () => {
            expect(() => new FifoMap(Number.NaN)).toThrow(RangeError)
        })

        it('throws RangeError for Infinity', () => {
            expect(() => new FifoMap(Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for -Infinity', () => {
            expect(() => new FifoMap(-Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for very large non-integer', () => {
            expect(() => new FifoMap(999_999.1)).toThrow(RangeError)
        })

        it('accepts maxSize of 1', () => {
            const map = new FifoMap(1)
            expect(map.maxSize).toBe(1)
            expect(map.size).toBe(0)
        })

        it('accepts very large integer maxSize', () => {
            const map = new FifoMap(Number.MAX_SAFE_INTEGER)
            expect(map.maxSize).toBe(Number.MAX_SAFE_INTEGER)
            expect(map.size).toBe(0)
        })

        it('maxSize reflects constructor argument', () => {
            const map = new FifoMap(5)
            expect(map.maxSize).toBe(5)
            map.set('a', 1)
            expect(map.maxSize).toBe(5)
        })
    })

    describe('key types', () => {
        it('works with number keys', () => {
            const map = new FifoMap<number, string>()
            map.set(1, 'one').set(2, 'two').set(3, 'three')
            expect(map.has(1)).toBe(true)
            expect(map.get(2)).toBe('two')
            expect([...map.keys()]).toEqual([1, 2, 3])
        })

        it('works with object keys (reference equality)', () => {
            const map = new FifoMap<object, number>()
            const a = { id: 1 }
            const b = { id: 1 }
            map.set(a, 1).set(b, 2)
            expect(map.size).toBe(2)
            expect(map.get(a)).toBe(1)
            expect(map.get(b)).toBe(2)
            expect(map.get({ id: 1 })).toBeUndefined()
        })

        it('works with null as key', () => {
            const map = new FifoMap<string | null, number>()
            map.set(null, 42)
            expect(map.get(null)).toBe(42)
            expect(map.has(null)).toBe(true)
            expect(map.size).toBe(1)
        })

        it('works with undefined as key', () => {
            const map = new FifoMap<string | undefined, number>()
            map.set(undefined, 99)
            expect(map.get(undefined)).toBe(99)
            expect(map.has(undefined)).toBe(true)
            expect(map.size).toBe(1)
        })

        it('works with symbol keys', () => {
            const map = new FifoMap<symbol, number>()
            const s1 = Symbol('a')
            const s2 = Symbol('b')
            map.set(s1, 1).set(s2, 2)
            expect(map.get(s1)).toBe(1)
            expect(map.get(s2)).toBe(2)
            expect(map.size).toBe(2)
        })

        it('works with NaN as key (Map semantics)', () => {
            const map = new FifoMap<number, string>()
            map.set(Number.NaN, 'nan')
            expect(map.get(Number.NaN)).toBe('nan')
            expect(map.has(Number.NaN)).toBe(true)
            map.set(Number.NaN, 'updated')
            expect(map.get(Number.NaN)).toBe('updated')
            expect(map.size).toBe(1)
        })

        it('works with 0 and -0 as same key', () => {
            const map = new FifoMap<number, string>()
            map.set(0, 'zero')
            map.set(-0, 'neg-zero')
            expect(map.size).toBe(1)
            expect(map.get(0)).toBe('neg-zero')
            expect(map.get(-0)).toBe('neg-zero')
        })

        it('works with empty string key', () => {
            const map = new FifoMap<string, number>()
            map.set('', 100)
            expect(map.get('')).toBe(100)
            expect(map.has('')).toBe(true)
        })

        it('works with boolean keys', () => {
            const map = new FifoMap<boolean, string>()
            map.set(true, 'yes').set(false, 'no')
            expect(map.get(true)).toBe('yes')
            expect(map.get(false)).toBe('no')
            expect(map.size).toBe(2)
        })
    })

    describe('value types', () => {
        it('stores undefined as value', () => {
            const map = new FifoMap<string, undefined>()
            map.set('a', undefined)
            expect(map.get('a')).toBeUndefined()
            expect(map.has('a')).toBe(true)
        })

        it('stores null as value', () => {
            const map = new FifoMap<string, null>()
            map.set('a', null)
            expect(map.get('a')).toBeNull()
        })

        it('stores false as value', () => {
            const map = new FifoMap<string, boolean>()
            map.set('a', false)
            expect(map.get('a')).toBe(false)
        })

        it('stores 0 as value', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 0)
            expect(map.get('a')).toBe(0)
        })

        it('stores empty string as value', () => {
            const map = new FifoMap<string, string>()
            map.set('a', '')
            expect(map.get('a')).toBe('')
        })

        it('stores NaN as value', () => {
            const map = new FifoMap<string, number>()
            map.set('a', Number.NaN)
            expect(map.get('a')).toBeNaN()
        })

        it('distinguishes undefined value from missing key via has()', () => {
            const map = new FifoMap<string, number | undefined>()
            map.set('exists', undefined)
            expect(map.get('exists')).toBeUndefined()
            expect(map.get('missing')).toBeUndefined()
            expect(map.has('exists')).toBe(true)
            expect(map.has('missing')).toBe(false)
        })
    })

    describe('delete edge cases', () => {
        it('deletes the only element', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            expect(map.delete('a')).toBe(true)
            expect(map.size).toBe(0)
            expect(map.peekNewest()).toBeUndefined()
            expect(map.peekOldest()).toBeUndefined()
        })

        it('deletes the head element correctly updates iteration', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('a')
            expect([...map.keys()]).toEqual(['b', 'c'])
            expect(map.peekOldest()).toEqual(['b', 2])
        })

        it('deletes the tail element correctly updates iteration', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('c')
            expect([...map.keys()]).toEqual(['a', 'b'])
            expect(map.peekNewest()).toEqual(['b', 2])
        })

        it('deletes a middle element correctly updates iteration', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            expect([...map.keys()]).toEqual(['a', 'c'])
            expect(map.size).toBe(2)
        })

        it('delete after clear returns false', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            map.clear()
            expect(map.delete('a')).toBe(false)
        })

        it('re-add after delete works correctly', () => {
            const map = new FifoMap<string, number>(3)
            map.set('a', 1).set('b', 2)
            map.delete('a')
            map.set('a', 10)
            expect(map.get('a')).toBe(10)
            expect(map.size).toBe(2)
            expect([...map.keys()]).toEqual(['b', 'a'])
        })

        it('delete all elements one by one results in empty map', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            map.delete('a')
            map.delete('c')
            expect(map.size).toBe(0)
            expect([...map.keys()]).toEqual([])
        })

        it('peek returns undefined after deleting all elements', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.peekNewest()).toBeUndefined()
            expect(map.peekOldest()).toBeUndefined()
        })

        it('has returns false after delete', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.has('a')).toBe(false)
        })

        it('get returns undefined after delete', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.get('a')).toBeUndefined()
        })
    })

    describe('clear edge cases', () => {
        it('clear on already empty map does not throw', () => {
            const map = new FifoMap<string, number>()
            map.clear()
            expect(map.size).toBe(0)
        })

        it('double clear does not throw', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            map.clear()
            expect(map.size).toBe(0)
        })

        it('iteration after clear yields nothing', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect([...map.keys()]).toEqual([])
            expect([...map.values()]).toEqual([])
            expect([...map.entries()]).toEqual([])
        })

        it('peekOldest and peekNewest return undefined after clear', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect(map.peekOldest()).toBeUndefined()
            expect(map.peekNewest()).toBeUndefined()
        })
    })

    describe('eviction edge cases', () => {
        it('eviction with maxSize=1 maintains correct peek values', () => {
            const map = new FifoMap<string, number>(1)
            map.set('a', 1)
            expect(map.peekOldest()).toEqual(['a', 1])
            expect(map.peekNewest()).toEqual(['a', 1])
            map.set('b', 2)
            expect(map.peekOldest()).toEqual(['b', 2])
            expect(map.peekNewest()).toEqual(['b', 2])
        })

        it('rapid cycling maintains integrity', () => {
            const map = new FifoMap<number, number>(3)

            for (let i = 0; i < 100; i++) {
                map.set(i, i * 10)
            }

            expect(map.size).toBe(3)
            expect(map.has(99)).toBe(true)
            expect(map.has(98)).toBe(true)
            expect(map.has(97)).toBe(true)
            expect(map.has(96)).toBe(false)
            expect([...map.keys()]).toEqual([97, 98, 99])
        })

        it('eviction after delete does not evict prematurely', () => {
            const map = new FifoMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            map.set('d', 4)
            expect(map.size).toBe(3)
            expect(map.has('a')).toBe(true)
            expect(map.has('c')).toBe(true)
            expect(map.has('d')).toBe(true)
        })

        it('set existing key at capacity does not trigger eviction', () => {
            const map = new FifoMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('b', 20)
            expect(map.size).toBe(3)
            expect(map.has('a')).toBe(true)
            expect(map.has('b')).toBe(true)
            expect(map.has('c')).toBe(true)
        })

        it('eviction order is strictly FIFO even under rapid operations', () => {
            const map = new FifoMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            expect(map.peekOldest()).toEqual(['a', 1])
            map.set('c', 3)
            expect(map.peekOldest()).toEqual(['b', 2])
            map.set('d', 4)
            expect(map.peekOldest()).toEqual(['c', 3])
        })
    })

    describe('iteration edge cases', () => {
        it('multiple iterators on same map work independently', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            const iter1 = map.keys()
            const iter2 = map.keys()
            expect(iter1.next().value).toBe('a')
            expect(iter2.next().value).toBe('a')
            expect(iter1.next().value).toBe('b')
            expect(iter2.next().value).toBe('b')
            expect(iter1.next().value).toBe('c')
            expect(iter2.next().value).toBe('c')
            expect(iter1.next().done).toBe(true)
            expect(iter2.next().done).toBe(true)
        })

        it('toJSON returns a new array each time', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            const json1 = map.toJSON()
            const json2 = map.toJSON()
            expect(json1).toEqual(json2)
            expect(json1).not.toBe(json2)
        })

        it('for-of with break exits early', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            const collected: string[] = []

            for (const [key] of map) {
                collected.push(key)

                if (key === 'b') {
                    break
                }
            }

            expect(collected).toEqual(['a', 'b'])
        })

        it('Array.from works with the map', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            expect([...map]).toEqual([['a', 1], ['b', 2]])
        })

        it('destructuring assignment works', () => {
            const map = new FifoMap<string, number>()
            map.set('x', 10)
            const entries = [...map]
            const [key, value] = entries[0]!
            expect(key).toBe('x')
            expect(value).toBe(10)
        })
    })

    describe('JSON serialization edge cases', () => {
        it('JSON.stringify works with nested objects as values', () => {
            const map = new FifoMap<string, { x: number }>()
            map.set('a', { x: 1 }).set('b', { x: 2 })
            const json = JSON.stringify(map)
            expect(JSON.parse(json)).toEqual([['a', { x: 1 }], ['b', { x: 2 }]])
        })

        it('JSON.stringify works with null values', () => {
            const map = new FifoMap<string, null>()
            map.set('a', null).set('b', null)
            expect(structuredClone(map.toJSON())).toEqual([['a', null], ['b', null]])
        })

        it('JSON.stringify works after eviction', () => {
            const map = new FifoMap<string, number>(2)
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(structuredClone(map.toJSON())).toEqual([['b', 2], ['c', 3]])
        })

        it('toJSON after clear returns empty array', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect(map.toJSON()).toEqual([])
            expect(JSON.stringify(map)).toBe('[]')
        })
    })

    describe('interleaved operations', () => {
        it('set-delete-set-delete cycle maintains correct state', () => {
            const map = new FifoMap<string, number>(3)
            map.set('a', 1)
            map.delete('a')
            map.set('a', 2)
            map.delete('a')
            expect(map.size).toBe(0)
            expect(map.has('a')).toBe(false)
        })

        it('fill to capacity, clear, refill works correctly', () => {
            const map = new FifoMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            map.clear()
            map.set('c', 3).set('d', 4).set('e', 5)
            expect(map.size).toBe(2)
            expect(map.has('c')).toBe(false)
            expect([...map.keys()]).toEqual(['d', 'e'])
        })

        it('peek after every set shows correct newest/oldest', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            expect(map.peekOldest()).toEqual(['a', 1])
            expect(map.peekNewest()).toEqual(['a', 1])
            map.set('b', 2)
            expect(map.peekOldest()).toEqual(['a', 1])
            expect(map.peekNewest()).toEqual(['b', 2])
            map.set('c', 3)
            expect(map.peekOldest()).toEqual(['a', 1])
            expect(map.peekNewest()).toEqual(['c', 3])
        })

        it('delete non-existent key between valid operations', () => {
            const map = new FifoMap<string, number>()
            map.set('a', 1)
            expect(map.delete('z')).toBe(false)
            map.set('b', 2)
            expect(map.delete('y')).toBe(false)
            expect(map.size).toBe(2)
            expect([...map.keys()]).toEqual(['a', 'b'])
        })

        it('size stays consistent through complex operation sequences', () => {
            const map = new FifoMap<string, number>(3)
            expect(map.size).toBe(0)
            map.set('a', 1)
            expect(map.size).toBe(1)
            map.set('b', 2)
            expect(map.size).toBe(2)
            map.set('c', 3)
            expect(map.size).toBe(3)
            map.set('d', 4)
            expect(map.size).toBe(3)
            map.delete('c')
            expect(map.size).toBe(2)
            map.set('c', 30)
            expect(map.size).toBe(3)
            map.set('c', 31)
            expect(map.size).toBe(3)
            map.clear()
            expect(map.size).toBe(0)
            map.set('x', 1)
            expect(map.size).toBe(1)
        })

        it('delete then set same key works', () => {
            const map = new FifoMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            map.set('b', 20)
            expect(map.get('b')).toBe(20)
            expect(map.size).toBe(3)
            expect([...map.keys()]).toEqual(['a', 'c', 'b'])
        })
    })
})
