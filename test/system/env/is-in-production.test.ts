import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { isInProd, isInProduction } from '../../../src/system/env'

describe('isInProduction', () => {
    let originalEnv: string | undefined

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
    })

    it('returns true when NODE_ENV is "production"', () => {
        process.env.NODE_ENV = 'production'
        expect(isInProduction()).toBe(true)
    })

    it('returns true when NODE_ENV is "prod"', () => {
        process.env.NODE_ENV = 'prod'
        expect(isInProduction()).toBe(true)
    })

    it('returns false when NODE_ENV is "development"', () => {
        process.env.NODE_ENV = 'development'
        expect(isInProduction()).toBe(false)
    })

    it('returns false when NODE_ENV is undefined', () => {
        delete process.env.NODE_ENV
        expect(isInProduction()).toBe(false)
    })

    it('is aliased as isInProd', () => {
        expect(isInProd).toBe(isInProduction)
    })
})
