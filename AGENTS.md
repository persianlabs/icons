<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Persian Logos repository guide

- Use Bun for dependency management and Turbo for workspace tasks.
- `packages/icons` is the publishable `@persian-labs/icons` package. Its generated files must come from `scripts/generate.mjs`; do not hand-edit `src/generated`. Production builds regenerate these files before compiling.
- Original artwork lives in `packages/icons/assets`, organized by brand category and then `color` or `mono`. Every brand must have both variants, use kebab-case filenames, and monochrome paths must generate with `currentColor` so they render black in light mode and white in dark mode.
- Generated logo data must preserve the paired color and monochrome mappings and their stable kebab-case logo names.
- `apps/docs` is the Next.js 16.3 documentation playground. Use shared shadcn components from `packages/ui` and preserve English, LTR layout and Geist typography.
- Credit [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) whenever attribution is presented; its author designed the original SVG collection.
- Before handing off changes, run `bun run format`, `bun run typecheck`, `bun run lint`, and `bun run build`.
