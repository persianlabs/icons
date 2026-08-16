type PackageManager = "npm" | "pnpm" | "bun"

const packageCommands: Record<PackageManager, string> = {
  pnpm: "pnpm add @persianlabs/icons",
  npm: "npm install @persianlabs/icons",
  bun: "bun add @persianlabs/icons",
}

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

const toTitle = (name: string) =>
  name === "gateway-sep"
    ? "SEP"
    : name.split("-").slice(1).map(capitalize).join(" ")

const toPascal = (value: string) => value.split("-").map(capitalize).join("")

const CATEGORY_LABELS: Record<string, string> = {
  bank: "Banks",
  gateway: "Payment Gateways",
  app: "App Stores",
  automobile: "Automobiles",
  store: "Chain Stores",
  detergent: "Detergent & Hygiene",
  fashion: "Fashion & Clothing",
  food: "Food & Drink",
  football: "Football Clubs",
  appliance: "Household Appliances",
  insurance: "Insurance",
  isp: "ISPs",
  media: "Media & News",
  organization: "Organizations",
  social: "Social Media",
  transportation: "Transportation",
  tv: "TV Channels",
  university: "Universities",
  vod: "VOD",
  website: "Apps & Websites",
}

const getCategory = (name: string) => name.split("-")[0] ?? name

const getCategoryLabel = (category: string) =>
  CATEGORY_LABELS[category] ?? capitalize(category)

const JSX_ATTR_MAP: Record<string, string> = {
  "fill-rule": "fillRule",
  "clip-rule": "clipRule",
  "clip-path": "clipPath",
  "stroke-width": "strokeWidth",
  "stroke-linecap": "strokeLinecap",
  "stroke-linejoin": "strokeLinejoin",
  "stroke-dasharray": "strokeDasharray",
  "stroke-dashoffset": "strokeDashoffset",
  "stroke-miterlimit": "strokeMiterlimit",
  "stroke-opacity": "strokeOpacity",
  "fill-opacity": "fillOpacity",
  "stop-color": "stopColor",
  "stop-opacity": "stopOpacity",
  "font-family": "fontFamily",
  "font-size": "fontSize",
  "font-weight": "fontWeight",
  "text-anchor": "textAnchor",
  "xlink:href": "xlinkHref",
}

const toJsxSvgBody = (body: string) =>
  Object.entries(JSX_ATTR_MAP).reduce(
    (svg, [attr, jsxAttr]) => svg.replaceAll(`${attr}=`, `${jsxAttr}=`),
    body
  )

const formatCount = (value: number) => {
  if (value < 1000) return String(value)
  if (value < 1_000_000)
    return `${(value / 1000).toFixed(value < 10_000 ? 1 : 0).replace(/\.0$/, "")}k`
  return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, "")}m`
}

const downloadFile = (filename: string, contents: BlobPart, type: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export type { PackageManager }
export {
  capitalize,
  downloadFile,
  formatCount,
  getCategory,
  getCategoryLabel,
  packageCommands,
  toJsxSvgBody,
  toPascal,
  toTitle,
}
