import { describe, expect, it } from 'bun:test'
import { noop } from '@/functions/executions'

describe('noop', () => {
    it('returns undefined', () => {
        expect(noop()).toBeUndefined()
    })
})
