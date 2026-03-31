import { describe, expect, test } from 'bun:test'
import { timestamp } from '../../../src/times/factories'

describe('timestamp', () => {
    test('returns a number', () => {
        expect(typeof timestamp()).toBe('number')
    })

    test('returns a value close to current unix timestamp', () => {
        const before = Math.floor(Date.now() / 1000)
        const result = timestamp()
        const after = Math.floor(Date.now() / 1000)

        expect(result).toBeGreaterThanOrEqual(before)
        expect(result).toBeLessThanOrEqual(after)
    })

    test('returns an integer', () => {
        expect(Number.isInteger(timestamp())).toBe(true)
    })
})
