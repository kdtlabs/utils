import type { BinaryLike, BinaryToTextEncoding, HashOptions } from 'node:crypto'
import type { PathLike } from './types'
import { createHash } from 'node:crypto'
import { createReadStream, readFileSync } from 'node:fs'
import { pathToString } from './path'

export const computeHash = (data: BinaryLike, algorithm: string, encoding: BinaryToTextEncoding = 'hex', options: HashOptions = {}) => (
    createHash(algorithm, options).update(data).digest(encoding)
)

export const getFileHash = (path: PathLike, algorithm: string, options: HashOptions = {}) => (
    computeHash(readFileSync(pathToString(path)), algorithm, 'hex', options)
)

export const getLargeFileHash = (path: PathLike, algorithm: string, options: HashOptions = {}) => new Promise<string>((resolve, reject) => {
    const hash = createHash(algorithm, options)
    const stream = createReadStream(pathToString(path))

    stream.on('data', (chunk) => hash.update(chunk))
    stream.on('end', () => resolve(hash.digest('hex')))
    stream.on('error', reject)
})
