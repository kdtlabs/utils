# Agent Rules — @kdtlabs/utils

## STOP — Mandatory First Read

- Do not analyze project code, edit files, implement changes, or run project commands until this file has been read.
- If the task touches code, read the routed rule files below before continuing.
- `AGENTS.md` is the canonical project rule file. `CLAUDE.md` only points here.

## Task Routing

- Write or modify code → read `docs/rules/CODE_QUALITY.md` and `docs/rules/CODE_STYLE.md`
- Add a new util/helper → also read `docs/rules/BENCHMARK_WORKFLOW.md`
- Add a new util/helper → also update `SKILL.md` to include the new function
- Extract reusable logic into a new util → also read `docs/rules/BENCHMARK_WORKFLOW.md`
- Review, plan, or edit docs only → read this file only unless the task also changes code or rule content
- Edit the rule system itself → read this file and only the affected rule files
- Mixed tasks → read every relevant rule file before continuing

## Critical Rules Summary

- Do not write duplicate logic.
- Do not duplicate declarations unless keeping them local is clearly simpler.
- If reusable multi-use logic should become a util, extract it and follow the benchmark workflow.
- Do not put too much code or logic in one file.
- Do not put too much logic in one function.
- All control-flow statements use full multi-line brace blocks.
- Do not modify tests to hide broken implementation.
- Run `lint:fix` only for files changed by the current task, then run the repo typecheck command.
- Do not add a util without the benchmark workflow.

## Rule Maintenance

- Keep `AGENTS.md` as the router and short-summary file.
- Put full rule wording in the most specific rule file.
- If a rule change affects routing, critical summaries, or rule-file descriptions, update `AGENTS.md` too.
- For child-owned rules, keep only a one-line summary in `AGENTS.md`.
- Preserve the task-based modular layout so agents read only relevant rule files.
- Prefer rewriting, reordering, and compressing wording over expanding the rule surface.

## Directory Layout

```text
├── src/                  ← source code, organized by domain
│   ├── index.ts          ← root barrel: re-exports every domain
│   └── <domain>/         ← one folder per domain (kebab-case)
│       ├── index.ts      ← domain barrel: re-exports domain modules
│       ├── types.ts      ← shared types for the domain
│       ├── constants.ts  ← domain constants
│       ├── guards.ts     ← type guards (isX, notX)
│       ├── factories.ts  ← constructor/builder functions
│       ├── conversions.ts← type conversion functions
│       ├── operations.ts ← transformation/mutation functions
│       └── <name>.ts     ← dedicated file for complex/long logic
├── test/                 ← mirrors src/ structure, one function per file
│   └── <domain>/
│       ├── <file>.test.ts          ← test for a dedicated source file
│       └── <grouped-file>/         ← subfolder when source groups many fns
│           └── <fn-name>.test.ts
├── bench/                ← mirrors src/ structure, one function per file
│   └── <domain>/
│       ├── <file>.bench.ts
│       └── <grouped-file>/
│           └── <fn-name>.bench.ts
├── docs/rules/           ← agent rule files (SCREAMING_SNAKE_CASE.md)
├── scripts/              ← build and release scripts
│   ├── build.ts
│   └── release.ts
├── dist/                 ← build output (gitignored)
├── AGENTS.md             ← canonical project rules (this file)
└── CLAUDE.md             ← points to AGENTS.md only
```

### Current domains under `src/`

`arrays` · `buffers` · `collections` · `common` · `core` · `errors` · `events` · `functions` · `json-rpc` · `numbers` · `objects` · `promises` · `serializer` · `strings` · `system` · `times` · `zod` (sub-path export: `@kdtlabs/utils/zod`)

### Where to place new files

- **New util in an existing domain** → add a source file (or add to an existing grouped file) under the matching `src/<domain>/`, export it from the domain `index.ts`, and add test + bench files in the mirrored paths.
- **New domain** → create `src/<domain>/index.ts` (barrel only), add the domain to `src/index.ts`, create matching `test/<domain>/` and `bench/<domain>/` folders.
- **Complex/long function** → dedicated file `src/<domain>/<name>.ts`.
- **Short/simple functions of the same sub-category** → may share one file (e.g. `guards.ts`, `factories.ts`).
- **Sub-module with internal structure** → allowed one level of nesting (e.g. `src/serializer/serializers/`). Keep the sub-folder barrel `index.ts` the same as domain barrels.

### Role-based file names inside a domain

Not every domain needs all of these. Only create the files that apply.

| File               | Purpose                                                             |
| ------------------ | ------------------------------------------------------------------- |
| `types.ts`         | Types shared across multiple files in the domain                    |
| `constants.ts`     | Domain-scoped constants                                             |
| `guards.ts`        | Type guard functions (`isX`, `notX`)                                |
| `factories.ts`     | Constructor / builder functions                                     |
| `conversions.ts`   | Type conversion functions                                           |
| `operations.ts`    | Transformation / mutation functions                                 |
| `manipulations.ts` | String/data manipulation functions (alternative to `operations.ts`) |
| `<name>.ts`        | Dedicated file for complex or long logic                            |

### Test and bench mirroring rules

- Dedicated source file → test/bench file at the same relative path: `src/objects/deep-merge.ts` → `test/objects/deep-merge.test.ts` and `bench/objects/deep-merge.bench.ts`.
- Grouped source file → subfolder per function: `src/core/guards.ts` → `test/core/guards/is-primitive.test.ts` and `bench/core/guards/is-primitive.bench.ts`.
- Each test/bench file covers exactly one function or class.
- Helper files shared across tests in a domain go directly in the domain test folder (e.g. `test/serializer/helpers.ts`).

## Project-Wide Rules

### Naming

- All `.ts` files use `kebab-case`.
- Bench files use `<name>.bench.ts`, test files use `<name>.test.ts`.
- All `.md` files use `SCREAMING_SNAKE_CASE`.
- Variables, functions, methods, and properties use `camelCase`.
- Classes, interfaces, and types use `PascalCase`.
- Constants use `SCREAMING_SNAKE_CASE`.
- Shared names must be unique within their scope. Avoid generic names like `Options`, `Result`, or `Config`.

### Exports

- Export everything that can be exported.
- Prefer explicit exports over keeping things private by default.

### File Structure

- Function-specific options or class-specific config types stay in the same file as the function/class that uses them.
- `index.ts` files are barrel files only. No logic.

### Git

- Do not perform git operations unless the user explicitly requests them.

### Do Not

- Do not turn `CLAUDE.md` into a second detailed rule file.
- Do not dump workflow-specific detail into `AGENTS.md`.

## Rule Files

- `docs/rules/BENCHMARK_WORKFLOW.md` — benchmark-first workflow for new utils/helpers and extracted reusable utils
- `docs/rules/CODE_QUALITY.md` — implementation quality, reuse, file/function size, tests, scoped verification
- `docs/rules/CODE_STYLE.md` — layout, formatting, declaration grouping, control-flow style, class structure
