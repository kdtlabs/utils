import type { IsTrueLikeOptions } from '../core'
import { z } from 'zod'
import { isTrueLike } from '../core'
import { isNumberString } from '../numbers'
import { isHexString, isStrictHexString } from '../strings'
import { isDirectory, isFile, isReadable, isWritable, isWritableDirectory } from '../system'
import { isValidDate } from '../times'

export const PROTOCOL_PATTERNS = <const>{
    file: /^file$/u,
    ftp: /^ftps?$/u,
    http: /^https?$/u,
    ssh: /^ssh$/u,
    ws: /^wss?$/u,
}

export type Protocol = keyof typeof PROTOCOL_PATTERNS

export function url(...protocols: Array<Protocol | Protocol[]>) {
    const flat = protocols.flat()
    const patterns = flat.map((p) => PROTOCOL_PATTERNS[p])
    const combined = new RegExp(`^(?:${patterns.map((r) => r.source.slice(1, -1)).join('|')})$`)

    return z.url({ protocol: combined })
}

export const hexString = (length?: number) => (
    z.string().refine((val) => isHexString(val, length), {
        error: length ? `Invalid hex string (expected ${length} bytes)` : 'Invalid hex string',
    })
)

export const strictHexString = (length?: number) => (
    z.string().refine((val) => isStrictHexString(val, length), {
        error: length ? `Invalid strict hex string (expected 0x prefix, ${length} bytes)` : 'Invalid strict hex string (expected 0x prefix)',
    })
)

export const numberString = () => (
    z.string().refine((val) => isNumberString(val), {
        error: 'Invalid number string',
    })
)

export const validDate = () => (
    z.custom<Date>((val) => isValidDate(val), { error: 'Invalid date' })
)

export const trueLike = (options?: IsTrueLikeOptions) => z.unknown().transform((val) => isTrueLike(val, options))

export const filePath = () => z.string().refine((val) => isFile(val), {
    error: 'Path is not a file',
})

export const directoryPath = () => (
    z.string().refine((val) => isDirectory(val), {
        error: 'Path is not a directory',
    })
)

export const readable = () => (
    z.string().refine((val) => isReadable(val), {
        error: 'Path is not readable',
    })
)

export const writable = () => (
    z.string().refine((val) => isWritable(val), {
        error: 'Path is not writable',
    })
)

export const writableDirectory = () => (
    z.string().refine((val) => isWritableDirectory(val), {
        error: 'Path is not a writable directory',
    })
)
