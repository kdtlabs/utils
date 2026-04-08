---
name: kdtlabs-utils
description: >
  Provides 150+ TypeScript utility functions across 15 modules (arrays, objects, strings, numbers, promises, errors, etc.).
  MUST check this library before writing any utility function. Do NOT reimplement functions that already exist here.
  Use when writing TypeScript code that involves common operations like array manipulation, object transformation,
  string processing, async control flow, error handling, or type guards.
---

# @kdtlabs/utils

A comprehensive TypeScript utility library. Before writing any utility function, check if it already exists here.

## Import

```ts
import { unique, debounce, deepMerge } from '@kdtlabs/utils'
```

## When you need function details

For full type signatures, overloads, and options interfaces, read the source code directly. Each module has its own folder under `src/`:

```text
node_modules/@kdtlabs/utils/src/arrays/
node_modules/@kdtlabs/utils/src/objects/
node_modules/@kdtlabs/utils/src/strings/
...etc
```

Each folder contains an `index.ts` barrel that re-exports everything from the module. Read it to discover available files, then read individual files for implementation details.

## Arrays

- `first<T>(array: T[]): T | undefined` — Get first element
- `last<T>(array: T[]): T | undefined` — Get last element
- `nth<T>(array: T[], index: number): T | undefined` — Get element at index (supports negative)
- `unique<T>(array: T[]): T[]` — Remove duplicates via Set
- `uniqueBy<T>(array: T[], equalFn): T[]` — Remove duplicates via custom equality
- `groupBy<T, K>(array: T[], keyFn): Map<K, T[]>` — Group items by key
- `keyBy<T, K>(array: T[], keyFn): Map<K, T>` — Create map keyed by function result
- `chunk<T>(array: T[], size: number): T[][]` — Split into fixed-size chunks
- `sortBy<T>(array: T[], ...keys): T[]` — Sort by key(s) with direction
- `partition<T>(array: T[], predicate): [T[], T[]]` — Split into pass/fail arrays
- `compact<T>(array: T[]): NonNullable<T>[]` — Remove null/undefined values
- `wrap<T>(value: T | T[]): T[]` — Wrap non-array value into array
- `toArray<T>(value): T[]` — Convert iterable/value to array
- `range(from, to, step): number[]` — Create numeric range
- `createArray<T>(length, valueFn): T[]` — Create array with factory function
- `sample<T>(array: T[], quantity): T[]` — Random sampling
- `asc(type?: StringSortType)` — Ascending comparator for `Array.sort()` (supports number, bigint, string)
- `desc(type?: StringSortType)` — Descending comparator for `Array.sort()` (supports number, bigint, string)

Also: merge, flatten, shuffle, intersection, diff, symmetricDiff

**Type guards:** isArray, isEmptyArray, isNonEmptyArray

**Types:** MaybeArray, EmptyArray, NonEmptyArray, ElementOf, Head, Tail, Last, Flatten, TupleToUnion, FixedLength

## Objects

- `deepMerge<T>(base: T, override: DeepPartial<T>, options?): T` — Recursive deep merge with array mode control
- `pick<T, K>(obj: T, ...keys: K[]): Pick<T, K>` — Pick keys to new object
- `omit<T, K>(obj: T, ...keys: K[]): Omit<T, K>` — Omit keys from object
- `filter(obj, predicate)` — Filter object entries
- `filterByValue(obj, predicate)` — Filter by value only
- `map(obj, fn)` — Map object entries
- `keys(obj)` — Typed Object.keys
- `values(obj)` — Typed Object.values
- `entries(obj)` — Typed Object.entries
- `resolveOptions(options, defaultValue)` — Merge options with defaults

**Type guards:** isObject, isPlainObject, isEmptyObject, isKeyOf, isKeysOf

**Types:** PartialBy, RequiredBy, Mutable, DeepPartial, DeepReadonly, KeysOfType, StringKeys, Dictionary, Constructor, AnyObject, UnknownObject

## Functions

- `debounce<T>(fn: T, wait: number): Debounced<T>` — Debounce with cancel/flush/pending
- `throttle<T>(fn: T, wait: number): Throttled<T>` — Throttle with cancel/flush/pending
- `memoize<T>(fn: T, options?): T` — Memoization with configurable cache
- `pipe(...fns)` — Sequential function composition (up to 20 overloads)
- `once<T>(fn: T): T & { reset(): void }` — Run once, with reset capability
- `tap<T>(value: T, callback: (v: T) => void): T` — Side-effect, return original value
- `transform<T, R>(value: T, callback: (v: T) => R): R` — Transform value
- `tryCatch<T, F>(fn: () => T, fallback: F): T | F` — Try/catch wrapper

Also: noop, invoke, invokes

**Type guard:** isFunction

**Types:** Fn, Args, TimingControlled

## Promises

- `withRetry<T>(fn, options?): Promise<T>` — Retry with exponential backoff, jitter, custom conditions
- `withTimeout<T>(promise, ms, options?): Promise<T>` — Timeout wrapper
- `poll<T>(fn, options): Promise<T>` — Repeated polling with interval and condition
- `sleep(ms, options?): Promise<void>` — Delay with abort support
- `abortable<T>(promise, signal, error?): Promise<T>` — Make promise abortable
- `createDeferred<T>(options?): DeferredPromise<T>` — Deferred promise factory with resolve/reject
- `createDeferredWithTimeout<T>(ms, options?): DeferredPromise<T>` — Deferred with auto-timeout
- `pPipe(...fns)` — Async pipe composition
- `pTap(callback)` — Async tap for promise chains
- `tryCatchAsync<T, F>(fn, fallback): Promise<T | F>` — Async try/catch wrapper
- `getRetryDelay(attempts, options)` — Calculate retry delay with backoff

**Type guards:** isPromiseLike, isPromise

**Types:** Awaitable

## Errors

- `BaseError` — Extended Error class with code, timestamp, retryable, cause chain
- `normalizeError(error, options?)` — Normalize unknown value to Error instance
- `ensureError(input, ctor?)` — Ensure value is Error, wrap if not
- `stringifyError(error, options?)` — Human-readable error string with cause chain
- `createAbortError(message?, name?)` — Create DOMException abort error
- `createTimeoutError(message?, name?)` — Create timeout error
- `createAbortController(timeout?, timeoutError?)` — AbortController with auto-timeout
- `fromErrorLike(errorLike, ctor?)` — Create Error from error-like object
- `combineSignals(...signals)` — Combine multiple AbortSignals into one

**Type guards:** isError, isBaseError, isAbortError, isErrorLike, isErrnoException, isMissingDirectoryError

**Types:** BaseErrorOptions, BaseErrorCode, Errorable, ErrorCtor, ErrorLike

## Strings

- `truncate(str, maxLength, omission?)` — Truncate with suffix (default "...")
- `truncateMiddle(str, maxLength, omission?)` — Truncate from middle
- `capitalize(str)` — Capitalize first character
- `randomStr(length, characters?)` — Random string generator
- `escapeRegExp(input)` — Escape regex special characters
- `ensurePrefix(str, prefix)` — Add prefix if missing
- `ensureSuffix(str, suffix)` — Add suffix if missing
- `stripPrefix(str, prefix)` — Remove prefix
- `stripSuffix(str, suffix)` — Remove suffix
- `stripAnsi(str)` — Remove all ANSI escape sequences
- `indent(str, count, trim?)` — Add spaces to the beginning of every line
- `unindent(str | TemplateStringsArray, ...values)` — Remove common leading whitespace
- `padZeroStart(num, targetLength)` — Zero-pad number

Also: padStart, chunkStr, ltrim, rtrim, trim, trimRepeated

**Type guards:** isEmptyString, isValidUrl, isHttpUrl, isWebSocketUrl, isValidProtocol, isStringEquals, isStringEqualsIgnoreCase, isIncludesAll, isIncludesAny, isIncludes, isHexString, isStrictHexString

**Types:** UrlLike, HexString

## Numbers

- `clamp(value, min, max)` — Clamp value to range
- `roundTo(value, decimals)` — Round to N decimal places
- `lerp(start, end, t)` — Linear interpolation
- `random(min, max)` — Random integer in range
- `formatNumber(input, options?)` — Locale-aware number formatting
- `toOrdinal(n)` — Convert to ordinal string (1st, 2nd, 3rd...)
- `toPercent(value, total, decimals?)` — Calculate percentage

Also: sum, avg, median, countLeadingZeros, toSubscriptDigits, parseExponential, BigIntMath

**Type guards:** isNumberString, isNumberish, isPercentage, isValidRange, isInRange

**Types:** NumberString, Numberish, Percentage

## Core

- `isNull(value)` / `isUndefined(value)` / `isNullish(value)` — Nullish checks
- `notNull(value)` / `notUndefined(value)` / `notNullish(value)` — Non-null type guards
- `isTrueLike(value, options?)` — Check truthy-like values (configurable true strings)

Also: isBoolean, isSymbol, isBigInt, isNumber, isString, isDate, isPrimitive, isJsonablePrimitive, isGenerator, toString, typeOf

**Types:** Primitive, Optional, Nullable, Nullish, Jsonable, JsonablePrimitive

## Common

- `isEmpty(value)` — Universal empty check (arrays, objects, collections, strings, maps, sets)
- `assert(condition, message?, ctor?)` — Assert condition or throw (default Error)
- `assertParam(condition, message?, ctor?)` — Assert parameter (default TypeError)

## Collections

- `LruMap<K, V>` — LRU eviction map with max size
- `LruSet<T>` — LRU eviction set with max size
- `FifoMap<K, V>` — FIFO eviction map with max size
- `FifoSet<T>` — FIFO eviction set with max size

**Type guards:** isIterable, isCollectionLike, isEmptyCollection, isSetLike, isMapLike

**Types:** CollectionLike, SetLike, MapLike

## Events

- `Emitter<TEventMap>` — Typed event emitter with on, once, off, emit, removeAllListeners, listeners, listenersCount, eventNames

**Types:** EventMap, EventNames, EventArgs, EventListener

## Buffers

- `bufferToString(buffer, encoding?)` — Convert buffer to string
- `toUint8Array(buffer)` — Normalize any buffer to Uint8Array
- `concatBuffers(buffers)` — Concatenate multiple buffers
- `bufferEquals(a, b)` — Deep buffer comparison

**Type guards:** isBuffer, isArrayBuffer, isSharedArrayBuffer, isArrayBufferView, isBufferLike

**Types:** BufferLike

## Times

- `formatDate(date, format)` — Format date with token patterns
- `humanizeMilliseconds(ms)` — Human-readable duration from ms
- `humanizeSeconds(s)` — Human-readable duration from seconds
- `humanizeNanoseconds(ns)` — Human-readable duration from ns
- `timestamp()` — Current Unix timestamp (seconds)
- `toUnixTimestamp(date)` — Date to Unix timestamp
- `fromUnixTimestamp(timestamp)` — Unix timestamp to Date
- `startOfHour(date)` — Start of hour (zero minutes/seconds/ms)
- `startOfDay(date)` — Start of day (midnight)
- `startOfWeek(date, options?)` — Start of week (default Monday)
- `startOfMonth(date)` — Start of month (1st at midnight)
- `startOfYear(date)` — Start of year (Jan 1st at midnight)
- `endOfHour(date)` — End of hour (59:59.999)
- `endOfDay(date)` — End of day (23:59:59.999)
- `endOfWeek(date, options?)` — End of week (default Sunday)
- `endOfMonth(date)` — End of month (last day 23:59:59.999)
- `endOfYear(date)` — End of year (Dec 31st 23:59:59.999)
- `resolveInterval(interval, type?, options?)` — Resolve interval string ('hourly'|'daily'|'weekly'|'monthly'|'yearly') to Date via startOf*/endOf*
- `addInterval(interval, amount, type?, options?)` — Add N intervals to now and snap to start/end
- `subtractInterval(interval, amount, type?, options?)` — Subtract N intervals from now and snap to start/end

Also: isValidDate

**Types:** DateLike, DayOfWeek (enum), WeekOptions, TimeInterval, ResolveIntervalOptions

**Constants:** MS_PER_SECOND, MS_PER_MINUTE, MS_PER_HOUR, MS_PER_DAY, MS_PER_MONTH, MS_PER_YEAR

## System

- `computeHash(data, algorithm, encoding?)` — Hash data with any algorithm, default hex encoding
- `getFileHash(path, algorithm, options?)` — Sync file hash (reads entire file into memory)
- `getLargeFileHash(path, algorithm, options?)` — Async file hash via stream (memory-efficient for large files)
- `hasAccess(path, mode?)` — Check if path is accessible with given mode
- `isReadable(path)` — Check if path is readable (works for both files and directories)
- `isWritable(path)` — Check if path is writable (works for both files and directories)
- `isFile(path)` — Check if path is a file
- `isDirectory(path)` — Check if path is a directory
- `isWritableDirectory(dirPath)` — Check if directory is writable (walks up to nearest existing ancestor)
- `ensureDirectory(path, options?)` — Create directory recursively if it does not exist
- `fetch(request, options?)` — Fetch with built-in retry support
- `pwd(importMeta, ...path)` — Resolve path relative to current module
- `pathToString(path)` — Convert PathLike to string
- `resolvePath(path)` — Resolve path to absolute, expands `~/` to home directory
- `gracefulExit(exitCode?, maxWaitTime?)` — Graceful shutdown with exit handlers
- `addExitHandler(handler, maxWaitTime?)` — Register exit handler

Also: isInDevelopment, isInProduction, isInStaging, isInMode, isInDev, isInProd, isInStage

**Types:** PathLike, FetchOptions

## Serializer

- `serialize(value, options?)` — Deep serialization of any value to JSON-safe format
- `createSerializer(options?)` — Create a reusable serializer function with pre-resolved config
- `createSerializerWithContext(ctx)` — Create a reusable serializer from an existing SharedSerializeContext
- `createSharedContext(options?)` — Create a shared readonly config (reusable across serialize calls)
- `createContext(options?)` — Create full serialization context (shared config + per-call state)
- `createSymbolKeySerializer()` — Serialize Symbol keys to strings

Handles: primitives, arrays, objects, errors, functions, binary data, blobs, collections, dates, regexps, URLs, circular references.

## JSON-RPC

- `createJsonRpcRequestMessage(id, method, params?)` — Create JSON-RPC 2.0 request
- `createJsonRpcNotifyMessage(method, params?)` — Create notification (no id)
- `createJsonRpcSuccessResponseMessage(id, result)` — Create success response
- `createJsonRpcErrorResponseMessage(id, error)` — Create error response
- `createJsonRpcErrorObject(code, message, data?)` — Create error object

**Type guards:** isJsonRpcMessage, isJsonRpcRequestMessage, isJsonRpcNotifyMessage, isJsonRpcResponseMessage, isJsonRpcSuccessResponseMessage, isJsonRpcErrorResponseMessage, isJsonRpcError, isJsonRpcBatchRequest, isJsonRpcBatchResponse, isValidJsonRpcId

**Constants:** JsonRpcErrorCode enum

**Types:** JsonRpcRequestMessage, JsonRpcNotifyMessage, JsonRpcResponseMessage, JsonRpcSuccessResponseMessage, JsonRpcErrorResponseMessage, JsonRpcMessage, JsonRpcBatchRequest, JsonRpcBatchResponse

## Zod

> Sub-path import: `import { url, hexString, ... } from '@kdtlabs/utils/zod'`
> Requires `zod@^4.0.0` as optional peer dependency.

**Schemas (refinements for `.pipe()`):**

- `url(...protocols: (Protocol | Protocol[])[])` — URL with protocol restriction (autocomplete: 'http', 'ws', 'file', 'ftp', 'ssh')
- `hexString(length?: number)` — Hex string with optional byte length
- `strictHexString(length?: number)` — Hex string requiring `0x` prefix
- `numberString()` — String parseable as number
- `validDate()` — Date that is not invalid (NaN time)
- `trueLike(options?: IsTrueLikeOptions)` — Transform unknown to boolean via truthy detection
- `filePath()` — Path points to existing file
- `directoryPath()` — Path points to existing directory
- `readable()` — Path is readable
- `writable()` — Path is writable
- `writableDirectory()` — Path is writable directory (walks ancestors)

**Constants:**

- `PROTOCOL_PATTERNS` — Record of protocol name to regex pattern

**Types:** Protocol
