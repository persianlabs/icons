"use client"

import { Check, Copy, Download } from "lucide-react"
import { useState } from "react"

import { type LogoName, type LogoVariant } from "@persianlabs/icons"
import { LogoIcon } from "@persianlabs/icons/react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import { Switch } from "@workspace/ui/components/switch"

import {
  downloadFile,
  getCategory,
  getCategoryLabel,
  toJsxSvgBody,
  toPascal,
  toTitle,
  type PackageManager,
  type SnippetKind,
} from "./logo-playground-utils"

export function LogoPlaygroundDialog({
  name,
  logos,
  variant,
  onVariantChange,
  onClose,
}: {
  name: LogoName | null
  logos: Record<LogoName, Parameters<typeof LogoIcon>[0]["icon"]>
  variant: LogoVariant
  onVariantChange: (variant: LogoVariant) => void
  onClose: () => void
}) {
  const [syntaxIndex, setSyntaxIndex] = useState(() => {
    if (typeof window === "undefined") return 2
    const saved = Number(localStorage.getItem("persian-logos-copy-style"))
    return Number.isInteger(saved) && saved >= 0 && saved <= 2 ? saved : 1
  })
  const [copied, setCopied] = useState<string | null>(null)
  if (!name) return null
  const icon = logos[name]
  const title = toTitle(name)
  const component = `${toPascal(name)}${variant === "color" ? "Color" : "Mono"}`
  const syntaxes = [
    `<${component}/>`,
    component,
    `import { ${component} } from "@persianlabs/icons/${variant}"`,
  ]
  const viewBox = `${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? 16} ${icon.height ?? 16}`
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}">${icon.body}</svg>`
  const reactFunctionName = `${toPascal(name)}${variant === "color" ? "Color" : "Mono"}Icon`
  const snippets: Record<SnippetKind, string> = {
    react: `export function ${reactFunctionName}(props: React.SVGProps<SVGSVGElement>) {\n  return (\n    <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width={48} height={48} role="img" aria-label="${title}" {...props}>\n      ${toJsxSvgBody(icon.body)}\n    </svg>\n  )\n}`,
    vue: `<template>\n  <svg xmlns="http://www.w3.org/2000/svg" viewBox="${viewBox}" width="48" height="48" role="img" aria-label="${title}">\n    ${icon.body}\n  </svg>\n</template>`,
  }
  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    setCopied(key)
    window.setTimeout(
      () => setCopied((current) => (current === key ? null : current)),
      1400
    )
  }
  function selectSyntax(index: number) {
    setSyntaxIndex(index)
    localStorage.setItem("persian-logos-copy-style", String(index))
  }
  async function downloadPng() {
    const image = document.createElement("img")
    const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }))
    image.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = 512
      canvas.height = 512
      const context = canvas.getContext("2d")
      context?.drawImage(image, 0, 0, 512, 512)
      canvas.toBlob((blob) => {
        if (blob) downloadFile(`${name}.png`, blob, "image/png")
      }, "image/png")
      URL.revokeObjectURL(url)
    }
    image.src = url
  }
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose()
      }}
    >
      <DialogContent
        showCloseButton
        className="max-h-[calc(100svh-2rem)] w-[min(720px,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden rounded-2xl border-foreground/15 bg-background p-0 text-foreground sm:max-w-none"
      >
        <div className="flex max-h-[calc(100svh-2rem)] min-h-0 flex-col">
          <DialogHeader className="h-16 shrink-0 justify-center gap-0 border-b border-foreground/10 px-5 pr-16">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase">
              {variant} · {getCategoryLabel(getCategory(name))}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto">
            <div className="relative grid h-52 place-items-center border-b border-foreground/10 bg-muted/35 p-8">
              <div className="absolute top-4 right-4 flex h-8 items-center gap-2 border border-foreground/15 bg-background px-2.5 font-mono text-[10px] tracking-[0.08em] uppercase">
                <span
                  className={
                    variant === "color"
                      ? "text-foreground"
                      : "text-foreground/60"
                  }
                >
                  Color
                </span>
                <Switch
                  checked={variant === "mono"}
                  onCheckedChange={(checked) =>
                    onVariantChange(checked ? "mono" : "color")
                  }
                  aria-label="Use monochrome logo"
                />
                <span
                  className={
                    variant === "mono"
                      ? "text-foreground"
                      : "text-foreground/60"
                  }
                >
                  Mono
                </span>
              </div>
              <div
                className="flex items-center justify-center transition-[width,height] duration-300 ease-out motion-reduce:transition-none"
                style={{ width: 128, height: 128 }}
              >
                <LogoIcon
                  icon={icon}
                  width="100%"
                  height="100%"
                  title={`${title} logo`}
                  className={variant === "mono" ? "text-foreground" : undefined}
                />
              </div>
            </div>
            <div className="p-5 sm:p-7">
              <section>
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Copy format · last choice remembered
                </p>
                <div className="flex gap-2">
                  <Select
                    value={String(syntaxIndex)}
                    onValueChange={(value) => selectSyntax(Number(value))}
                  >
                    <SelectTrigger
                      aria-label="Copy format"
                      className="h-9 min-w-0 flex-1 rounded-xl border-foreground/15 bg-background px-3 font-mono text-[11px]"
                    >
                      <SelectValue>{syntaxes[syntaxIndex] ?? name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      className="max-w-[min(520px,calc(100vw-3rem))] rounded-xl font-mono text-[11px]"
                    >
                      {syntaxes.map((syntax, index) => (
                        <SelectItem key={syntax} value={String(index)}>
                          {syntax}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() =>
                      copyText("syntax", syntaxes[syntaxIndex] ?? "")
                    }
                    className="flex h-9 shrink-0 items-center gap-2 rounded-full bg-foreground px-3 text-[11px] text-background"
                  >
                    {copied === "syntax" ? (
                      <Check className="size-3.5" />
                    ) : (
                      <Copy className="size-3.5" />
                    )}{" "}
                    Copy
                  </button>
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Download assets
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      downloadFile(`${name}.svg`, svg, "image/svg+xml")
                    }
                    className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                  >
                    <Download className="size-3" /> SVG
                  </button>
                  <button
                    onClick={downloadPng}
                    className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                  >
                    <Download className="size-3" /> PNG
                  </button>
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Copy snippets
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(snippets) as SnippetKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() => copyText(kind, snippets[kind])}
                      className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] capitalize hover:border-foreground/35"
                    >
                      {copied === kind ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {kind}
                    </button>
                  ))}
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Download snippets
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(snippets) as SnippetKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() =>
                        downloadFile(
                          `${name}.${kind === "react" ? "tsx" : "vue"}`,
                          snippets[kind],
                          "text/plain"
                        )
                      }
                      className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] capitalize hover:border-foreground/35"
                    >
                      <Download className="size-3" />
                      {kind}
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
