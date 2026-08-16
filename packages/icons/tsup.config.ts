import { defineConfig } from "tsup"

export default defineConfig([
  {
    // These entries are bundled independently (no shared chunks) so each
    // stays as small as what it actually imports. Sharing a build with
    // `lazy.ts` would force its per-category dynamic-import chunks to merge
    // with these, dragging the full dataset back into every entry.
    entry: {
      index: "src/index.ts",
      react: "src/react.tsx",
      vue: "src/vue.ts",
      meta: "src/meta.ts",
      "logo-icon": "src/logo-icon.tsx",
    },
    format: ["esm"],
    dts: true,
    clean: false,
    splitting: false,
    sourcemap: true,
    external: ["react", "vue"],
  },
  {
    // `lazy.ts` dynamically imports one chunk per icon category; splitting
    // must stay on here so each category ships as its own file.
    entry: { lazy: "src/lazy.ts" },
    format: ["esm"],
    dts: true,
    clean: false,
    splitting: true,
    sourcemap: true,
    external: ["react", "vue"],
  },
])
