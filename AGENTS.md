<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Persian Icons repository guide

- Use Bun for dependency management and Turbo for workspace tasks.
- `packages/icons` is the publishable `@persianlabs/icons` package. Its generated files must come from `scripts/generate.mjs`; do not hand-edit `src/generated`. Production builds regenerate these files before compiling.
- Original artwork lives in `packages/icons/assets`, organized by brand category and then `color` or `mono`. Every brand must have both variants, use kebab-case filenames, and monochrome paths must generate with `currentColor` so they render black in light mode and white in dark mode.
- Generated logo data must preserve the paired color and monochrome mappings and their stable kebab-case logo names.
- `apps/docs` is the Next.js 16.3 documentation playground. Use shared shadcn components from `packages/ui` and preserve English, LTR layout and Geist typography.
- Credit [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) whenever attribution is presented; its author designed the original SVG collection.
- Before handing off changes, run `bun run format`, `bun run typecheck`, `bun run lint`, and `bun run build`.

## Adding a new icon

1. Prepare the SVG with a valid `viewBox` and solid (non-`none`) fills.
2. Save the color variant to `packages/icons/assets/<category-folder>/color/<kebab-name>.svg`.
3. Save the mono variant with the *same filename* to `packages/icons/assets/<category-folder>/mono/<kebab-name>.svg`. `scripts/generate.mjs` rewrites its fills to `currentColor` automatically — don't hardcode `currentColor` yourself in the source.
4. Run `bun run build` (or `cd packages/icons && bun run generate` to only regenerate without compiling). This produces `<prefix>-<kebab-name>` as the logo name and `<PascalName>Color` / `<PascalName>Mono` as the generated component names, and the icon shows up automatically in the docs playground — no docs code changes needed for an icon added to an existing category.
5. Verify with `bun run typecheck`, `bun run lint`, `bun run build`.

## Adding a new category

1. Create `packages/icons/assets/<new-category-folder>/color/` and `.../mono/`.
2. Register the folder → prefix mapping in `CATEGORY_PREFIXES` in `packages/icons/scripts/generate.mjs` (this prefix becomes part of every logo name and the generated per-category chunk filename).
3. Register the same prefix → human-readable label in `CATEGORY_LABELS` in `apps/docs/components/logo-playground-utils.ts`. These two maps are not linked at compile time; skipping this step leaves the docs site showing a capitalized-prefix fallback instead of a proper label.
4. Add the SVGs following the same-filename, both-variants rule above.
5. Run `bun run build` and verify as above.
