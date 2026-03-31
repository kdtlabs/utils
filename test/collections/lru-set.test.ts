import { describe, expect, it } from 'bun:test'
import { LruSet } from '../../src/collections/lru-set'

describe('LruSet', () => {
    describe('construction', () => {
        it('creates an empty set without maxSize', () => {
            const set = new LruSet()
            expect(set.size).toBe(0)
        })

        it('creates an empty set with maxSize', () => {
            const set = new LruSet(3)
            expect(set.size).toBe(0)
        })

        it('throws RangeError for maxSize of 0', () => {
            expect(() => new LruSet(0)).toThrow(RangeError)
        })

        it('throws RangeError for negative maxSize', () => {
            expect(() => new LruSet(-1)).toThrow(RangeError)
        })

        it('throws RangeError for non-integer maxSize', () => {
            expect(() => new LruSet(1.5)).toThrow(RangeError)
        })
    })

    describe('add / has / delete / clear', () => {
        it('adds and checks a value', () => {
            const set = new LruSet<string>()
            set.add('a')
            expect(set.has('a')).toBe(true)
        })

        it('returns false for a missing value', () => {
            const set = new LruSet<string>()
            expect(set.has('missing')).toBe(false)
        })

        it('deletes a value', () => {
            const set = new LruSet<string>()
            set.add('a')
            expect(set.delete('a')).toBe(true)
            expect(set.has('a')).toBe(false)
            expect(set.size).toBe(0)
        })

        it('returns false when deleting a non-existent value', () => {
            const set = new LruSet<string>()
            expect(set.delete('missing')).toBe(false)
        })

        it('clears all values', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            set.clear()
            expect(set.size).toBe(0)
            expect(set.has('a')).toBe(false)
        })

        it('tracks size correctly', () => {
            const set = new LruSet<string>()
            set.add('a')
            expect(set.size).toBe(1)
            set.add('b')
            expect(set.size).toBe(2)
            set.delete('a')
            expect(set.size).toBe(1)
        })
    })

    describe('add returns this (chaining)', () => {
        it('returns the set instance', () => {
            const set = new LruSet<string>()
            const result = set.add('a')
            expect(result).toBe(set)
        })

        it('supports method chaining', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            expect(set.size).toBe(3)
        })
    })

    describe('LRU eviction', () => {
        it('evicts the least recently added item when exceeding maxSize', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('d')
            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
            expect(set.has('d')).toBe(true)
        })

        it('evicts multiple items one at a time as new items are added', () => {
            const set = new LruSet<string>(2)
            set.add('a').add('b')
            set.add('c')
            expect(set.has('a')).toBe(false)
            set.add('d')
            expect(set.has('b')).toBe(false)
            expect([...set.values()]).toEqual(['d', 'c'])
        })
    })

    describe('add existing value promotes to head', () => {
        it('moves re-added value to head so it is not evicted next', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')

            // 'a' is the oldest; re-add it to promote
            set.add('a')

            // now 'b' is the least recently used
            set.add('d')
            expect(set.has('b')).toBe(false)
            expect(set.has('a')).toBe(true)
        })

        it('does not increase size when adding an existing value', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('a')
            expect(set.size).toBe(3)
        })
    })

    describe('iteration order (most recently used first)', () => {
        it('iterates from newest to oldest', () => {
            const set = new LruSet<string>(5)
            set.add('a').add('b').add('c')
            expect([...set.values()]).toEqual(['c', 'b', 'a'])
        })

        it('reflects promotion from add in iteration order', () => {
            const set = new LruSet<string>(5)
            set.add('a').add('b').add('c')
            set.add('a')
            expect([...set.values()]).toEqual(['a', 'c', 'b'])
        })
    })

    describe('peekOldest / peekNewest', () => {
        it('returns undefined for empty set', () => {
            const set = new LruSet<string>()
            expect(set.peekOldest()).toBeUndefined()
            expect(set.peekNewest()).toBeUndefined()
        })

        it('returns the tail as oldest and head as newest', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            expect(set.peekOldest()).toBe('a')
            expect(set.peekNewest()).toBe('c')
        })

        it('reflects promotion in oldest/newest', () => {
            const set = new LruSet<string>(5)
            set.add('a').add('b').add('c')
            set.add('a')
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('b')
        })
    })

    describe('keys / values / entries', () => {
        it('returns values in order', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            expect([...set.values()]).toEqual(['c', 'b', 'a'])
        })

        it('keys returns the same as values (Set semantics)', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            expect([...set.keys()]).toEqual([...set.values()])
        })

        it('returns entries as [value, value] pairs', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')

            expect([...set.entries()]).toEqual([
                ['c', 'c'],
                ['b', 'b'],
                ['a', 'a'],
            ])
        })
    })

    describe('forEach', () => {
        it('iterates over all values in order', () => {
            const set = new LruSet<string>()

            set.add('a').add('b').add('c')

            const collected: string[] = []
            const each = set.forEach.bind(set)

            each((value) => {
                collected.push(value)
            })

            expect(collected).toEqual(['c', 'b', 'a'])
        })
    })

    describe('[Symbol.iterator]', () => {
        it('iterates values via for-of', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            const collected: string[] = []

            for (const value of set) {
                collected.push(value)
            }

            expect(collected).toEqual(['b', 'a'])
        })

        it('supports spread operator', () => {
            const set = new LruSet<string>()
            set.add('x').add('y')
            expect([...set]).toEqual(['y', 'x'])
        })
    })

    describe('toJSON', () => {
        it('returns a JSON-serializable representation', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            const json = set.toJSON()
            expect(json).toEqual(['b', 'a'])
        })

        it('returns an empty array for an empty set', () => {
            const set = new LruSet<string>()
            expect(set.toJSON()).toEqual([])
        })
    })

    describe('[Symbol.toStringTag]', () => {
        it('returns the correct string tag', () => {
            const set = new LruSet<string>()
            expect(Object.prototype.toString.call(set)).toContain('LruSet')
        })
    })

    describe('no maxSize (unlimited)', () => {
        it('never evicts values', () => {
            const set = new LruSet<number>()

            for (let i = 0; i < 100; i++) {
                set.add(i)
            }

            expect(set.size).toBe(100)
            expect(set.has(0)).toBe(true)
            expect(set.has(99)).toBe(true)
        })
    })

    describe('maxSize = 1', () => {
        it('keeps only the last added value', () => {
            const set = new LruSet<string>(1)
            set.add('a')
            expect(set.has('a')).toBe(true)
            set.add('b')
            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
        })

        it('keeps the same value when re-added', () => {
            const set = new LruSet<string>(1)
            set.add('a')

            expect(set.has('a')).toBe(true)

            set.add('a')

            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(true)
        })
    })

    describe('construction edge cases', () => {
        it('throws RangeError for NaN', () => {
            expect(() => new LruSet(Number.NaN)).toThrow(RangeError)
        })

        it('throws RangeError for Infinity', () => {
            expect(() => new LruSet(Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for -Infinity', () => {
            expect(() => new LruSet(-Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for large non-integer', () => {
            expect(() => new LruSet(999_999.1)).toThrow(RangeError)
        })

        it('accepts very large integer', () => {
            const set = new LruSet(Number.MAX_SAFE_INTEGER)
            expect(set.maxSize).toBe(Number.MAX_SAFE_INTEGER)
            expect(set.size).toBe(0)
        })

        it('maxSize preserves value from construction', () => {
            const set = new LruSet(5)
            expect(set.maxSize).toBe(5)
            set.add('a').add('b').add('c')
            expect(set.maxSize).toBe(5)
        })
    })

    describe('value types', () => {
        it('stores number values', () => {
            const set = new LruSet<number>(3)
            set.add(1).add(2).add(3)
            expect([...set]).toEqual([3, 2, 1])
        })

        it('stores object references', () => {
            const obj = { key: 'value' }
            const set = new LruSet<object>()
            set.add(obj)
            expect(set.has(obj)).toBe(true)
        })

        it('stores null', () => {
            const set = new LruSet<null>()
            set.add(null)
            expect(set.has(null)).toBe(true)
            expect(set.size).toBe(1)
        })

        it('stores undefined', () => {
            const set = new LruSet<undefined>()
            set.add(undefined)
            expect(set.has(undefined)).toBe(true)
            expect(set.size).toBe(1)
        })

        it('stores symbol', () => {
            const sym = Symbol('test')
            const set = new LruSet<symbol>()
            set.add(sym)
            expect(set.has(sym)).toBe(true)
        })

        it('treats NaN as same key (Map semantics)', () => {
            const set = new LruSet<number>()
            set.add(Number.NaN)
            set.add(Number.NaN)
            expect(set.size).toBe(1)
            expect(set.has(Number.NaN)).toBe(true)
        })

        it('treats 0 and -0 as same key', () => {
            const set = new LruSet<number>()
            set.add(0)
            set.add(-0)
            expect(set.size).toBe(1)
            expect(set.has(0)).toBe(true)
            expect(set.has(-0)).toBe(true)
        })

        it('stores empty string', () => {
            const set = new LruSet<string>()
            set.add('')
            expect(set.has('')).toBe(true)
            expect(set.size).toBe(1)
        })

        it('stores boolean values', () => {
            const set = new LruSet<boolean>()
            set.add(true).add(false)
            expect(set.size).toBe(2)
            expect(set.has(true)).toBe(true)
            expect(set.has(false)).toBe(true)
        })

        it('stores bigint values', () => {
            const set = new LruSet<bigint>()
            set.add(1n).add(2n).add(3n)
            expect(set.size).toBe(3)
            expect(set.has(2n)).toBe(true)
        })

        it('treats two different objects as different entries', () => {
            const a = { id: 1 }
            const b = { id: 1 }
            const set = new LruSet<object>()
            set.add(a).add(b)
            expect(set.size).toBe(2)
            expect(set.has(a)).toBe(true)
            expect(set.has(b)).toBe(true)
        })
    })

    describe('LRU promotion edge cases', () => {
        it('add existing on single element does not break', () => {
            const set = new LruSet<string>(3)
            set.add('a')
            expect(set.size).toBe(1)
            set.add('a')
            expect(set.size).toBe(1)
            expect([...set]).toEqual(['a'])
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('a')
        })

        it('add existing at head does not change order', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('c')
            expect([...set]).toEqual(['c', 'b', 'a'])
        })

        it('add promotes tail to head in 2-element set', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b')
            set.add('a')
            expect([...set]).toEqual(['a', 'b'])
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('b')
        })

        it('multiple adds of same value do not change size', () => {
            const set = new LruSet<string>(5)
            set.add('a').add('b')
            set.add('a')
            expect(set.size).toBe(2)
            set.add('a')
            expect(set.size).toBe(2)
            set.add('a')
            expect(set.size).toBe(2)
            expect([...set]).toEqual(['a', 'b'])
        })

        it('add every element in sequence reverses order', () => {
            const set = new LruSet<string>(5)
            set.add('a').add('b').add('c')
            set.add('a')
            set.add('b')
            set.add('c')
            expect([...set]).toEqual(['c', 'b', 'a'])
        })

        it('add existing at capacity does not evict', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('b')
            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })

        it('add existing at head position with full set', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('c')
            expect(set.size).toBe(3)
            expect([...set]).toEqual(['c', 'b', 'a'])
            expect(set.has('a')).toBe(true)
        })

        it('interleaved add new and add existing', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b')
            set.add('a')
            set.add('c')
            expect([...set]).toEqual(['c', 'a', 'b'])
            set.add('b')
            expect([...set]).toEqual(['b', 'c', 'a'])
            set.add('d')
            expect(set.has('a')).toBe(false)
            expect([...set]).toEqual(['d', 'b', 'c'])
        })
    })

    describe('delete edge cases', () => {
        it('delete only element', () => {
            const set = new LruSet<string>()
            set.add('a')
            expect(set.delete('a')).toBe(true)
            expect(set.size).toBe(0)
            expect(set.peekNewest()).toBeUndefined()
            expect(set.peekOldest()).toBeUndefined()
        })

        it('delete head', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            set.delete('c')
            expect(set.peekNewest()).toBe('b')
            expect([...set]).toEqual(['b', 'a'])
        })

        it('delete tail', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            set.delete('a')
            expect(set.peekOldest()).toBe('b')
            expect([...set]).toEqual(['c', 'b'])
        })

        it('delete middle', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            set.delete('b')
            expect(set.size).toBe(2)
            expect([...set]).toEqual(['c', 'a'])
        })

        it('delete after clear returns false', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.clear()
            expect(set.delete('a')).toBe(false)
        })

        it('re-add after delete', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.delete('b')
            set.add('b')
            expect(set.size).toBe(3)
            expect(set.peekNewest()).toBe('b')
            expect([...set]).toEqual(['b', 'c', 'a'])
        })

        it('delete all one by one', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            set.delete('b')
            set.delete('a')
            set.delete('c')
            expect(set.size).toBe(0)
            expect([...set]).toEqual([])
        })

        it('peek undefined after deleting all', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.delete('a')
            set.delete('b')
            expect(set.peekNewest()).toBeUndefined()
            expect(set.peekOldest()).toBeUndefined()
        })

        it('has returns false after delete', () => {
            const set = new LruSet<string>()
            set.add('a')
            set.delete('a')
            expect(set.has('a')).toBe(false)
        })
    })

    describe('clear edge cases', () => {
        it('clear empty set', () => {
            const set = new LruSet<string>()
            set.clear()
            expect(set.size).toBe(0)
        })

        it('double clear', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.clear()
            set.clear()
            expect(set.size).toBe(0)
        })

        it('iteration after clear yields nothing', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.clear()
            expect([...set]).toEqual([])
            expect([...set.keys()]).toEqual([])
            expect([...set.entries()]).toEqual([])
        })

        it('peeks undefined after clear', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.clear()
            expect(set.peekNewest()).toBeUndefined()
            expect(set.peekOldest()).toBeUndefined()
        })

        it('add after clear resumes LRU behavior', () => {
            const set = new LruSet<string>(2)
            set.add('a').add('b')
            set.clear()
            set.add('x').add('y')
            expect(set.size).toBe(2)
            expect([...set]).toEqual(['y', 'x'])
            set.add('z')
            expect(set.size).toBe(2)
            expect(set.has('x')).toBe(false)
            expect([...set]).toEqual(['z', 'y'])
        })
    })

    describe('eviction edge cases', () => {
        it('rapid cycling evicts correctly', () => {
            const set = new LruSet<number>(2)

            for (let i = 0; i < 100; i++) {
                set.add(i)
            }

            expect(set.size).toBe(2)
            expect(set.has(99)).toBe(true)
            expect(set.has(98)).toBe(true)
            expect(set.has(97)).toBe(false)
        })

        it('eviction after delete does not evict prematurely', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.delete('a')
            set.add('d')
            expect(set.size).toBe(3)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
            expect(set.has('d')).toBe(true)
        })

        it('add duplicate at capacity does not evict', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('c')
            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })

        it('eviction always removes tail (LRU)', () => {
            const set = new LruSet<string>(2)
            set.add('a').add('b')
            expect(set.peekOldest()).toBe('a')
            set.add('c')
            expect(set.peekOldest()).toBe('b')
            set.add('d')
            expect(set.peekOldest()).toBe('c')
        })

        it('add existing prevents its eviction', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('a')
            set.add('d')
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(false)
            expect(set.has('c')).toBe(true)
            expect(set.has('d')).toBe(true)
        })

        it('maxSize=1 with promotion', () => {
            const set = new LruSet<string>(1)
            set.add('a')
            expect(set.has('a')).toBe(true)
            set.add('a')
            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(true)
            set.add('b')
            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
        })
    })

    describe('iteration edge cases', () => {
        it('multiple iterators independently', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            const iter1 = set.values()
            const iter2 = set.values()
            expect(iter1.next().value).toBe('c')
            expect(iter2.next().value).toBe('c')
            expect(iter1.next().value).toBe('b')
            expect(iter2.next().value).toBe('b')
        })

        it('toJSON returns new array each time', () => {
            const set = new LruSet<string>()
            set.add('a')
            const json1 = set.toJSON()
            const json2 = set.toJSON()
            expect(json1).toEqual(json2)
            expect(json1).not.toBe(json2)
        })

        it('for-of break stops iteration', () => {
            const set = new LruSet<number>()
            set.add(1).add(2).add(3)
            const collected: number[] = []

            for (const v of set) {
                collected.push(v)

                if (v === 2) {
                    break
                }
            }

            expect(collected).toEqual([3, 2])
        })

        it('Array.from works', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            expect([...set]).toEqual(['b', 'a'])
        })

        it('entries on single item', () => {
            const set = new LruSet<string>()
            set.add('x')
            expect([...set.entries()]).toEqual([['x', 'x']])
        })

        it('entries on empty set', () => {
            const set = new LruSet<string>()
            expect([...set.entries()]).toEqual([])
        })

        it('forEach on empty set does not call callback', () => {
            const set = new LruSet<string>()
            const each = set.forEach.bind(set)
            let called = false

            each(() => {
                called = true
            })

            expect(called).toBe(false)
        })

        it('forEach passes set as third arg', () => {
            const set = new LruSet<string>()
            set.add('a')
            const each = set.forEach.bind(set)

            each((_v, _v2, s) => {
                expect(s).toBe(set)
            })
        })

        it('forEach passes value as both first and second arg with multiple items', () => {
            const set = new LruSet<string>()
            set.add('a').add('b').add('c')
            const each = set.forEach.bind(set)
            const pairs: Array<[string, string]> = []

            each((v1, v2) => {
                pairs.push([v1, v2])
            })

            expect(pairs).toEqual([['c', 'c'], ['b', 'b'], ['a', 'a']])
        })
    })

    describe('JSON serialization edge cases', () => {
        it('JSON.stringify with objects', () => {
            const set = new LruSet<{ id: number }>()
            set.add({ id: 1 }).add({ id: 2 })
            expect(JSON.stringify(set)).toBe('[{"id":2},{"id":1}]')
        })

        it('JSON.stringify with null', () => {
            const set = new LruSet<null>()
            set.add(null)
            expect(JSON.stringify(set)).toBe('[null]')
        })

        it('JSON.stringify after eviction', () => {
            const set = new LruSet<string>(2)
            set.add('a').add('b').add('c')
            expect(JSON.stringify(set)).toBe('["c","b"]')
        })

        it('JSON.stringify after promotion', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('a')
            expect(JSON.stringify(set)).toBe('["a","c","b"]')
        })

        it('toJSON after clear', () => {
            const set = new LruSet<string>()
            set.add('a').add('b')
            set.clear()
            expect(set.toJSON()).toEqual([])
        })
    })

    describe('interleaved operations', () => {
        it('add-delete-add-delete cycle', () => {
            const set = new LruSet<string>(3)
            set.add('a')
            set.delete('a')
            set.add('a')
            set.delete('a')
            expect(set.size).toBe(0)
            expect(set.has('a')).toBe(false)
        })

        it('fill, promote oldest, add new, check eviction', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('a')
            set.add('d')
            expect(set.has('b')).toBe(false)
            expect([...set]).toEqual(['d', 'a', 'c'])
        })

        it('fill, clear, refill', () => {
            const set = new LruSet<string>(2)
            set.add('a').add('b')
            set.clear()
            set.add('x').add('y').add('z')
            expect(set.size).toBe(2)
            expect(set.has('x')).toBe(false)
            expect([...set]).toEqual(['z', 'y'])
        })

        it('peek tracking through operations', () => {
            const set = new LruSet<string>(3)
            set.add('a')
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('a')
            set.add('b')
            expect(set.peekNewest()).toBe('b')
            expect(set.peekOldest()).toBe('a')
            set.add('a')
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('b')
            set.delete('b')
            expect(set.peekNewest()).toBe('a')
            expect(set.peekOldest()).toBe('a')
        })

        it('size consistency through mixed operations', () => {
            const set = new LruSet<string>(3)
            expect(set.size).toBe(0)
            set.add('a')
            expect(set.size).toBe(1)
            set.add('b')
            expect(set.size).toBe(2)
            set.add('a')
            expect(set.size).toBe(2)
            set.add('c')
            expect(set.size).toBe(3)
            set.add('d')
            expect(set.size).toBe(3)
            set.delete('c')
            expect(set.size).toBe(2)
            set.clear()
            expect(set.size).toBe(0)
        })

        it('delete then re-add same value', () => {
            const set = new LruSet<string>(3)
            set.add('a').add('b').add('c')
            set.delete('b')
            set.add('b')
            expect(set.size).toBe(3)
            expect(set.peekNewest()).toBe('b')
            expect([...set]).toEqual(['b', 'c', 'a'])
        })
    })
})
