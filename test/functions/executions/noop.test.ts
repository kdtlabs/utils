import { describe, expect, it } from 'bun:test'
import { noop } from '../../../src/functions/executions'

describe('noop', () => {
    it('returns undefined', () => {
        expect(noop()).toBeUndefined()
    })
})
