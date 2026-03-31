import { afterAll, describe, expect, it } from 'bun:test'
import { addExitHandler, gracefulExit, isExiting } from '../../src/system/graceful-exit'

const exitCodes: number[] = []
const originalExit = process.exit

Object.defineProperty(process, 'exit', { configurable: true, value: (code?: number) => exitCodes.push(code ?? 0), writable: true })

type ExitHandler = Parameters<typeof addExitHandler>[0]

afterAll(() => {
    Object.defineProperty(process, 'exit', { configurable: true, value: originalExit, writable: true })
})

function freshModule() {
    const modulePath = require.resolve('../../src/system/graceful-exit')
    delete require.cache[modulePath]

    return import('../../src/system/graceful-exit')
}

describe('graceful-exit', () => {
    it('isExiting returns false before exit', () => {
        expect(isExiting()).toBe(false)
    })

    it('unregister removes handler, remaining handler runs, dedup returns same promise', async () => {
        exitCodes.length = 0
        let removedCalled = false

        const unregister = addExitHandler(() => {
            removedCalled = true

            return Promise.resolve()
        })

        unregister()

        addExitHandler(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5))
        })

        const promise1 = gracefulExit(9)
        const promise2 = gracefulExit(99)

        expect(promise1).toBe(promise2)
        expect(isExiting()).toBe(true)

        await promise1

        expect(removedCalled).toBe(false)
        expect(exitCodes).toContain(9)
    })

    it('calls process.exit immediately when no handlers registered (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()

        await fresh.gracefulExit(42)

        expect(exitCodes).toContain(42)
    })

    it('uses default exitCode 0 (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()

        await fresh.gracefulExit()

        expect(exitCodes).toContain(0)
    })

    it('runs handlers and calls process.exit after all settle (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()
        const order: string[] = []

        fresh.addExitHandler(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5))
            order.push('handler1')
        })

        fresh.addExitHandler(() => {
            order.push('handler2')

            return Promise.resolve()
        })

        await fresh.gracefulExit(3)

        expect(order).toContain('handler1')
        expect(order).toContain('handler2')
        expect(exitCodes).toContain(3)
    })

    it('triggers timeout when handlers are slow (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()

        fresh.addExitHandler(async () => {
            await new Promise((resolve) => setTimeout(resolve, 500))
        }, 1)

        const promise = fresh.gracefulExit(7, 1)

        await new Promise((resolve) => setTimeout(resolve, 20))
        expect(exitCodes).toContain(7)

        await promise
    })

    it('runs all handlers even if one throws synchronously (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()
        const order: string[] = []

        fresh.addExitHandler((() => {
            throw new Error('sync throw')
        }) as unknown as ExitHandler)

        fresh.addExitHandler(() => {
            order.push('handler2')

            return Promise.resolve()
        })

        await fresh.gracefulExit(0)

        expect(order).toContain('handler2')
    })

    it('uses higher maxWaitTime from handler registration (fresh module)', async () => {
        exitCodes.length = 0
        const fresh = await freshModule()

        fresh.addExitHandler(async () => {
            await new Promise((resolve) => setTimeout(resolve, 5))
        }, 10_000)

        await fresh.gracefulExit(0, 1)

        expect(exitCodes).toContain(0)
    })
})
