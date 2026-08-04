type PackageManager = "npm" | "pnpm" | "bun"
type SnippetKind = "react" | "vue"

const packageCommands: Record<PackageManager, string> = {
  npm: "npm install @persian-labs/icons",
  pnpm: "pnpm add @persian-labs/icons",
  bun: "bun add @persian-labs/icons",
}

const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)

const toTitle = (name: string) =>
  name === "gateway-sep"
    ? "SEP"
    : name.split("-").slice(1).map(capitalize).join(" ")

const toPascal = (value: string) => value.split("-").map(capitalize).join("")

const downloadFile = (filename: string, contents: BlobPart, type: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export type { PackageManager, SnippetKind }
export { capitalize, downloadFile, packageCommands, toPascal, toTitle }
