import type {
  LogoIconData,
  LogoName,
  LogoVariant,
} from "@persianlabs/icons/meta"

import { toJsxSvgBody, toPascal } from "./logo-playground-utils"

export type DownloadFormat =
  "svg" | "png" | "vue" | "react" | "react-ts" | "svelte"

export const downloadFormats: { key: DownloadFormat; label: string }[] = [
  { key: "svg", label: "SVG" },
  { key: "png", label: "PNG" },
  { key: "vue", label: "Vue" },
  { key: "react", label: "React" },
  { key: "react-ts", label: "React TS" },
  { key: "svelte", label: "Svelte" },
]

export const viewBoxOf = (icon: LogoIconData) =>
  `${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? 16} ${icon.height ?? 16}`

export const buildSvgMarkup = (icon: LogoIconData) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxOf(icon)}">${icon.body}</svg>`

export const buildSvgSymbolMarkup = (name: LogoName, icon: LogoIconData) =>
  `<symbol id="icon-${name}" viewBox="${viewBoxOf(icon)}">${icon.body}</symbol>`

export const buildJsxSnippet = (icon: LogoIconData, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxOf(icon)}" width={48} height={48} role="img" aria-label="${title}">\n  ${toJsxSvgBody(icon.body)}\n</svg>`

export const buildReactSnippet = (
  name: LogoName,
  variant: LogoVariant,
  icon: LogoIconData,
  title: string,
  typed: boolean
) => {
  const fnName = `${toPascal(name)}${variant === "color" ? "Color" : "Mono"}Icon`
  const props = typed ? "props: React.SVGProps<SVGSVGElement>" : "props"
  return `import * as React from "react"\n\nexport function ${fnName}(${props}) {\n  return (\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxOf(icon)}" width={48} height={48} role="img" aria-label="${title}" {...props}>\n      ${toJsxSvgBody(icon.body)}\n    </svg>\n  )\n}`
}

export const buildVueSnippet = (
  icon: LogoIconData,
  title: string,
  typed: boolean
) =>
  `<template>\n  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxOf(icon)}" width="48" height="48" role="img" aria-label="${title}">\n    ${icon.body}\n  </svg>\n</template>${typed ? '\n<script setup lang="ts"></script>\n' : ""}`

export const buildSvelteSnippet = (icon: LogoIconData, title: string) =>
  `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBoxOf(icon)}" width="48" height="48" role="img" aria-label="${title}">\n  ${icon.body}\n</svg>`

export function renderPngBlob(icon: LogoIconData, size = 512): Promise<Blob> {
  const svg = buildSvgMarkup(icon)
  const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = size
      canvas.height = size
      const context = canvas.getContext("2d")
      context?.drawImage(image, 0, 0, size, size)
      canvas.toBlob((blob) => {
        URL.revokeObjectURL(url)
        if (blob) resolve(blob)
        else reject(new Error("Failed to render PNG"))
      }, "image/png")
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error("Failed to load SVG for PNG rendering"))
    }
    image.src = url
  })
}

/** Text-file formats. PNG is binary and handled separately via `renderPngBlob`. */
export function buildTextFile(
  format: Exclude<DownloadFormat, "png">,
  name: LogoName,
  variant: LogoVariant,
  icon: LogoIconData,
  title: string
): { content: string; extension: string } {
  switch (format) {
    case "svg":
      return { content: buildSvgMarkup(icon), extension: "svg" }
    case "vue":
      return { content: buildVueSnippet(icon, title, false), extension: "vue" }
    case "react":
      return {
        content: buildReactSnippet(name, variant, icon, title, false),
        extension: "jsx",
      }
    case "react-ts":
      return {
        content: buildReactSnippet(name, variant, icon, title, true),
        extension: "tsx",
      }
    case "svelte":
      return { content: buildSvelteSnippet(icon, title), extension: "svelte" }
  }
}
