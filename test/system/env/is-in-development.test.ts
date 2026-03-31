import { afterEach, beforeEach, describe, expect, it } from 'bun:test'
import { isInDev, isInDevelopment } from '@/system/env'

describe('isInDevelopment', () => {
    let originalEnv: string | undefined

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV
    })

    afterEach(() => {
        process.env.NODE_ENV = originalEnv
    })

    it('returns true when NODE_ENV is "development"', () => {
        process.env.NODE_ENV = 'development'
        expect(isInDevelopment()).toBe(true)
    })

    it('returns true when NODE_ENV is "dev"', () => {
        process.env.NODE_ENV = 'dev'
        expect(isInDevelopment()).toBe(true)
    })

    it('returns false when NODE_ENV is "production"', () => {
        process.env.NODE_ENV = 'production'
        expect(isInDevelopment()).toBe(false)
    })

    it('returns false when NODE_ENV is undefined', () => {
        delete process.env.NODE_ENV
        expect(isInDevelopment()).toBe(false)
    })

    it('is aliased as isInDev', () => {
        expect(isInDev).toBe(isInDevelopment)
    })
})
