import { describe, expect, it } from 'bun:test'
import { createDeferred } from '../../src/promises/deferred'
import { pMemoize } from '../../src/promises/memoize'

describe('pMemoize', () => {
    describe('basic caching', () => {
        it('returns cached result for same args', async () => {
            let callCount = 0

            const fn = pMemoize(async (id: string) => {
                callCount++

                return `user-${id}`
            })

            const first = await fn('abc')
            const second = await fn('abc')

            expect(first).toBe('user-abc')
            expect(second).toBe('user-abc')
            expect(callCount).toBe(1)
        })

        it('produces separate cache entries for different args', async () => {
            let callCount = 0

            const fn = pMemoize(async (id: string) => {
                callCount++

                return `user-${id}`
            })

            const a = await fn('a')
            const b = await fn('b')

            expect(a).toBe('user-a')
            expect(b).toBe('user-b')
            expect(callCount).toBe(2)
        })
    })

    describe('inflight dedup', () => {
        it('shares the same pending promise for concurrent calls with same key', async () => {
            let callCount = 0
            const deferred = createDeferred<string>()

            const fn = pMemoize(async (_key: string) => {
                callCount++

                return deferred
            })

            const p1 = fn('key')
            const p2 = fn('key')

            expect(p1).toBe(p2)
            expect(callCount).toBe(1)

            deferred.resolve('result')

            const [r1, r2] = await Promise.all([p1, p2])

            expect(r1).toBe('result')
            expect(r2).toBe('result')
        })
    })

    describe('custom resolver', () => {
        it('uses resolver to compute cache key', async () => {
            let callCount = 0

            const fn = pMemoize(

                async (a: number, b: number) => {
                    callCount++

                    return a + b
                },
                { resolver: (a, b) => `${a}:${b}` },
            )

            const first = await fn(1, 2)
            const second = await fn(1, 2)
            const third = await fn(2, 1)

            expect(first).toBe(3)
            expect(second).toBe(3)
            expect(third).toBe(3)
            expect(callCount).toBe(2)
        })
    })

    describe('custom cache', () => {
        it('uses provided cache implementation', async () => {
            const customCache = new Map<unknown, Promise<string>>()

            const fn = pMemoize(

                async (id: string) => `user-${id}`,
                { cache: customCache },
            )

            await fn('abc')

            expect(customCache.has('abc')).toBeTrue()
            expect(fn.cache).toBe(customCache)
        })
    })

    describe('rejection handling', () => {
        it('does not cache rejection by default', async () => {
            let callCount = 0

            const fn = pMemoize(async (_key: string) => {
                callCount++

                if (callCount === 1) {
                    throw new Error('fail')
                }

                return 'success'
            })

            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(fn('key')).rejects.toThrow('fail')

            expect(fn.cache.has('key')).toBeFalse()

            const result = await fn('key')

            expect(result).toBe('success')
            expect(callCount).toBe(2)
        })

        it('caches rejection when cacheRejection is true', async () => {
            let callCount = 0

            const fn = pMemoize(

                async (_key: string) => {
                    callCount++
                    throw new Error('fail')
                },
                { cacheRejection: true },
            )

            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(fn('key')).rejects.toThrow('fail')
            // eslint-disable-next-line @typescript-eslint/await-thenable
            await expect(fn('key')).rejects.toThrow('fail')

            expect(callCount).toBe(1)
        })
    })

    describe('.cache property', () => {
        it('exposes the cache on the returned function', () => {
            const fn = pMemoize(async () => 'value')

            expect(fn.cache).toBeDefined()
            expect(typeof fn.cache.has).toBe('function')
            expect(typeof fn.cache.get).toBe('function')
            expect(typeof fn.cache.set).toBe('function')
            expect(typeof fn.cache.delete).toBe('function')
        })
    })

    describe('this context', () => {
        it('forwards this context to original function', async () => {
            const obj = {

                fn: pMemoize(async function (this: { prefix: string }, name: string) {
                    return `${this.prefix}-${name}`
                }),
                prefix: 'hello',
            }

            const result = await obj.fn('world')

            expect(result).toBe('hello-world')
        })
    })
})
