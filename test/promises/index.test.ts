import { describe, expect, it } from 'bun:test'
import * as promises from '@/promises'
import { pTap, tryCatchAsync } from '@/promises/compositions'

describe('promises index exports', () => {
    it('re-exports pTap from the promises barrel', () => {
        expect(promises.pTap).toBe(pTap)
    })

    it('re-exports tryCatchAsync from the promises barrel', () => {
        expect(promises.tryCatchAsync).toBe(tryCatchAsync)
    })
})
