import type { PathLike } from './types'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { bufferToString, isBufferLike } from '@/buffers'

export const pathToString = (path: PathLike) => (
    isBufferLike(path) ? bufferToString(path) : path.toString()
)

export const pwd = (importMeta: ImportMeta, ...path: PathLike[]) => (
    join(dirname(fileURLToPath(importMeta.url)), ...path.map(pathToString))
)
