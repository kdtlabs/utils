import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { isInStage, isInStaging } from '@/system/env'

describe('isInStaging', () => {
    let originalEnv: string | undefined

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
    })

    it('returns true when NODE_ENV is "staging"', () => {
        process.env.NODE_ENV = 'staging'
        expect(isInStaging()).toBe(true)
    })

    it('returns true when NODE_ENV is "stage"', () => {
        process.env.NODE_ENV = 'stage'
        expect(isInStaging()).toBe(true)
    })

    it('returns false when NODE_ENV is "production"', () => {
        process.env.NODE_ENV = 'production'
        expect(isInStaging()).toBe(false)
    })

    it('returns false when NODE_ENV is undefined', () => {
        delete process.env.NODE_ENV
        expect(isInStaging()).toBe(false)
    })

    it('is aliased as isInStage', () => {
        expect(isInStage).toBe(isInStaging)
    })
})
