# Persian Logos

A growing, typed, open-source collection of Iranian bank, payment gateway, and brand logos for React and Vue.

[Website](https://persianlabs-icons.vercel.app) · [GitHub](https://github.com/persian-labs/icons) · [npm](https://www.npmjs.com/package/@persian-labs/icons)

## Install

```bash
npm install @persian-labs/icons
```

Or use `pnpm add @persian-labs/icons` or `bun add @persian-labs/icons`.

## React

```tsx
import { BankMelliColor, BankMelliMono } from "@persian-labs/icons/react"

export function Example() {
  return (
    <>
      <BankMelliColor width={48} title="Bank Melli" />
      <BankMelliMono className="text-black dark:text-white" width={48} title="Bank Melli" />
    </>
  )
}
```

## Vue

```vue
<script setup lang="ts">
import { BankMelliColor, BankMelliMono } from "@persian-labs/icons/vue"
</script>

<template>
  <BankMelliColor width="48" aria-label="Bank Melli" />
  <BankMelliMono class="mono-logo" width="48" aria-label="Bank Melli" />
</template>

<style>
.mono-logo {
  color: currentColor;
}
</style>
```

## Monochrome logos

Monochrome components use `currentColor`, so they naturally follow the surrounding text color—black in a light theme and white in a dark theme when those are your foreground colors.

## Repository

- `packages/icons` — npm package with generated React and Vue components
- `apps/docs` — Next.js 16.3 documentation and icon playground
- `packages/ui` — shared shadcn/ui components and styles
- `packages/icons/assets` — versioned source SVG artwork, organized by category and variant

```bash
bun install
bun run dev
```

Before opening a pull request:

```bash
bun run format
bun run typecheck
bun run lint
bun run build
```

## License and credit

Released under the MIT License.

Huge credit to [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) for designing the original SVGs that made this collection possible.
