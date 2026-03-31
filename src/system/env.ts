import { isUndefined } from '../core'

export const isInMode = (key: string) => process.env.NODE_ENV === key

export const isInDevelopment = () => isInMode('development') || isInMode('dev')
export const isInDev = isInDevelopment

export const isInProduction = () => isInMode('production') || isInMode('prod')
export const isInProd = isInProduction

export const isInStaging = () => isInMode('staging') || isInMode('stage')
export const isInStage = isInStaging

export interface GetEnvOptions {
    env?: NodeJS.ProcessEnv
    includeNonePrefix?: boolean
    prefix?: string
}

export function getEnv<T extends string>(key: T[], { env = process.env, includeNonePrefix = false, prefix }: GetEnvOptions = {}) {
    const result: Record<string, string | undefined> = {}

    for (const k of key) {
        result[k] = env[prefix ? `${prefix}${k}` : k]

        if (includeNonePrefix && isUndefined(result[k])) {
            result[k] = env[k]
        }
    }

    return result as Record<T, string | undefined>
}
