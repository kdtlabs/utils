import type { PathLike } from './types'
import { accessSync, constants, existsSync, type MakeDirectoryOptions, mkdirSync, statSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { isErrnoException, isMissingDirectoryError } from '../errors'
import { pathToString } from './path'

export function hasAccess(path: PathLike, mode?: number) {
    try {
        accessSync(pathToString(path), mode)

        return true
    } catch {
        return false
    }
}

export const isReadable = (path: PathLike) => hasAccess(path, constants.R_OK)

export const isWritable = (path: PathLike) => hasAccess(path, constants.W_OK)

export function isFile(path: PathLike) {
    try {
        return statSync(pathToString(path)).isFile()
    } catch {
        return false
    }
}

export function isDirectory(path: PathLike) {
    try {
        return statSync(pathToString(path)).isDirectory()
    } catch {
        return false
    }
}

export function isWritableDirectory(dirPath: PathLike): boolean {
    const resolved = resolve(pathToString(dirPath))

    try {
        accessSync(resolved, constants.W_OK)

        return true
    } catch (error) {
        if (isErrnoException(error) && isMissingDirectoryError(error)) {
            const parent = dirname(resolved)

            if (parent === resolved) {
                return false
            }

            return isWritableDirectory(parent)
        }

        return false
    }
}

export function ensureDirectory(path: PathLike, options: MakeDirectoryOptions = {}) {
    const resolved = pathToString(path)

    if (!existsSync(resolved)) {
        mkdirSync(resolved, { recursive: true, ...options })
    }
}
