# Contributing to Persian Icons

Thanks for helping grow the collection! This guide walks through adding a new logo or a whole new category by hand, step by step, plus the checks to run before opening a pull request.

## 1. Set up the repo

```bash
git clone https://github.com/persianlabs/icons.git
cd icons
bun install
```

Requires [Bun](https://bun.sh) and Node.js 20+.

```bash
bun run dev   # starts the docs/playground app at apps/docs so you can preview icons locally
```

## 2. Adding a new logo to an existing category

Say you want to add the logo for a bank called "Example Bank".

1. **Find the existing category folder.** Categories live under `packages/icons/assets/`. For a bank, that's `packages/icons/assets/banks/`.
2. **Prepare two SVG files** — a full-color version and a monochrome version — both with the same kebab-case filename, e.g. `example-bank.svg`:
   - `packages/icons/assets/banks/color/example-bank.svg`
   - `packages/icons/assets/banks/mono/example-bank.svg`
3. **Rules for the SVG files:**
   - The filename must be kebab-case (lowercase, words separated by hyphens) — it becomes part of the generated component name.
   - The root `<svg>` element must have a valid `viewBox` attribute.
   - The mono variant should use solid, non-`none` fills (e.g. black shapes). The build automatically rewrites those fills to `currentColor` so the icon follows the user's text color in light/dark mode — you don't need to do this by hand, and hardcoding `currentColor` yourself will be overwritten anyway.
   - Don't worry about optimizing the SVG (removing comments, minifying, etc.) — the build runs SVGO for you.
4. **Regenerate and build the package:**
   ```bash
   bun run build
   ```
   This regenerates the typed React/Vue components from your new SVGs. The new components will be named after the category prefix and your filename — for `banks/color/example-bank.svg` that's `ExampleBankColor`, and `banks/mono/example-bank.svg` becomes `ExampleBankMono`.
5. **Preview it.** Run `bun run dev` and find your logo in the docs playground — it appears automatically, no extra wiring needed for a new icon in an existing category.
6. **Run the checks** (see [Before opening a pull request](#before-opening-a-pull-request) below).

## 3. Adding a brand-new category

Use this when the brand doesn't fit any existing category folder (see `packages/icons/assets/` for the current list: banks, payment gateways, automobiles, tech companies, and more).

1. **Create the folders:**
   ```
   packages/icons/assets/<new-category>/color/
   packages/icons/assets/<new-category>/mono/
   ```
   Use a kebab-case, plural folder name consistent with the existing ones (e.g. `insurance`, `tech-companies`).
2. **Register a short prefix for the category.** Open `packages/icons/scripts/generate.mjs` and add an entry to the `CATEGORY_PREFIXES` object near the top of the file, mapping your folder name to a short prefix used in generated logo/component names:
   ```js
   const CATEGORY_PREFIXES = {
     // ...existing entries...
     "<new-category>": "<short-prefix>",
   }
   ```
3. **Register a display label for the docs site.** Open `apps/docs/components/logo-playground-utils.ts` and add the same prefix to the `CATEGORY_LABELS` object with a human-readable name:
   ```ts
   const CATEGORY_LABELS: Record<string, string> = {
     // ...existing entries...
     "<short-prefix>": "<Human Readable Label>",
   }
   ```
   This step is easy to miss — skipping it doesn't break the build, but the docs site will show an auto-capitalized prefix instead of a proper category name.
4. **Add your first logo(s)** following the steps in [section 2](#2-adding-a-new-logo-to-an-existing-category).
5. **Build and preview:**
   ```bash
   bun run build
   bun run dev
   ```

## 4. Do not hand-edit generated files

Everything under `packages/icons/src/generated/` is produced by `scripts/generate.mjs` and overwritten on every build. Never edit those files directly — change the source SVGs in `packages/icons/assets/` (or the config maps described above) instead, then rebuild.

## Before opening a pull request

Run all of the following from the repo root and make sure they pass:

```bash
bun run format
bun run typecheck
bun run lint
bun run build
```

## Commit messages

This repo follows [Conventional Commits](https://www.conventionalcommits.org/): `type(scope): summary`, for example:

- `feat(icons): add example bank logo`
- `fix(docs): correct category label for insurance`

Common types: `feat`, `fix`, `chore`, `ci`, `perf`. Common scopes: `icons`, `docs`, `ui`, `ci`.

## Attribution

The original SVG artwork this collection is built from comes from [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks). If your change touches attribution text (README, docs footer, etc.), keep that credit intact.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](../LICENSE).
