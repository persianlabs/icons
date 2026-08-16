import type { LogoIconData, LogoName, LogoVariant } from "@persianlabs/icons/meta"

import { buildTextFile, renderPngBlob, type DownloadFormat } from "./logo-format"
import { downloadFile, toTitle } from "./logo-playground-utils"

async function fileFor(
  format: DownloadFormat,
  name: LogoName,
  variant: LogoVariant,
  icon: LogoIconData
): Promise<{ content: Blob | string; extension: string }> {
  if (format === "png") {
    const blob = await renderPngBlob(icon)
    return { content: blob, extension: "png" }
  }
  const { content, extension } = buildTextFile(format, name, variant, icon, toTitle(name))
  return { content, extension }
}

/** Downloads one file per icon, or a single .zip when there's more than one. */
export async function downloadLogos({
  names,
  variant,
  format,
  getIcon,
}: {
  names: LogoName[]
  variant: LogoVariant
  format: DownloadFormat
  getIcon: (name: LogoName) => LogoIconData | undefined
}) {
  const entries = names
    .map((name) => ({ name, icon: getIcon(name) }))
    .filter((entry): entry is { name: LogoName; icon: LogoIconData } => !!entry.icon)
  if (!entries.length) return

  if (entries.length === 1) {
    const entry = entries[0]!
    const file = await fileFor(format, entry.name, variant, entry.icon)
    const mime = format === "png" ? "image/png" : "text/plain"
    downloadFile(`${entry.name}.${file.extension}`, file.content, mime)
    return
  }

  const { default: JSZip } = await import("jszip")
  const zip = new JSZip()
  for (const entry of entries) {
    const file = await fileFor(format, entry.name, variant, entry.icon)
    zip.file(`${entry.name}.${file.extension}`, file.content)
  }
  const blob = await zip.generateAsync({ type: "blob" })
  downloadFile(`persian-icons-${format}.zip`, blob, "application/zip")
}
