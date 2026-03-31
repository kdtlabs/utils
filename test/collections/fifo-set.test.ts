import { describe, expect, it } from 'bun:test'
import { FifoSet } from '../../src/collections/fifo-set'

describe('FifoSet', () => {
    describe('construction', () => {
        it('creates an empty set without maxSize', () => {
            const set = new FifoSet()

            expect(set.size).toBe(0)
            expect(set.maxSize).toBeUndefined()
        })

        it('creates an empty set with maxSize', () => {
            const set = new FifoSet(3)

            expect(set.size).toBe(0)
            expect(set.maxSize).toBe(3)
        })

        it('throws RangeError for maxSize of 0', () => {
            expect(() => new FifoSet(0)).toThrow(RangeError)
        })

        it('throws RangeError for negative maxSize', () => {
            expect(() => new FifoSet(-1)).toThrow(RangeError)
        })

        it('throws RangeError for non-integer maxSize', () => {
            expect(() => new FifoSet(1.5)).toThrow(RangeError)
        })
    })

    describe('add', () => {
        it('adds a value', () => {
            const set = new FifoSet<string>()

            set.add('a')

            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(true)
        })

        it('returns this for chaining', () => {
            const set = new FifoSet<string>()

            const result = set.add('a')

            expect(result).toBe(set)
        })

        it('supports chaining multiple add calls', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')

            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })

        it('ignores duplicate values without changing size or position', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')
            set.add('a')

            expect(set.size).toBe(3)
            expect([...set]).toEqual(['a', 'b', 'c'])
        })
    })

    describe('has', () => {
        it('returns true for an existing value', () => {
            const set = new FifoSet<string>()

            set.add('a')

            expect(set.has('a')).toBe(true)
        })

        it('returns false for a non-existing value', () => {
            const set = new FifoSet<string>()

            expect(set.has('a')).toBe(false)
        })
    })

    describe('delete', () => {
        it('removes an existing value and returns true', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect(set.delete('a')).toBe(true)
            expect(set.has('a')).toBe(false)
            expect(set.size).toBe(1)
        })

        it('returns false for a non-existing value', () => {
            const set = new FifoSet<string>()

            expect(set.delete('missing')).toBe(false)
        })

        it('allows adding a new value after deleting', () => {
            const set = new FifoSet<string>(2)

            set.add('a').add('b')
            set.delete('a')
            set.add('c')

            expect(set.size).toBe(2)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })
    })

    describe('clear', () => {
        it('removes all values', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')
            set.clear()

            expect(set.size).toBe(0)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(false)
            expect(set.has('c')).toBe(false)
        })

        it('allows adding values after clear', () => {
            const set = new FifoSet<string>(2)

            set.add('a').add('b')
            set.clear()
            set.add('c')

            expect(set.size).toBe(1)
            expect(set.has('c')).toBe(true)
        })
    })

    describe('FIFO eviction', () => {
        it('evicts oldest value when exceeding maxSize', () => {
            const set = new FifoSet<string>(2)

            set.add('a').add('b').add('c')

            expect(set.size).toBe(2)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })

        it('evicts multiple oldest values as new ones are added', () => {
            const set = new FifoSet<string>(2)

            set.add('a').add('b').add('c').add('d')

            expect(set.size).toBe(2)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(false)
            expect(set.has('c')).toBe(true)
            expect(set.has('d')).toBe(true)
        })

        it('does not evict when adding a duplicate value', () => {
            const set = new FifoSet<string>(2)

            set.add('a').add('b')
            set.add('a')

            expect(set.size).toBe(2)
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(true)
        })

        it('does not evict without maxSize', () => {
            const set = new FifoSet<number>()

            for (let i = 0; i < 100; i++) {
                set.add(i)
            }

            expect(set.size).toBe(100)
        })
    })

    describe('maxSize=1', () => {
        it('keeps only the latest value', () => {
            const set = new FifoSet<string>(1)

            set.add('a')

            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(true)

            set.add('b')

            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(false)
            expect(set.has('b')).toBe(true)
        })

        it('ignores duplicate without eviction', () => {
            const set = new FifoSet<string>(1)

            set.add('a')

            expect(set.size).toBe(1)

            set.add('a')

            expect(set.size).toBe(1)
            expect(set.has('a')).toBe(true)
        })
    })

    describe('peekOldest', () => {
        it('returns undefined for an empty set', () => {
            const set = new FifoSet<string>()

            expect(set.peekOldest()).toBeUndefined()
        })

        it('returns the only value for a single-item set', () => {
            const set = new FifoSet<string>()

            set.add('a')

            expect(set.peekOldest()).toBe('a')
        })

        it('returns the oldest (first inserted) value', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')

            expect(set.peekOldest()).toBe('a')
        })
    })

    describe('peekNewest', () => {
        it('returns undefined for an empty set', () => {
            const set = new FifoSet<string>()

            expect(set.peekNewest()).toBeUndefined()
        })

        it('returns the only value for a single-item set', () => {
            const set = new FifoSet<string>()

            set.add('a')

            expect(set.peekNewest()).toBe('a')
        })

        it('returns the newest (last inserted) value', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')

            expect(set.peekNewest()).toBe('c')
        })
    })

    describe('iteration order', () => {
        it('iterates in insertion order (oldest first)', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')

            expect([...set]).toEqual(['a', 'b', 'c'])
        })

        it('preserves order when adding duplicate value', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')
            set.add('b')

            expect([...set]).toEqual(['a', 'b', 'c'])
        })
    })

    describe('values', () => {
        it('yields values in insertion order', () => {
            const set = new FifoSet<string>()

            set.add('x').add('y').add('z')

            expect([...set.values()]).toEqual(['x', 'y', 'z'])
        })

        it('yields nothing for an empty set', () => {
            const set = new FifoSet<string>()

            expect([...set.values()]).toEqual([])
        })
    })

    describe('keys', () => {
        it('yields the same as values (Set-compatible)', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect([...set.keys()]).toEqual([...set.values()])
        })
    })

    describe('entries', () => {
        it('yields [value, value] pairs in insertion order', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect([...set.entries()]).toEqual([
                ['a', 'a'],
                ['b', 'b'],
            ])
        })

        it('yields nothing for an empty set', () => {
            const set = new FifoSet<string>()

            expect([...set.entries()]).toEqual([])
        })
    })

    describe('forEach', () => {
        it('calls callback for each value in insertion order', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b').add('c')

            const collected: string[] = []
            const each = set.forEach.bind(set)

            each((value) => {
                collected.push(value)
            })

            expect(collected).toEqual(['a', 'b', 'c'])
        })

        it('passes value as both first and second argument', () => {
            const set = new FifoSet<string>()

            set.add('a')

            const each = set.forEach.bind(set)

            each((v1, v2) => {
                expect(v1).toBe(v2)
            })
        })

        it('passes the set as third argument', () => {
            const set = new FifoSet<string>()

            set.add('a')

            let ref: unknown
            const each = set.forEach.bind(set)

            each((_v1, _v2, s) => {
                ref = s
            })

            expect(ref).toBe(set)
        })

        it('does not call callback for an empty set', () => {
            const set = new FifoSet<string>()
            let called = false
            const each = set.forEach.bind(set)

            each(() => {
                called = true
            })

            expect(called).toBe(false)
        })
    })

    describe('Symbol.iterator', () => {
        it('supports for-of loop in insertion order', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            const collected: string[] = []

            for (const value of set) {
                collected.push(value)
            }

            expect(collected).toEqual(['a', 'b'])
        })

        it('supports spread operator', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect([...set]).toEqual(['a', 'b'])
        })
    })

    describe('toJSON', () => {
        it('returns values as an array', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect(set.toJSON()).toEqual(['a', 'b'])
        })

        it('returns an empty array for an empty set', () => {
            const set = new FifoSet<string>()

            expect(set.toJSON()).toEqual([])
        })

        it('is serializable with JSON.stringify', () => {
            const set = new FifoSet<string>()

            set.add('a').add('b')

            expect(JSON.stringify(set)).toBe('["a","b"]')
        })
    })

    describe('Symbol.toStringTag', () => {
        it('returns the class name', () => {
            const set = new FifoSet<string>()

            expect(Object.prototype.toString.call(set)).toBe('[object FifoSet]')
        })
    })

    describe('construction edge cases', () => {
        it('throws RangeError for NaN', () => {
            expect(() => new FifoSet(Number.NaN)).toThrow(RangeError)
        })

        it('throws RangeError for Infinity', () => {
            expect(() => new FifoSet(Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for -Infinity', () => {
            expect(() => new FifoSet(-Infinity)).toThrow(RangeError)
        })

        it('throws RangeError for very large non-integer', () => {
            expect(() => new FifoSet(999_999.1)).toThrow(RangeError)
        })

        it('accepts maxSize of 1', () => {
            const set = new FifoSet(1)
            expect(set.maxSize).toBe(1)
            expect(set.size).toBe(0)
        })

        it('accepts very large integer maxSize', () => {
            const set = new FifoSet(Number.MAX_SAFE_INTEGER)
            expect(set.maxSize).toBe(Number.MAX_SAFE_INTEGER)
            expect(set.size).toBe(0)
        })

        it('maxSize reflects constructor argument', () => {
            const set = new FifoSet(5)
            expect(set.maxSize).toBe(5)
            set.add('a')
            expect(set.maxSize).toBe(5)
        })
    })

    describe('value types', () => {
        it('works with number values', () => {
            const set = new FifoSet<number>()
            set.add(1).add(2).add(3)
            expect([...set]).toEqual([1, 2, 3])
        })

        it('works with object references (reference equality)', () => {
            const set = new FifoSet<object>()
            const a = { id: 1 }
            const b = { id: 1 }
            set.add(a).add(b)
            expect(set.size).toBe(2)
            expect(set.has(a)).toBe(true)
            expect(set.has(b)).toBe(true)
            expect(set.has({ id: 1 })).toBe(false)
        })

        it('works with null', () => {
            const set = new FifoSet<null>()
            set.add(null)
            expect(set.has(null)).toBe(true)
            expect(set.size).toBe(1)
        })

        it('works with undefined', () => {
            const set = new FifoSet<undefined>()
            set.add(undefined)
            expect(set.has(undefined)).toBe(true)
            expect(set.size).toBe(1)
        })

        it('works with symbol values', () => {
            const set = new FifoSet<symbol>()
            const s1 = Symbol('a')
            const s2 = Symbol('b')
            set.add(s1).add(s2)
            expect(set.has(s1)).toBe(true)
            expect(set.has(s2)).toBe(true)
            expect(set.size).toBe(2)
        })

        it('works with NaN (Map semantics)', () => {
            const set = new FifoSet<number>()
            set.add(Number.NaN)
            set.add(Number.NaN)
            expect(set.size).toBe(1)
            expect(set.has(Number.NaN)).toBe(true)
        })

        it('works with 0 and -0 as same value', () => {
            const set = new FifoSet<number>()
            set.add(0)
            set.add(-0)
            expect(set.size).toBe(1)
            expect(set.has(0)).toBe(true)
            expect(set.has(-0)).toBe(true)
        })

        it('works with empty string', () => {
            const set = new FifoSet<string>()
            set.add('')
            expect(set.has('')).toBe(true)
            expect(set.size).toBe(1)
        })

        it('works with boolean values', () => {
            const set = new FifoSet<boolean>()
            set.add(true).add(false)
            expect(set.size).toBe(2)
            expect(set.has(true)).toBe(true)
            expect(set.has(false)).toBe(true)
        })

        it('works with bigint values', () => {
            const set = new FifoSet<bigint>()
            set.add(1n).add(2n).add(3n)
            expect(set.size).toBe(3)
            expect(set.has(2n)).toBe(true)
        })

        it('two different objects are treated as different values', () => {
            const a = { id: 1 }
            const b = { id: 1 }
            const set = new FifoSet<object>()
            set.add(a).add(b)
            expect(set.size).toBe(2)
        })
    })

    describe('delete edge cases', () => {
        it('deletes the only element', () => {
            const set = new FifoSet<string>()
            set.add('a')
            expect(set.delete('a')).toBe(true)
            expect(set.size).toBe(0)
            expect(set.peekNewest()).toBeUndefined()
            expect(set.peekOldest()).toBeUndefined()
        })

        it('deletes head element correctly', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            set.delete('a')
            expect([...set]).toEqual(['b', 'c'])
            expect(set.peekOldest()).toBe('b')
        })

        it('deletes tail element correctly', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            set.delete('c')
            expect([...set]).toEqual(['a', 'b'])
            expect(set.peekNewest()).toBe('b')
        })

        it('deletes a middle element correctly', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            set.delete('b')
            expect([...set]).toEqual(['a', 'c'])
            expect(set.size).toBe(2)
        })

        it('delete after clear returns false', () => {
            const set = new FifoSet<string>()
            set.add('a')
            set.clear()
            expect(set.delete('a')).toBe(false)
        })

        it('re-add after delete works', () => {
            const set = new FifoSet<string>(3)
            set.add('a').add('b')
            set.delete('a')
            set.add('a')
            expect(set.has('a')).toBe(true)
            expect(set.size).toBe(2)
            expect([...set]).toEqual(['b', 'a'])
        })

        it('delete all elements one by one', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            set.delete('b')
            set.delete('a')
            set.delete('c')
            expect(set.size).toBe(0)
            expect([...set]).toEqual([])
        })

        it('peek returns undefined after deleting all', () => {
            const set = new FifoSet<string>()
            set.add('a')
            set.delete('a')
            expect(set.peekNewest()).toBeUndefined()
            expect(set.peekOldest()).toBeUndefined()
        })

        it('has returns false after delete', () => {
            const set = new FifoSet<string>()
            set.add('a')
            set.delete('a')
            expect(set.has('a')).toBe(false)
        })
    })

    describe('clear edge cases', () => {
        it('clear on already empty set', () => {
            const set = new FifoSet<string>()
            set.clear()
            expect(set.size).toBe(0)
        })

        it('double clear', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            set.clear()
            set.clear()
            expect(set.size).toBe(0)
        })

        it('iteration after clear yields nothing', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            set.clear()
            expect([...set]).toEqual([])
            expect([...set.keys()]).toEqual([])
            expect([...set.entries()]).toEqual([])
        })

        it('peekOldest and peekNewest return undefined after clear', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            set.clear()
            expect(set.peekOldest()).toBeUndefined()
            expect(set.peekNewest()).toBeUndefined()
        })
    })

    describe('eviction edge cases', () => {
        it('eviction with maxSize=1 maintains correct peeks', () => {
            const set = new FifoSet<string>(1)
            set.add('a')
            expect(set.peekOldest()).toBe('a')
            expect(set.peekNewest()).toBe('a')
            set.add('b')
            expect(set.peekOldest()).toBe('b')
            expect(set.peekNewest()).toBe('b')
        })

        it('rapid cycling maintains integrity', () => {
            const set = new FifoSet<number>(3)

            for (let i = 0; i < 100; i++) {
                set.add(i)
            }

            expect(set.size).toBe(3)
            expect(set.has(99)).toBe(true)
            expect(set.has(98)).toBe(true)
            expect(set.has(97)).toBe(true)
            expect(set.has(96)).toBe(false)
            expect([...set]).toEqual([97, 98, 99])
        })

        it('eviction after delete does not evict prematurely', () => {
            const set = new FifoSet<string>(3)
            set.add('a').add('b').add('c')
            set.delete('b')
            set.add('d')
            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(true)
            expect(set.has('c')).toBe(true)
            expect(set.has('d')).toBe(true)
        })

        it('add duplicate at capacity does not evict', () => {
            const set = new FifoSet<string>(3)
            set.add('a').add('b').add('c')
            set.add('b')
            expect(set.size).toBe(3)
            expect(set.has('a')).toBe(true)
            expect(set.has('b')).toBe(true)
            expect(set.has('c')).toBe(true)
        })

        it('eviction order is strictly FIFO', () => {
            const set = new FifoSet<string>(2)
            set.add('a').add('b')
            expect(set.peekOldest()).toBe('a')
            set.add('c')
            expect(set.peekOldest()).toBe('b')
            set.add('d')
            expect(set.peekOldest()).toBe('c')
        })
    })

    describe('iteration edge cases', () => {
        it('multiple iterators work independently', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            const iter1 = set.values()
            const iter2 = set.values()
            expect(iter1.next().value).toBe('a')
            expect(iter2.next().value).toBe('a')
            expect(iter1.next().value).toBe('b')
            expect(iter2.next().value).toBe('b')
        })

        it('toJSON returns new array each time', () => {
            const set = new FifoSet<string>()
            set.add('a')
            const json1 = set.toJSON()
            const json2 = set.toJSON()
            expect(json1).toEqual(json2)
            expect(json1).not.toBe(json2)
        })

        it('for-of with break exits early', () => {
            const set = new FifoSet<number>()
            set.add(1).add(2).add(3)
            const collected: number[] = []

            for (const v of set) {
                collected.push(v)

                if (v === 2) {
                    break
                }
            }

            expect(collected).toEqual([1, 2])
        })

        it('Array.from works', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            expect([...set]).toEqual(['a', 'b'])
        })

        it('destructuring works', () => {
            const set = new FifoSet<string>()
            set.add('x')
            const [first] = set
            expect(first).toBe('x')
        })

        it('entries on single item', () => {
            const set = new FifoSet<string>()
            set.add('x')
            expect([...set.entries()]).toEqual([['x', 'x']])
        })

        it('keys returns same values as values()', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b').add('c')
            const keys = [...set.keys()]
            const values = [...set.values()]
            expect(keys).toEqual(values)
        })
    })

    describe('JSON serialization edge cases', () => {
        it('JSON.stringify with object values', () => {
            const set = new FifoSet<{ id: number }>()
            set.add({ id: 1 }).add({ id: 2 })
            expect(JSON.stringify(set)).toBe('[{"id":1},{"id":2}]')
        })

        it('JSON.stringify with null values', () => {
            const set = new FifoSet<null>()
            set.add(null)
            expect(JSON.stringify(set)).toBe('[null]')
        })

        it('JSON.stringify after eviction', () => {
            const set = new FifoSet<string>(2)
            set.add('a').add('b').add('c')
            expect(JSON.stringify(set)).toBe('["b","c"]')
        })

        it('toJSON after clear', () => {
            const set = new FifoSet<string>()
            set.add('a').add('b')
            set.clear()
            expect(set.toJSON()).toEqual([])
            expect(JSON.stringify(set)).toBe('[]')
        })
    })

    describe('interleaved operations', () => {
        it('add-delete-add-delete cycle', () => {
            const set = new FifoSet<string>(3)
            set.add('a')
            set.delete('a')
            set.add('a')
            set.delete('a')
            expect(set.size).toBe(0)
            expect(set.has('a')).toBe(false)
        })

        it('fill to capacity, clear, refill', () => {
            const set = new FifoSet<string>(2)
            set.add('a').add('b')
            set.clear()
            set.add('x').add('y').add('z')
            expect(set.size).toBe(2)
            expect(set.has('x')).toBe(false)
            expect([...set]).toEqual(['y', 'z'])
        })

        it('peek after every add', () => {
            const set = new FifoSet<string>()
            set.add('a')
            expect(set.peekOldest()).toBe('a')
            expect(set.peekNewest()).toBe('a')
            set.add('b')
            expect(set.peekOldest()).toBe('a')
            expect(set.peekNewest()).toBe('b')
            set.add('c')
            expect(set.peekOldest()).toBe('a')
            expect(set.peekNewest()).toBe('c')
        })

        it('delete non-existent between valid ops', () => {
            const set = new FifoSet<string>()
            set.add('a')
            expect(set.delete('z')).toBe(false)
            set.add('b')
            expect(set.delete('y')).toBe(false)
            expect(set.size).toBe(2)
        })

        it('size consistency through complex sequences', () => {
            const set = new FifoSet<string>(3)
            expect(set.size).toBe(0)
            set.add('a')
            expect(set.size).toBe(1)
            set.add('b')
            expect(set.size).toBe(2)
            set.add('c')
            expect(set.size).toBe(3)
            set.add('d')
            expect(set.size).toBe(3)
            set.delete('c')
            expect(set.size).toBe(2)
            set.add('c')
            expect(set.size).toBe(3)
            set.add('c')
            expect(set.size).toBe(3)
            set.clear()
            expect(set.size).toBe(0)
            set.add('x')
            expect(set.size).toBe(1)
        })

        it('delete then re-add same value', () => {
            const set = new FifoSet<string>(3)
            set.add('a').add('b').add('c')
            set.delete('b')
            set.add('b')
            expect(set.has('b')).toBe(true)
            expect(set.size).toBe(3)
            expect([...set]).toEqual(['a', 'c', 'b'])
        })
    })
})
