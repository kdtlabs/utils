import { describe, expect, it } from 'bun:test'
import { AsyncChannel } from '../../src/promises/async-channel'

async function collect<T>(channel: AsyncChannel<T>) {
    const results: T[] = []

    for await (const value of channel) {
        results.push(value)
    }

    return results
}

describe('AsyncChannel', () => {
    describe('push and iterate', () => {
        it('yields pushed values in order', async () => {
            const ch = new AsyncChannel<string>()

            ch.push('a', 'b', 'c')
            ch.close()

            const result = await collect(ch)

            expect(result).toEqual(['a', 'b', 'c'])
        })

        it('yields buffered values pushed before consumer starts', async () => {
            const ch = new AsyncChannel<number>()

            ch.push(1, 2, 3)
            ch.close()

            const result = await collect(ch)

            expect(result).toEqual([1, 2, 3])
        })

        it('wakes consumer when value is pushed while awaiting', async () => {
            const ch = new AsyncChannel<string>()
            const results: string[] = []

            const consumer = (async () => {
                for await (const value of ch) {
                    results.push(value)
                }
            })()

            await Promise.resolve()

            ch.push('hello')

            await Promise.resolve()

            ch.push('world')
            ch.close()

            await consumer

            expect(results).toEqual(['hello', 'world'])
        })
    })

    describe('close', () => {
        it('drains remaining buffer then exits', async () => {
            const ch = new AsyncChannel<number>()

            ch.push(1, 2)

            const consumer = (async () => {
                const results: number[] = []

                for await (const value of ch) {
                    results.push(value)

                    if (results.length === 1) {
                        ch.close()
                    }
                }

                return results
            })()

            const result = await consumer

            expect(result).toEqual([1, 2])
        })

        it('exits immediately when closed with empty buffer', async () => {
            const ch = new AsyncChannel<string>()

            ch.close()

            const result = await collect(ch)

            expect(result).toEqual([])
        })

        it('ignores push after close', async () => {
            const ch = new AsyncChannel<string>()

            ch.push('a')
            ch.close()
            ch.push('b')

            const result = await collect(ch)

            expect(result).toEqual(['a'])
        })

        it('handles close called multiple times', async () => {
            const ch = new AsyncChannel<string>()

            ch.push('a')
            ch.close()
            ch.close()

            const result = await collect(ch)

            expect(result).toEqual(['a'])
        })

        it('yields nothing from empty channel closed immediately', async () => {
            const ch = new AsyncChannel<number>()

            ch.close()

            const result = await collect(ch)

            expect(result).toEqual([])
        })
    })

    describe('break and re-iterate', () => {
        it('supports break from for-await mid-stream', async () => {
            const ch = new AsyncChannel<number>()

            ch.push(1, 2, 3)

            const results: number[] = []

            for await (const value of ch) {
                results.push(value)

                if (value === 2) {
                    break
                }
            }

            expect(results).toEqual([1, 2])
        })

        it('yields nothing when re-iterating a closed empty channel', async () => {
            const ch = new AsyncChannel<string>()

            ch.push('a')
            ch.close()

            await collect(ch)

            const second = await collect(ch)

            expect(second).toEqual([])
        })
    })
})
