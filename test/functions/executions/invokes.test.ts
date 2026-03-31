import { describe, expect, it } from 'bun:test'
import { invokes } from '@/functions/executions'

describe('invokes', () => {
    it('calls all functions in order', () => {
        const calls: number[] = []

        invokes([
            () => calls.push(1),
            () => calls.push(2),
            () => calls.push(3),
        ])

        expect(calls).toEqual([1, 2, 3])
    })

    it('skips null and undefined entries', () => {
        const calls: number[] = []

        invokes([
            () => calls.push(1),
            null,
            undefined,
            () => calls.push(2),
        ])

        expect(calls).toEqual([1, 2])
    })

    it('handles empty array', () => {
        expect(() => invokes([])).not.toThrow()
    })
})
