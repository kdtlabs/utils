# Benchmark Workflow

## When to Read

- Before adding any new util/helper
- Before extracting reusable logic into a new util

## Required For

- Any new util/helper added under `src/`
- Any reusable feature logic promoted into a shared util

## Critical Rules

- Every new util/helper goes through this benchmark-first workflow.
- Benchmark at least 2-3 candidate approaches.
- Choose from data, not preference.
- Keep bench files in git as decision records.
- Bench and test paths must match the current project layout.

## Hard Gate

- Do not add a new util/helper to `src/` until this workflow has been read and completed.

## Workflow Summary

1. Brainstorm candidate solutions.
2. Write a bench file with representative data.
3. Run the benchmark.
4. Pick the winner from data.
5. Implement the winner in `src/`.
6. Add or update matching tests.

## Workflow Steps

1. **Brainstorm solutions** — come up with at least 2-3 fundamentally different approaches.
2. **Create bench file** — write a bench file with all candidate solutions using [mitata](https://github.com/evanwashere/mitata). Each file is self-contained and calls `await run()` at the end.
3. **Run benchmark** — execute `bun run ./bench/<path>.bench.ts` and analyze results.
4. **Pick the winner from data** — choose based on speed, memory, and reliability, not gut feeling.
5. **Implement in `src/`** — move the chosen solution into the appropriate source location.
6. **Keep the bench file** — it stays in git as the decision record.
7. **Add or update tests** — cover the shipped util with the matching test file.

## File Conventions

- Bench files use `<name>.bench.ts`.
- Test files use `<name>.test.ts`.
- Each bench/test file covers exactly one function or class.
- Bench and test paths mirror the source category and source-file path.
  - Dedicated source file example: `src/objects/deep-merge.ts` → `bench/objects/deep-merge.bench.ts` and `test/objects/deep-merge.test.ts`
  - Grouped source file example: `src/core/guards.ts` → `bench/core/guards/is-primitive.bench.ts` and `test/core/guards/is-primitive.test.ts`
- Run a specific bench file: `bun run ./bench/<path>.bench.ts`
- Bench functions should use descriptive names that identify the approach.

## Approach Diversity

- Each approach must represent a fundamentally different algorithm or strategy, not just syntactic variation.
- Valid examples: loop vs regex vs recursion, Set-based vs Map-based vs Array-based, iterative vs divide-and-conquer.
- Invalid examples: `for` vs `for...of` on the same logic, `slice` vs `substring` with the same strategy, renaming variables and calling it a new approach.
- If fewer than 2-3 genuinely different approaches exist, state why rather than fabricating similar approaches to meet a quota.

## Dataset Rigor

- Each bench file must cover: normal cases, edge cases (empty input, single element, unicode, special characters, boundary values), and stress cases (large input, deep nesting, worst-case scenarios).
- Dataset must be diverse enough to expose performance cliffs — do not only bench the happy path.
- Treat bench files like strict test files: if an approach wins on normal cases but degrades significantly on edge cases, it must not be chosen.

## Mitata Best Practices

- Use `do_not_optimize()` for any benchmark where the return value might be discarded by DCE.
- Use `.gc('inner')` for allocation-heavy benchmarks.
- Use computed parameters (generator + yield object with numeric keys) when inputs could be hoisted out of measurement loops by LICM.
- Watch for the `!` warning in output — it indicates the benchmark was likely optimized out.
- Mitata propagates errors; if an approach may throw on certain inputs, wrap it in try-catch within the benchmark or handle it explicitly.

## Bench File Template

```ts
import { bench, do_not_optimize, run, summary } from 'mitata'

function approachA(input: string) { /* ... */ }
function approachB(input: string) { /* ... */ }
function approachC(input: string) { /* ... */ }

summary(() => {
  bench('approachA', () => do_not_optimize(approachA('hello world')))
  bench('approachB', () => do_not_optimize(approachB('hello world')))
  bench('approachC', () => do_not_optimize(approachC('hello world')))
})

await run()
```

### With parameter ranges

```ts
import { bench, do_not_optimize, run, summary } from 'mitata'

summary(() => {
  bench('approachA($len)', function* (state) {
    const len = state.get('len')
    const input = 'x'.repeat(len)
    yield () => do_not_optimize(approachA(input))
  }).range('len', 1, 1024)

  bench('approachB($len)', function* (state) {
    const len = state.get('len')
    const input = 'x'.repeat(len)
    yield () => do_not_optimize(approachB(input))
  }).range('len', 1, 1024)
})

await run()
```

### With computed parameters (LICM protection)

Use when inputs are pure/constant and JIT might hoist computations out of the measurement loop.

```ts
import { bench, run, summary } from 'mitata'

summary(() => {
  bench('approachA($size)', function* (state) {
    const size = state.get('size')
    const template = buildInput(size)

    yield {
      [0]() { return structuredClone(template) },
      bench(input) { approachA(input) },
    }
  }).args('size', [1, 10, 100])
})

await run()
```
