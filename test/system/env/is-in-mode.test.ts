import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { isInMode } from '../../../src/system/env'

describe('isInMode', () => {
    let originalEnv: string | undefined

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
    })

    it('returns true when NODE_ENV matches the given key', () => {
        process.env.NODE_ENV = 'production'
        expect(isInMode('production')).toBe(true)
    })

    it('returns false when NODE_ENV does not match', () => {
        process.env.NODE_ENV = 'development'
        expect(isInMode('production')).toBe(false)
    })

    it('returns false when NODE_ENV is undefined', () => {
        delete process.env.NODE_ENV
        expect(isInMode('production')).toBe(false)
    })

    it('is case-sensitive', () => {
        process.env.NODE_ENV = 'Production'
        expect(isInMode('production')).toBe(false)
    })

    it('matches arbitrary custom mode strings', () => {
        process.env.NODE_ENV = 'custom-mode'
        expect(isInMode('custom-mode')).toBe(true)
    })

    it('returns false for empty string when NODE_ENV is not set', () => {
        delete process.env.NODE_ENV
        expect(isInMode('')).toBe(false)
    })

    it('returns true for empty string when NODE_ENV is empty', () => {
        process.env.NODE_ENV = ''
        expect(isInMode('')).toBe(true)
    })
})
