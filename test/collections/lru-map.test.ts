import { describe, expect, it } from 'bun:test'
import { LruMap } from '../../src/collections/lru-map'

describe('LruMap', () => {
    describe('construction', () => {
        it('creates an empty map without maxSize', () => {
            const map = new LruMap()
            expect(map.size).toBe(0)
        })

        it('creates an empty map with maxSize', () => {
            const map = new LruMap(3)
            expect(map.size).toBe(0)
        })

        it('throws RangeError for maxSize of 0', () => {
            expect(() => new LruMap(0)).toThrow(RangeError)
        })

        it('throws RangeError for negative maxSize', () => {
            expect(() => new LruMap(-1)).toThrow(RangeError)
        })

        it('throws RangeError for non-integer maxSize', () => {
            expect(() => new LruMap(1.5)).toThrow(RangeError)
        })
    })

    describe('set / get / has / delete / clear', () => {
        it('sets and gets a value', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(map.get('a')).toBe(1)
        })

        it('returns undefined for a missing key', () => {
            const map = new LruMap<string, number>()
            expect(map.get('missing')).toBeUndefined()
        })

        it('reports has correctly', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(map.has('a')).toBe(true)
            expect(map.has('b')).toBe(false)
        })

        it('deletes a key', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(map.delete('a')).toBe(true)
            expect(map.has('a')).toBe(false)
            expect(map.size).toBe(0)
        })

        it('returns false when deleting a non-existent key', () => {
            const map = new LruMap<string, number>()
            expect(map.delete('missing')).toBe(false)
        })

        it('clears all entries', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.clear()
            expect(map.size).toBe(0)
            expect(map.get('a')).toBeUndefined()
        })

        it('tracks size correctly', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(map.size).toBe(1)
            map.set('b', 2)
            expect(map.size).toBe(2)
            map.delete('a')
            expect(map.size).toBe(1)
        })
    })

    describe('set returns this (chaining)', () => {
        it('returns the map instance', () => {
            const map = new LruMap<string, number>()
            const result = map.set('a', 1)
            expect(result).toBe(map)
        })

        it('supports method chaining', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.size).toBe(3)
        })
    })

    describe('LRU eviction', () => {
        it('evicts the least recently used item when exceeding maxSize', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('d', 4)
            expect(map.size).toBe(3)
            expect(map.has('a')).toBe(false)
            expect(map.get('b')).toBe(2)
            expect(map.get('c')).toBe(3)
            expect(map.get('d')).toBe(4)
        })

        it('evicts multiple items one at a time as new items are added', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            map.set('c', 3)
            expect(map.has('a')).toBe(false)
            map.set('d', 4)
            expect(map.has('b')).toBe(false)
            expect([...map.keys()]).toEqual(['d', 'c'])
        })
    })

    describe('get promotes to most recent', () => {
        it('moves accessed item to head so it is not evicted next', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)

            // 'a' is the oldest; access it to promote
            map.get('a')

            // now 'b' is the least recently used
            map.set('d', 4)
            expect(map.has('b')).toBe(false)
            expect(map.has('a')).toBe(true)
        })

        it('does not change anything for a missing key', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            map.get('missing')
            expect(map.size).toBe(2)
        })
    })

    describe('set existing key updates value and promotes to head', () => {
        it('updates the value of an existing key', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1)

            expect(map.get('a')).toBe(1)

            map.set('a', 99)

            expect(map.get('a')).toBe(99)
            expect(map.size).toBe(1)
        })

        it('promotes the updated key to head so it is not evicted next', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)

            // 'a' is oldest; update it to promote
            map.set('a', 10)

            // 'b' is now oldest
            map.set('d', 4)
            expect(map.has('b')).toBe(false)
            expect(map.get('a')).toBe(10)
        })

        it('does not increase size when updating existing key', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('a', 10)
            expect(map.size).toBe(3)
        })
    })

    describe('iteration order (most recently used first)', () => {
        it('iterates from newest to oldest', () => {
            const map = new LruMap<string, number>(5)
            map.set('a', 1).set('b', 2).set('c', 3)
            expect([...map.keys()]).toEqual(['c', 'b', 'a'])
        })

        it('reflects promotion from get in iteration order', () => {
            const map = new LruMap<string, number>(5)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('a')
            expect([...map.keys()]).toEqual(['a', 'c', 'b'])
        })

        it('reflects promotion from set-update in iteration order', () => {
            const map = new LruMap<string, number>(5)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('b', 20)
            expect([...map.keys()]).toEqual(['b', 'c', 'a'])
        })
    })

    describe('peekOldest / peekNewest', () => {
        it('returns undefined for empty map', () => {
            const map = new LruMap<string, number>()
            expect(map.peekOldest()).toBeUndefined()
            expect(map.peekNewest()).toBeUndefined()
        })

        it('returns the tail as oldest and head as newest', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.peekOldest()).toEqual(['a', 1])
            expect(map.peekNewest()).toEqual(['c', 3])
        })

        it('reflects LRU promotion in oldest/newest', () => {
            const map = new LruMap<string, number>(5)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('a')
            expect(map.peekNewest()).toEqual(['a', 1])
            expect(map.peekOldest()).toEqual(['b', 2])
        })
    })

    describe('keys / values / entries', () => {
        it('returns keys in order', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect([...map.keys()]).toEqual(['c', 'b', 'a'])
        })

        it('returns values in order', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect([...map.values()]).toEqual([3, 2, 1])
        })

        it('returns entries in order', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)

            expect([...map.entries()]).toEqual([
                ['c', 3],
                ['b', 2],
                ['a', 1],
            ])
        })
    })

    describe('forEach', () => {
        it('iterates over all entries in order', () => {
            const map = new LruMap<string, number>()

            map.set('a', 1).set('b', 2).set('c', 3)

            const collected: Array<[string, number]> = []
            const each = map.forEach.bind(map)

            each((value, key) => {
                collected.push([key, value])
            })

            expect(collected).toEqual([
                ['c', 3],
                ['b', 2],
                ['a', 1],
            ])
        })
    })

    describe('[Symbol.iterator]', () => {
        it('iterates entries via for-of', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            const collected: Array<[string, number]> = []

            for (const entry of map) {
                collected.push(entry)
            }

            expect(collected).toEqual([
                ['b', 2],
                ['a', 1],
            ])
        })

        it('supports spread operator', () => {
            const map = new LruMap<string, number>()
            map.set('x', 10).set('y', 20)

            expect([...map]).toEqual([
                ['y', 20],
                ['x', 10],
            ])
        })
    })

    describe('toJSON', () => {
        it('returns a JSON-serializable representation', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            const json = map.toJSON()

            expect(json).toEqual([
                ['b', 2],
                ['a', 1],
            ])
        })

        it('returns an empty array for an empty map', () => {
            const map = new LruMap<string, number>()
            expect(map.toJSON()).toEqual([])
        })
    })

    describe('[Symbol.toStringTag]', () => {
        it('returns the correct string tag', () => {
            const map = new LruMap<string, number>()
            expect(Object.prototype.toString.call(map)).toContain('LruMap')
        })
    })

    describe('no maxSize (unlimited)', () => {
        it('never evicts items', () => {
            const map = new LruMap<number, number>()

            for (let i = 0; i < 100; i++) {
                map.set(i, i * 10)
            }

            expect(map.size).toBe(100)
            expect(map.get(0)).toBe(0)
            expect(map.get(99)).toBe(990)
        })
    })

    describe('maxSize = 1', () => {
        it('keeps only the last set item', () => {
            const map = new LruMap<string, number>(1)
            map.set('a', 1)
            expect(map.get('a')).toBe(1)
            map.set('b', 2)
            expect(map.size).toBe(1)
            expect(map.has('a')).toBe(false)
            expect(map.get('b')).toBe(2)
        })

        it('keeps only the last set item after update', () => {
            const map = new LruMap<string, number>(1)
            map.set('a', 1)

            expect(map.get('a')).toBe(1)

            map.set('a', 2)

            expect(map.size).toBe(1)
            expect(map.get('a')).toBe(2)
        })
    })

    describe('construction edge cases', () => {
        it('throws for NaN', () => {
            expect(() => new LruMap(Number.NaN)).toThrow(RangeError)
        })

        it('throws for Infinity', () => {
            expect(() => new LruMap(Infinity)).toThrow(RangeError)
        })

        it('throws for -Infinity', () => {
            expect(() => new LruMap(-Infinity)).toThrow(RangeError)
        })

        it('throws for large non-integer', () => {
            expect(() => new LruMap(999_999.1)).toThrow(RangeError)
        })

        it('accepts very large integer maxSize', () => {
            const map = new LruMap(Number.MAX_SAFE_INTEGER)
            expect(map.size).toBe(0)
            map.set('a', 1)
            expect(map.size).toBe(1)
        })

        it('maxSize reflects constructor argument', () => {
            const map = new LruMap(3)
            expect(map.maxSize).toBe(3)
            const unbounded = new LruMap()
            expect(unbounded.maxSize).toBeUndefined()
        })
    })

    describe('key types', () => {
        it('number keys', () => {
            const map = new LruMap<number, string>(3)
            map.set(1, 'one').set(2, 'two').set(3, 'three')
            expect(map.has(1)).toBe(true)
            expect(map.has(2)).toBe(true)
            expect(map.has(3)).toBe(true)
            expect([...map.keys()]).toEqual([3, 2, 1])
        })

        it('object keys (reference equality)', () => {
            const map = new LruMap<object, number>()
            const a = { id: 1 }
            const b = { id: 1 }
            map.set(a, 1).set(b, 2)
            expect(map.size).toBe(2)
            expect(map.get(a)).toBe(1)
            expect(map.get(b)).toBe(2)
            expect(map.get({ id: 1 })).toBeUndefined()
        })

        it('null as key', () => {
            const map = new LruMap<string | null, number>()
            map.set(null, 42)
            expect(map.get(null)).toBe(42)
            expect(map.has(null)).toBe(true)
            map.set('a', 1)
            expect(map.size).toBe(2)
        })

        it('undefined as key', () => {
            const map = new LruMap<string | undefined, number>()
            map.set(undefined, 99)
            expect(map.get(undefined)).toBe(99)
            expect(map.has(undefined)).toBe(true)
            expect(map.size).toBe(1)
        })

        it('symbol keys', () => {
            const map = new LruMap<symbol, number>()
            const s1 = Symbol('a')
            const s2 = Symbol('b')
            map.set(s1, 1).set(s2, 2)
            expect(map.get(s1)).toBe(1)
            expect(map.get(s2)).toBe(2)
            expect(map.size).toBe(2)
        })

        it('NaN as key', () => {
            const map = new LruMap<number, string>()
            map.set(Number.NaN, 'nan')
            expect(map.get(Number.NaN)).toBe('nan')
            expect(map.has(Number.NaN)).toBe(true)
            map.set(Number.NaN, 'updated')
            expect(map.get(Number.NaN)).toBe('updated')
            expect(map.size).toBe(1)
        })

        it('0 and -0 as same key', () => {
            const map = new LruMap<number, string>()
            map.set(0, 'zero')
            map.set(-0, 'neg-zero')
            expect(map.size).toBe(1)
            expect(map.get(0)).toBe('neg-zero')
            expect(map.get(-0)).toBe('neg-zero')
        })

        it('empty string key', () => {
            const map = new LruMap<string, number>()
            map.set('', 100)
            expect(map.get('')).toBe(100)
            expect(map.has('')).toBe(true)
            expect(map.size).toBe(1)
        })

        it('boolean keys', () => {
            const map = new LruMap<boolean, string>()
            map.set(true, 'yes').set(false, 'no')
            expect(map.get(true)).toBe('yes')
            expect(map.get(false)).toBe('no')
            expect(map.size).toBe(2)
        })
    })

    describe('value types', () => {
        it('undefined value', () => {
            const map = new LruMap<string, undefined>()
            map.set('a', undefined)
            expect(map.get('a')).toBeUndefined()
            expect(map.has('a')).toBe(true)
        })

        it('null value', () => {
            const map = new LruMap<string, null>()
            map.set('a', null)
            expect(map.get('a')).toBeNull()
        })

        it('false value', () => {
            const map = new LruMap<string, boolean>()
            map.set('a', false)
            expect(map.get('a')).toBe(false)
        })

        it('0 value', () => {
            const map = new LruMap<string, number>()
            map.set('a', 0)
            expect(map.get('a')).toBe(0)
        })

        it('empty string value', () => {
            const map = new LruMap<string, string>()
            map.set('a', '')
            expect(map.get('a')).toBe('')
        })

        it('NaN value', () => {
            const map = new LruMap<string, number>()
            map.set('a', Number.NaN)
            expect(map.get('a')).toBeNaN()
        })

        it('distinguish undefined value vs missing key via has()', () => {
            const map = new LruMap<string, number | undefined>()
            map.set('exists', undefined)
            expect(map.get('exists')).toBeUndefined()
            expect(map.get('missing')).toBeUndefined()
            expect(map.has('exists')).toBe(true)
            expect(map.has('missing')).toBe(false)
        })
    })

    describe('LRU promotion edge cases', () => {
        it('get on single-element map does not break', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1)
            map.get('a')
            expect(map.size).toBe(1)
            expect(map.get('a')).toBe(1)
            expect(map.peekNewest()).toEqual(['a', 1])
            expect(map.peekOldest()).toEqual(['a', 1])
        })

        it('get on head element (already most recent) does not break', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('c')
            expect([...map.keys()]).toEqual(['c', 'b', 'a'])
        })

        it('get promotes tail to head in 2-element map', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            expect([...map.keys()]).toEqual(['b', 'a'])
            map.get('a')
            expect([...map.keys()]).toEqual(['a', 'b'])
            expect(map.peekNewest()).toEqual(['a', 1])
            expect(map.peekOldest()).toEqual(['b', 2])
        })

        it('multiple gets on same key do not break order', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('b')
            map.get('b')
            map.get('b')
            expect([...map.keys()]).toEqual(['b', 'c', 'a'])
            expect(map.size).toBe(3)
        })

        it('get every element in sequence reverses order', () => {
            const map = new LruMap<string, number>(4)
            map.set('a', 1).set('b', 2).set('c', 3).set('d', 4)
            expect([...map.keys()]).toEqual(['d', 'c', 'b', 'a'])
            map.get('a')
            map.get('b')
            map.get('c')
            map.get('d')
            expect([...map.keys()]).toEqual(['d', 'c', 'b', 'a'])
        })

        it('set existing promotes correctly when at capacity', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('a', 10)
            expect(map.size).toBe(3)
            expect([...map.keys()]).toEqual(['a', 'c', 'b'])
            map.set('d', 4)
            expect(map.has('b')).toBe(false)
            expect(map.size).toBe(3)
        })

        it('set existing at head position does not change order', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('c', 30)
            expect([...map.keys()]).toEqual(['c', 'b', 'a'])
            expect(map.get('c')).toBe(30)
        })

        it('interleaved get and set promotions', () => {
            const map = new LruMap<string, number>(4)
            map.set('a', 1).set('b', 2).set('c', 3).set('d', 4)
            map.get('a')
            map.set('b', 20)
            map.get('c')
            expect([...map.keys()]).toEqual(['c', 'b', 'a', 'd'])
            expect(map.get('b')).toBe(20)
        })
    })

    describe('delete edge cases', () => {
        it('delete only element', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            expect(map.delete('a')).toBe(true)
            expect(map.size).toBe(0)
            expect(map.peekNewest()).toBeUndefined()
            expect(map.peekOldest()).toBeUndefined()
        })

        it('delete head', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.delete('c')).toBe(true)
            expect([...map.keys()]).toEqual(['b', 'a'])
            expect(map.peekNewest()).toEqual(['b', 2])
        })

        it('delete tail', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.delete('a')).toBe(true)
            expect([...map.keys()]).toEqual(['c', 'b'])
            expect(map.peekOldest()).toEqual(['b', 2])
        })

        it('delete middle', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.delete('b')).toBe(true)
            expect([...map.keys()]).toEqual(['c', 'a'])
            expect(map.size).toBe(2)
        })

        it('delete after clear returns false', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            map.clear()
            expect(map.delete('a')).toBe(false)
        })

        it('re-add after delete', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2)
            map.delete('a')
            map.set('a', 10)
            expect(map.get('a')).toBe(10)
            expect(map.size).toBe(2)
            expect([...map.keys()]).toEqual(['a', 'b'])
        })

        it('delete all one by one', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.delete('b')).toBe(true)
            expect(map.delete('a')).toBe(true)
            expect(map.delete('c')).toBe(true)
            expect(map.size).toBe(0)
            expect([...map.keys()]).toEqual([])
        })

        it('peek undefined after deleting all', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.peekNewest()).toBeUndefined()
            expect(map.peekOldest()).toBeUndefined()
        })

        it('delete then get returns undefined', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.get('a')).toBeUndefined()
        })

        it('has returns false after delete', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            map.delete('a')
            expect(map.has('a')).toBe(false)
        })
    })

    describe('clear edge cases', () => {
        it('clear empty map', () => {
            const map = new LruMap<string, number>()
            map.clear()
            expect(map.size).toBe(0)
        })

        it('double clear', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            map.clear()
            expect(map.size).toBe(0)
        })

        it('iteration after clear yields nothing', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect([...map.keys()]).toEqual([])
            expect([...map.values()]).toEqual([])
            expect([...map.entries()]).toEqual([])
        })

        it('peeks undefined after clear', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect(map.peekNewest()).toBeUndefined()
            expect(map.peekOldest()).toBeUndefined()
        })

        it('can add after clear and LRU behavior resumes', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            map.clear()
            map.set('x', 10).set('y', 20)
            expect(map.size).toBe(2)
            map.set('z', 30)
            expect(map.size).toBe(2)
            expect(map.has('x')).toBe(false)
            expect([...map.keys()]).toEqual(['z', 'y'])
        })
    })

    describe('eviction edge cases', () => {
        it('rapid cycling maintains integrity', () => {
            const map = new LruMap<number, number>(3)

            for (let i = 0; i < 100; i++) {
                map.set(i, i * 10)
            }

            expect(map.size).toBe(3)
            expect(map.has(99)).toBe(true)
            expect(map.has(98)).toBe(true)
            expect(map.has(97)).toBe(true)
            expect(map.has(96)).toBe(false)
            expect([...map.keys()]).toEqual([99, 98, 97])
        })

        it('eviction after delete does not evict prematurely', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            map.set('d', 4)
            expect(map.size).toBe(3)
            expect(map.has('a')).toBe(true)
            expect(map.has('c')).toBe(true)
            expect(map.has('d')).toBe(true)
        })

        it('set existing at capacity does not evict', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.set('a', 10)
            expect(map.size).toBe(3)
            expect(map.has('a')).toBe(true)
            expect(map.has('b')).toBe(true)
            expect(map.has('c')).toBe(true)
        })

        it('eviction always removes LRU (tail) not MRU (head)', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            expect(map.peekOldest()).toEqual(['a', 1])
            map.set('d', 4)
            expect(map.peekOldest()).toEqual(['b', 2])
            expect(map.peekNewest()).toEqual(['d', 4])
        })

        it('get prevents eviction of accessed item', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('a')
            map.set('d', 4)
            expect(map.has('a')).toBe(true)
            expect(map.has('b')).toBe(false)
            map.set('e', 5)
            expect(map.has('c')).toBe(false)
            expect(map.has('a')).toBe(true)
        })

        it('eviction with maxSize=1 works correctly with get promotion', () => {
            const map = new LruMap<string, number>(1)
            map.set('a', 1)
            map.get('a')
            expect(map.size).toBe(1)
            map.set('b', 2)
            expect(map.size).toBe(1)
            expect(map.has('a')).toBe(false)
            expect(map.get('b')).toBe(2)
        })
    })

    describe('iteration edge cases', () => {
        it('multiple iterators work independently', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            const iter1 = map.keys()
            const iter2 = map.keys()
            expect(iter1.next().value).toBe('c')
            expect(iter2.next().value).toBe('c')
            expect(iter1.next().value).toBe('b')
            expect(iter2.next().value).toBe('b')
            expect(iter1.next().value).toBe('a')
            expect(iter2.next().value).toBe('a')
            expect(iter1.next().done).toBe(true)
            expect(iter2.next().done).toBe(true)
        })

        it('toJSON returns new array each time', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            const json1 = map.toJSON()
            const json2 = map.toJSON()
            expect(json1).toEqual(json2)
            expect(json1).not.toBe(json2)
        })

        it('for-of with break', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            const collected: string[] = []

            for (const [key] of map) {
                collected.push(key)

                if (key === 'b') {
                    break
                }
            }

            expect(collected).toEqual(['c', 'b'])
        })

        it('Array.from', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            const arr = [...map]
            expect(arr).toEqual([['b', 2], ['a', 1]])
        })

        it('entries/keys/values on empty map', () => {
            const map = new LruMap<string, number>()
            expect([...map.entries()]).toEqual([])
            expect([...map.keys()]).toEqual([])
            expect([...map.values()]).toEqual([])
        })

        it('forEach on empty map does nothing', () => {
            const map = new LruMap<string, number>()
            const each = map.forEach.bind(map)
            let called = false

            each(() => {
                called = true
            })

            expect(called).toBe(false)
        })

        it('forEach passes map as third arg', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1)
            const each = map.forEach.bind(map)

            each((_value, _key, m) => {
                expect(m).toBe(map)
            })
        })
    })

    describe('JSON serialization edge cases', () => {
        it('JSON.stringify with nested objects', () => {
            const map = new LruMap<string, { x: number }>()
            map.set('a', { x: 1 }).set('b', { x: 2 })
            const json = JSON.stringify(map)
            expect(JSON.parse(json)).toEqual([['b', { x: 2 }], ['a', { x: 1 }]])
        })

        it('JSON.stringify with null values', () => {
            const map = new LruMap<string, null>()
            map.set('a', null).set('b', null)
            const json = JSON.stringify(map)
            expect(JSON.parse(json)).toEqual([['b', null], ['a', null]])
        })

        it('JSON.stringify after eviction reflects current state', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2).set('c', 3)
            const json = JSON.stringify(map)
            expect(JSON.parse(json)).toEqual([['c', 3], ['b', 2]])
        })

        it('JSON.stringify after get promotion reflects new order', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('a')
            const json = JSON.stringify(map)
            expect(JSON.parse(json)).toEqual([['a', 1], ['c', 3], ['b', 2]])
        })

        it('toJSON after clear', () => {
            const map = new LruMap<string, number>()
            map.set('a', 1).set('b', 2)
            map.clear()
            expect(map.toJSON()).toEqual([])
            expect(JSON.stringify(map)).toBe('[]')
        })
    })

    describe('interleaved operations', () => {
        it('set-get-delete-set cycle maintains correct state', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1)
            expect(map.get('a')).toBe(1)
            map.delete('a')
            expect(map.get('a')).toBeUndefined()
            map.set('a', 2)
            expect(map.get('a')).toBe(2)
            expect(map.size).toBe(1)
        })

        it('fill to capacity, get oldest to promote, add new evicts correct item', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.get('a')
            map.set('d', 4)
            expect(map.has('b')).toBe(false)
            expect([...map.keys()]).toEqual(['d', 'a', 'c'])
        })

        it('fill, clear, refill', () => {
            const map = new LruMap<string, number>(2)
            map.set('a', 1).set('b', 2)
            map.clear()
            expect(map.size).toBe(0)
            map.set('c', 3).set('d', 4).set('e', 5)
            expect(map.size).toBe(2)
            expect(map.has('c')).toBe(false)
            expect([...map.keys()]).toEqual(['e', 'd'])
        })

        it('peek tracks correct items through operations', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1)
            expect(map.peekNewest()).toEqual(['a', 1])
            expect(map.peekOldest()).toEqual(['a', 1])

            map.set('b', 2)
            expect(map.peekNewest()).toEqual(['b', 2])
            expect(map.peekOldest()).toEqual(['a', 1])

            map.get('a')
            expect(map.peekNewest()).toEqual(['a', 1])
            expect(map.peekOldest()).toEqual(['b', 2])

            map.delete('a')
            expect(map.peekNewest()).toEqual(['b', 2])
            expect(map.peekOldest()).toEqual(['b', 2])
        })

        it('size consistency through complex sequences', () => {
            const map = new LruMap<string, number>(3)
            expect(map.size).toBe(0)
            map.set('a', 1)
            expect(map.size).toBe(1)
            map.set('b', 2)
            expect(map.size).toBe(2)
            map.set('c', 3)
            expect(map.size).toBe(3)
            map.set('d', 4)
            expect(map.size).toBe(3)
            map.delete('b')
            expect(map.size).toBe(2)
            map.set('b', 20)
            expect(map.size).toBe(3)
            map.set('b', 30)
            expect(map.size).toBe(3)
            map.clear()
            expect(map.size).toBe(0)
            map.set('x', 1)
            expect(map.size).toBe(1)
        })

        it('delete then set same key works', () => {
            const map = new LruMap<string, number>(3)
            map.set('a', 1).set('b', 2).set('c', 3)
            map.delete('b')
            map.set('b', 20)
            expect(map.get('b')).toBe(20)
            expect(map.size).toBe(3)
            expect([...map.keys()]).toEqual(['b', 'c', 'a'])
        })
    })
})
