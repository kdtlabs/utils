export type SpecialNumberString = '+Infinity' | '-Infinity' | 'Infinity' | 'NaN'

export type NumberString<TStrict extends boolean = false> = SpecialNumberString | (TStrict extends true ? `${number}` : string)

export type Numberish<TStrict extends boolean = false> = NumberString<TStrict> | bigint | number

export type Percentage = { __brand: 'Percentage' } & number
