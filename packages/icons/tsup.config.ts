import { defineConfig } from "tsup"

export default defineConfig({
  entry: ["src/index.ts", "src/react.tsx", "src/vue.ts"],
  format: ["esm"],
  dts: true,
  clean: true,
  splitting: true,
  sourcemap: true,
  external: ["react", "vue", "@iconify/react", "@iconify/vue"],
})
