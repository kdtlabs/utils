import { describe, expect, it } from 'bun:test'
import { getEnv } from '@/system/env'

describe('getEnv', () => {
    const env: Record<string, string> = {
        DATABASE_URL: 'postgres://localhost',
        API_KEY: 'secret',
        APP_DATABASE_URL: 'postgres://app',
        APP_API_KEY: 'app-secret',
        APP_EMPTY: '',
        PORT: '3000',
    }

    it('returns values for requested keys', () => {
        const result = getEnv(['DATABASE_URL', 'API_KEY'], { env })

        expect(result).toEqual({
            DATABASE_URL: 'postgres://localhost',
            API_KEY: 'secret',
        })
    })

    it('returns undefined for missing keys', () => {
        const result = getEnv(['MISSING', 'ALSO_MISSING'], { env })

        expect(result).toEqual({
            MISSING: undefined,
            ALSO_MISSING: undefined,
        })
    })

    it('uses prefix to lookup but returns original keys', () => {
        const result = getEnv(['DATABASE_URL', 'API_KEY'], { env, prefix: 'APP_' })

        expect(result).toEqual({
            DATABASE_URL: 'postgres://app',
            API_KEY: 'app-secret',
        })
    })

    it('returns undefined when prefixed key does not exist', () => {
        const result = getEnv(['NOPE'], { env, prefix: 'APP_' })

        expect(result).toEqual({ NOPE: undefined })
    })

    it('preserves empty string values', () => {
        const result = getEnv(['EMPTY'], { env, prefix: 'APP_' })

        expect(result).toEqual({ EMPTY: '' })
    })

    it('returns empty object for empty keys array', () => {
        expect(getEnv([], { env })).toEqual({})
    })

    it('defaults to process.env when env option is omitted', () => {
        const original = process.env.TEST_GET_ENV_DEFAULT

        process.env.TEST_GET_ENV_DEFAULT = 'from-process'

        const result = getEnv(['TEST_GET_ENV_DEFAULT'])

        expect(result).toEqual({ TEST_GET_ENV_DEFAULT: 'from-process' })

        if (original === undefined) {
            delete process.env.TEST_GET_ENV_DEFAULT
        } else {
            process.env.TEST_GET_ENV_DEFAULT = original
        }
    })

    it('falls back to non-prefixed key when includeNonePrefix is true and prefixed key is missing', () => {
        const result = getEnv(['PORT'], { env, prefix: 'APP_', includeNonePrefix: true })

        expect(result).toEqual({ PORT: '3000' })
    })

    it('prefers prefixed key over non-prefixed when includeNonePrefix is true', () => {
        const result = getEnv(['API_KEY'], { env, prefix: 'APP_', includeNonePrefix: true })

        expect(result).toEqual({ API_KEY: 'app-secret' })
    })

    it('does not fall back to non-prefixed key when includeNonePrefix is false', () => {
        const result = getEnv(['PORT'], { env, prefix: 'APP_', includeNonePrefix: false })

        expect(result).toEqual({ PORT: undefined })
    })
})
