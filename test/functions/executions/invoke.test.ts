import { describe, expect, it } from 'bun:test'
import { invoke } from '../../../src/functions/executions'

describe('invoke', () => {
    it('calls the function and returns its result', () => {
        expect(invoke(() => 42)).toBe(42)
    })
})
