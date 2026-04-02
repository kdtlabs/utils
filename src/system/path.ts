import type { PathLike } from './types'
import { homedir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bufferToString, isBufferLike } from '../buffers'

export const pathToString = (path: PathLike) => (
    isBufferLike(path) ? bufferToString(path) : path.toString()
)

export const pwd = (importMeta: ImportMeta, ...path: PathLike[]) => (
    join(dirname(fileURLToPath(importMeta.url)), ...path.map(pathToString))
)

export function resolvePath(path: PathLike) {
    const str = pathToString(path)

    if (str.startsWith('~/')) {
        return resolve(homedir(), str.slice(2))
    }

    return resolve(str)
}
