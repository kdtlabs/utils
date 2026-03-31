export type Primitive = bigint | boolean | number | string | symbol | null | undefined

export type Optional<T> = T | undefined

export type Nullable<T> = T | null

export type Nullish<T> = T | null | undefined

export type Never<T extends never = never> = T

export type IsContainsType<T, U> = Extract<T, U> extends never ? false : true

export type JsonablePrimitive = boolean | number | string | null

export type Jsonable = Jsonable[] | JsonablePrimitive | { [key: string]: Jsonable }
