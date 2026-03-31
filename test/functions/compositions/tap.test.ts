import { describe, expect, it } from 'bun:test'
import { tap } from '@/functions/compositions'

describe('tap', () => {
    it('calls callback with the value', () => {
        let captured: unknown

        tap(42, (v) => {
            captured = v
        })

        expect(captured).toBe(42)
    })

    it('returns the original value', () => {
        const obj = { a: 1 }

        const result = tap(obj, () => {})

        expect(result).toBe(obj)
    })
})
