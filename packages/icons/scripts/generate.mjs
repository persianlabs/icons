import { readdir, readFile, writeFile, mkdir } from "node:fs/promises"
import { basename, dirname, join, relative } from "node:path"
import { fileURLToPath } from "node:url"
import { validateIconSet } from "@iconify/utils"
import { optimize } from "svgo"

const packageRoot = join(dirname(fileURLToPath(import.meta.url)), "..")
const sourceRoot = join(packageRoot, "..", "..", "_svg_assets")
const generatedRoot = join(packageRoot, "src", "generated")

const kebab = (value) =>
  value
    .replace(/\.svg$/i, "")
    .replace(/([a-z0-9])([A-Z])/g, "$1-$2")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase()

const pascal = (value) =>
  value
    .split("-")
    .map((part) => part[0].toUpperCase() + part.slice(1))
    .join("")

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true })
  const files = await Promise.all(
    entries.map((entry) => {
      const path = join(directory, entry.name)
      return entry.isDirectory() ? walk(path) : path
    })
  )
  return files.flat().filter((path) => path.endsWith(".svg"))
}

function parseSvg(svg) {
  const viewBox = svg
    .match(/viewBox=["']([^"']+)["']/i)?.[1]
    ?.trim()
    .split(/[ ,]+/)
    .map(Number)
  if (!viewBox || viewBox.length !== 4 || viewBox.some(Number.isNaN))
    throw new Error("SVG is missing a valid viewBox")
  const body = svg
    .replace(/^[\s\S]*?<svg[^>]*>/i, "")
    .replace(/<\/svg>[\s\S]*$/i, "")
    .replace(/<!--([\s\S]*?)-->/g, "")
    .replace(/<(title|desc)>[\s\S]*?<\/\1>/gi, "")
    .replace(/\sdata-name=("[^"]*"|'[^']*')/gi, "")
    .replace(/\s+/g, " ")
    .replace(/> </g, "><")
    .trim()
  return {
    left: viewBox[0],
    top: viewBox[1],
    width: viewBox[2],
    height: viewBox[3],
    body,
  }
}

function optimizeSvg(svg) {
  return optimize(svg, {
    multipass: true,
    plugins: ["preset-default", "removeDimensions"],
  }).data
}

function makeMono(svg) {
  // currentColor lets consumers theme one monochrome source with CSS.
  return svg.replace(/fill=("|')(?!none\1)[^"']+\1/gi, 'fill="currentColor"')
}

const newAssets = [
  {
    name: "bank-bankino",
    title: "Bankino",
    category: "bank",
    color: "bankino.svg",
    mono: "bankinono.svg",
  },
  {
    name: "bank-blubank",
    title: "BluBank",
    category: "bank",
    color: "bluyes.svg",
    mono: "bluno.svg",
  },
  {
    name: "gateway-nextpay",
    title: "NextPay",
    category: "gateway",
    color: "nextpay.svg",
    mono: "nextpayno.svg",
  },
  {
    name: "gateway-pasargad-pep",
    title: "Pasargad PEP",
    category: "gateway",
    color: "pasargadpepcoloryes.svg",
    mono: "pasargadpepcolorno.svg",
  },
  {
    name: "gateway-saman-kish",
    title: "Saman Kish",
    category: "gateway",
    color: "samankishyes.svg",
    mono: "samankishno.svg",
  },
  {
    name: "gateway-zibal",
    title: "Zibal",
    category: "gateway",
    color: "zibalyes.svg",
    mono: "zibalno.svg",
  },
]

const files = (await walk(sourceRoot))
  .filter((file) => !relative(sourceRoot, file).startsWith("new"))
  .sort()
const collections = {
  color: {
    prefix: "persian-logos",
    icons: {},
    info: {
      name: "Persian Logos",
      author: {
        name: "zegond and contributors",
        url: "https://github.com/zegond/logos-per-banks",
      },
      license: { title: "MIT", spdx: "MIT" },
      palette: true,
      height: 48,
    },
    categories: {},
  },
  mono: {
    prefix: "persian-logos-mono",
    icons: {},
    info: {
      name: "Persian Logos Mono",
      author: {
        name: "zegond and contributors",
        url: "https://github.com/zegond/logos-per-banks",
      },
      license: { title: "MIT", spdx: "MIT" },
      palette: false,
      height: 48,
    },
    categories: {},
  },
}
const records = []

for (const file of files) {
  const parts = relative(sourceRoot, file).split(/[\\/]/)
  const category = kebab(parts[0])
  const variant = parts[1].toLowerCase()
  const name = `${category}-${kebab(basename(file))}`
  const source = await readFile(file, "utf8")
  const icon = parseSvg(variant === "mono" ? makeMono(source) : source)
  collections[variant].icons[name] = icon
  const label = parts[0] === "Bank" ? "Banks" : "Payment gateways"
  collections[variant].categories[label] ??= []
  collections[variant].categories[label].push(name)
  records.push({
    name,
    title: basename(file, ".svg").replaceAll("_", " "),
    category,
    variant,
    icon,
  })
}

const newRoot = join(sourceRoot, "new")
for (const asset of newAssets) {
  for (const variant of ["color", "mono"]) {
    const filename = asset[variant]
    const source = await readFile(join(newRoot, filename), "utf8")
    const svg = optimizeSvg(variant === "mono" ? makeMono(source) : source)
    const icon = parseSvg(svg)
    collections[variant].icons[asset.name] = icon
    const label = asset.category === "bank" ? "Banks" : "Payment gateways"
    collections[variant].categories[label].push(asset.name)
    records.push({
      name: asset.name,
      title: asset.title,
      category: asset.category,
      variant,
      icon,
    })
  }
}

const sepSource = await readFile(join(newRoot, "sep.svg"), "utf8")
// The supplied SEP artwork starts with a full-canvas white path, not logo artwork.
// Crop its original presentation canvas as well, otherwise the mark renders undersized.
const sepWithoutBackground = sepSource
  .replace(/<path\b[\s\S]*?\/>/i, "")
  .replace(/viewBox=("|')0 0 710 356\1/i, 'viewBox="60 60 591 239"')
for (const variant of ["color", "mono"]) {
  const svg = optimizeSvg(
    variant === "mono" ? makeMono(sepWithoutBackground) : sepWithoutBackground
  )
  const icon = parseSvg(svg)
  collections[variant].icons["gateway-sep"] = icon
  collections[variant].categories["Payment gateways"].push("gateway-sep")
  records.push({
    name: "gateway-sep",
    title: "SEP",
    category: "gateway",
    variant,
    icon,
  })
}

for (const collection of Object.values(collections))
  validateIconSet(collection, { fix: true })

await mkdir(generatedRoot, { recursive: true })
await writeFile(
  join(packageRoot, "icons.json"),
  `${JSON.stringify(collections.color, null, 2)}\n`
)
await writeFile(
  join(packageRoot, "icons-mono.json"),
  `${JSON.stringify(collections.mono, null, 2)}\n`
)

const names = [...new Set(records.map(({ name }) => name))].sort()
const dataSource = `// Generated by scripts/generate.mjs. Do not edit.\nimport type { IconifyIcon } from "@iconify/types"\n\nexport const colorIcons = ${JSON.stringify(collections.color.icons, null, 2)} as const satisfies Record<string, IconifyIcon>\nexport const monoIcons = ${JSON.stringify(collections.mono.icons, null, 2)} as const satisfies Record<string, IconifyIcon>\nexport const iconNames = ${JSON.stringify(names)} as const\nexport type IconName = (typeof iconNames)[number]\nexport type LogoVariant = "color" | "mono"\n`
await writeFile(join(generatedRoot, "data.ts"), dataSource)

const reactSource = `// Generated by scripts/generate.mjs. Do not edit.\nimport { Icon } from "@iconify/react"\nimport type { LogoProps } from "../react.js"\n\n${records
  .map(({ name, variant, icon }) => {
    const component = `${pascal(name)}${variant === "color" ? "Color" : "Mono"}`
    return `export function ${component}(props: LogoProps) { return <Icon icon={${JSON.stringify(icon)}} {...props} /> }`
  })
  .join("\n")}\n`
await writeFile(join(generatedRoot, "react-icons.tsx"), reactSource)

const vueSource = `// Generated by scripts/generate.mjs. Do not edit.\nimport { Icon } from "@iconify/vue"\nimport { defineComponent, h } from "vue"\n\n${records
  .map(({ name, variant, icon }) => {
    const component = `${pascal(name)}${variant === "color" ? "Color" : "Mono"}`
    return `export const ${component} = defineComponent({ name: "${component}", inheritAttrs: false, setup(_, { attrs }) { return () => h(Icon, { ...attrs, icon: ${JSON.stringify(icon)} }) } })`
  })
  .join("\n")}\n`
await writeFile(join(generatedRoot, "vue-icons.ts"), vueSource)
