export type Errorable = Error | (() => Error | string) | string

export type ErrorCtor = new (message?: string, options?: ErrorOptions) => Error

export interface ErrorLike {
    [key: string]: unknown
    cause?: unknown
    message?: string
    name: string
    stack?: string
}
