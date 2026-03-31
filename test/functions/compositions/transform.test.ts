import { describe, expect, it } from 'bun:test'
import { transform } from '@/functions/compositions'

describe('transform', () => {
    it('passes value through callback and returns the result', () => {
        expect(transform(5, (v) => v * 2)).toBe(10)
    })
})
