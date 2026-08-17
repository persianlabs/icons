# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

**Persian Icons** (`@persianlabs/icons`) — a Turborepo monorepo publishing a single npm package of Iranian bank, payment gateway, and brand logos as React and Vue components, plus a Next.js docs/playground site.

- `packages/icons` — the publishable `@persianlabs/icons` package
- `apps/docs` — Next.js 16.3 documentation and icon playground (consumes `@persianlabs/icons` as a workspace dependency)
- `packages/ui` — shared shadcn/ui components used by `apps/docs`
- `packages/eslint-config`, `packages/typescript-config` — shared tooling configs

Package manager is **Bun** (`bun@1.3.12`, see `packageManager` in `package.json`); task orchestration is **Turborepo**.

## Commands

Run from the repo root unless noted:

```bash
bun install                # install all workspaces
bun run dev                 # turbo dev --filter=docs (Next.js docs app only)
bun run build                # turbo run build (all workspaces, respects dependsOn: ^build)
bun run lint                  # turbo run lint
bun run format                 # turbo run format
bun run typecheck                # turbo run typecheck
```

Scope a task to one workspace with Turbo's filter flag, e.g. `bunx turbo run build --filter=@persianlabs/icons`.

Inside `packages/icons` specifically:

```bash
bun run generate    # regenerate src/generated/** from assets/** (scripts/generate.mjs)
bun run build        # generate -> clean dist -> tsup
bun run dev            # tsup --watch
```

There is no test suite in this repo. The closest thing to correctness checks is `bun run typecheck`, `bun run lint`, and the validation `scripts/generate.mjs` performs while building (duplicate names, invalid logo-name format, empty SVG bodies).

Before considering any change to `packages/icons` or `apps/docs` done, run in order: `bun run format`, `bun run typecheck`, `bun run lint`, `bun run build`.

## Architecture: how an icon becomes a component

This is the part that spans multiple files and isn't obvious from any single one.

1. **Source of truth**: raw SVG artwork lives in `packages/icons/assets/<category-folder>/{color,mono}/<kebab-name>.svg`. This is what contributors and Claude edit by hand.
2. **`packages/icons/scripts/generate.mjs`** walks `assets/`, and for every SVG:
   - Maps the top-level folder name to a short prefix via the `CATEGORY_PREFIXES` object (e.g. `assets/banks` → `bank`, `assets/payment-gateways` → `gateway`). This mapping is the single source of truth for category prefixes.
   - Derives the logo name as `<prefix>-<kebab-cased-filename>` (e.g. `bank-melli`).
   - Optimizes the SVG with SVGO, extracts the `viewBox` and inner body.
   - For `mono` variants, rewrites every non-`none` `fill="..."` to `fill="currentColor"` so the component can be themed via CSS (`makeMono`).
   - Validates: logo name matches `^(?:<any known prefix>)-[a-z0-9]+(?:-[a-z0-9]+)*$`, no duplicate `variant:name` pairs, and the SVG body isn't empty.
3. It writes everything into `packages/icons/src/generated/` (**never hand-edit this directory** — it's regenerated on every build):
   - `data.ts` — `logoNames`, `colorLogos`, `monoLogos` (the full flat dataset)
   - `react-icons.tsx` / `vue-icons.ts` — one component per `variant:name` pair, named `<PascalName><Color|Mono>` (e.g. `BankMelliColor`, `BankMelliMono`), all thin wrappers around the shared `LogoIcon` primitive
   - `categories/<category-prefix>.ts` — per-category chunks of the same data, so consumers can dynamically import just one category's data instead of the whole dataset
   - `categories/index.ts` — `categoryLoaders`, a map of category key → dynamic `import()`, used by `src/lazy.ts` (`loadCategoryLogos`) for lazy-loading in UIs like the docs playground
4. `src/react.tsx` and `src/vue.ts` re-export the shared `LogoIcon` primitive plus everything from the generated icon files — these are the package's `./react` and `./vue` entry points.
5. `tsup` (`packages/icons/tsup.config.ts`) compiles `src/` to `dist/`, which is what actually ships (see `exports` map in `packages/icons/package.json`: `.`, `./react`, `./vue`, `./lazy`, `./meta`, `./logo-icon`).

**`packages/icons/package.json`'s `build` script runs `generate` first** (`bun run generate && bun run clean && tsup`), so a plain `bun run build` at the repo root always regenerates from `assets/` before compiling — you never need to run `generate` manually except to preview output without a full build.

### The other place category metadata must be kept in sync

`apps/docs/components/logo-playground-utils.ts` has its own `CATEGORY_LABELS` map (category prefix → human-readable display name, e.g. `gateway` → `"Payment Gateways"`) used purely for the docs UI. It is **not** read by `generate.mjs` and has no compile-time link to `CATEGORY_PREFIXES` — if you add a new category, update both maps or the docs site will fall back to a capitalized prefix instead of a proper label.

### One-off transforms live inline in generate.mjs

`generate.mjs` special-cases at least one source file with quirky upstream markup (search for `gateway-sep`) directly in the generation loop rather than via a config table. Follow that pattern (a narrow `if (name === "...")` block) only when SVGO/`makeMono` can't fix the artwork generically — prefer cleaning the source SVG itself first.

## Adding a new icon or category

See `.github/CONTRIBUTING.md` for the human-facing, step-by-step version of this. In short:

- **New icon in an existing category**: add matching `color/<name>.svg` and `mono/<name>.svg` files under the right `packages/icons/assets/<category>/` folder, then `bun run build`.
- **New category**: create the `assets/<new-folder>/{color,mono}/` folders, register the folder → prefix mapping in `CATEGORY_PREFIXES` in `packages/icons/scripts/generate.mjs`, register the prefix → label mapping in `CATEGORY_LABELS` in `apps/docs/components/logo-playground-utils.ts`, add the SVGs, then `bun run build`.

Constraints enforced or expected throughout the pipeline:
- Filenames must be kebab-case; they become part of the generated logo name and component name.
- Every logo needs both a `color` and a `mono` variant with the same filename.
- Monochrome source SVGs should use solid, non-`none` fills so `makeMono`'s `currentColor` rewrite actually takes effect.
- SVGs need a valid `viewBox` attribute — `parseSvg` throws without one.

## Attribution requirement

Whenever logo attribution is surfaced (README, docs site footer, etc.), credit [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks), whose SVG collection this package is built from.

## Next.js note

`apps/docs` runs Next.js 16.3, which has diverged from older Next.js conventions. If you're touching routing, config, or build behavior in `apps/docs` and something doesn't match your training data, check `node_modules/next/dist/docs/` before assuming the old behavior still applies.
