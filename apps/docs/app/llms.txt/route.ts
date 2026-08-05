import { logoNames } from "@persian-labs/icons"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://icons.persian-labs.ir"

export function GET() {
  const brandCount = logoNames.length
  const markCount = brandCount * 2
  const body = `# Persian Icons

> A growing, typed, open-source collection of Iranian brand logos as native React and Vue components.

Persian Icons (\`@persian-labs/icons\`) ships ${brandCount} brands (${markCount} SVG marks: color + monochrome) spanning banks, payment gateways, automobiles, apps, food & drink, insurance, universities, and more. Every logo is a typed React and Vue component generated from optimized SVG source; monochrome variants use \`currentColor\` so they follow the surrounding text color.

## Docs

- [Icon playground](${siteUrl}): browse, search by category, and copy every logo as JSX, Vue, or raw SVG
- [GitHub repository](https://github.com/persianlabs/icons): source, issues, and contribution guide
- [npm package](https://www.npmjs.com/package/@persian-labs/icons): install instructions and version history

## Install

\`\`\`
pnpm add @persian-labs/icons
\`\`\`

## Usage

\`\`\`tsx
import { BankMelliColor, BankMelliMono } from "@persian-labs/icons/react"
\`\`\`

\`\`\`vue
<script setup lang="ts">
import { BankMelliColor, BankMelliMono } from "@persian-labs/icons/vue"
</script>
\`\`\`

## License

MIT. Source artwork credited to [zegond/logos-per-banks](https://github.com/zegond/logos-per-banks) and the "400 Persian Brands" Figma community file contributors.
`
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  })
}
