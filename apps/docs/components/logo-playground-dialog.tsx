"use client"

import { Check, Copy, Download } from "lucide-react"
import { useState } from "react"

import {
  type LogoIconData,
  type LogoName,
  type LogoVariant,
} from "@persianlabs/icons/meta"
import { LogoIcon } from "@persianlabs/icons/logo-icon"
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

import { downloadLogos } from "./logo-download"
import {
  buildJsxSnippet,
  buildReactSnippet,
  buildSvgMarkup,
  buildSvgSymbolMarkup,
  buildVueSnippet,
  renderPngBlob,
  type DownloadFormat,
} from "./logo-format"
import {
  getCategory,
  getCategoryLabel,
  toPascal,
  toTitle,
} from "./logo-playground-utils"

const downloadButtons: { key: DownloadFormat; label: string }[] = [
  { key: "svg", label: "SVG" },
  { key: "png", label: "PNG" },
  { key: "vue", label: "Vue" },
  { key: "react", label: "React" },
  { key: "react-ts", label: "React TS" },
  { key: "svelte", label: "Svelte" },
]

type SnippetKey = "svg" | "svg-symbol" | "png" | "jsx"
const snippetButtons: { key: SnippetKey; label: string }[] = [
  { key: "svg", label: "SVG" },
  { key: "svg-symbol", label: "SVG Symbol" },
  { key: "png", label: "PNG" },
  { key: "jsx", label: "JSX" },
]

type ComponentKey = "vue" | "vue-ts" | "react" | "react-ts"
const componentButtons: { key: ComponentKey; label: string }[] = [
  { key: "vue", label: "Vue" },
  { key: "vue-ts", label: "Vue TS" },
  { key: "react", label: "React" },
  { key: "react-ts", label: "React TS" },
]

export function LogoPlaygroundDialog({
  name,
  logos,
  variant,
  onVariantChange,
  onClose,
}: {
  name: LogoName | null
  logos: Partial<Record<LogoName, LogoIconData>>
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
  if (!icon) return null
  const title = toTitle(name)
  const component = `${toPascal(name)}${variant === "color" ? "Color" : "Mono"}`
  const syntaxes = [
    `<${component}/>`,
    component,
    `import { ${component} } from "@persianlabs/icons/${variant}"`,
  ]
  async function copyText(key: string, value: string) {
    await navigator.clipboard.writeText(value)
    markCopied(key)
  }
  function markCopied(key: string) {
    setCopied(key)
    window.setTimeout(
      () => setCopied((current) => (current === key ? null : current)),
      1400
    )
  }
  async function copyPng(key: string) {
    if (!icon) return
    const blob = await renderPngBlob(icon)
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob }),
      ])
    } catch {
      const dataUrl = await new Promise<string>((resolve) => {
        const reader = new FileReader()
        reader.onload = () => resolve(String(reader.result))
        reader.readAsDataURL(blob)
      })
      await navigator.clipboard.writeText(dataUrl)
    }
    markCopied(key)
  }
  function selectSyntax(index: number) {
    setSyntaxIndex(index)
    localStorage.setItem("persian-logos-copy-style", String(index))
  }
  function snippetFor(key: SnippetKey) {
    if (!icon) return ""
    switch (key) {
      case "svg":
        return buildSvgMarkup(icon)
      case "svg-symbol":
        return buildSvgSymbolMarkup(name!, icon)
      case "jsx":
        return buildJsxSnippet(icon, title)
      case "png":
        return ""
    }
  }
  function componentFor(key: ComponentKey) {
    if (!icon) return ""
    switch (key) {
      case "vue":
        return buildVueSnippet(icon, title, false)
      case "vue-ts":
        return buildVueSnippet(icon, title, true)
      case "react":
        return buildReactSnippet(name!, variant, icon, title, false)
      case "react-ts":
        return buildReactSnippet(name!, variant, icon, title, true)
    }
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
                  Download
                </p>
                <div className="flex flex-wrap gap-2">
                  {downloadButtons.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        downloadLogos({
                          names: [name!],
                          variant,
                          format: key,
                          getIcon: () => icon,
                        })
                      }
                      className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                    >
                      <Download className="size-3" /> {label}
                    </button>
                  ))}
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Snippets · click to copy
                </p>
                <div className="flex flex-wrap gap-2">
                  {snippetButtons.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() =>
                        key === "png"
                          ? copyPng(key)
                          : copyText(key, snippetFor(key))
                      }
                      className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                    >
                      {copied === key ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {label}
                    </button>
                  ))}
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/60 uppercase">
                  Components · click to copy
                </p>
                <div className="flex flex-wrap gap-2">
                  {componentButtons.map(({ key, label }) => (
                    <button
                      key={key}
                      onClick={() => copyText(key, componentFor(key))}
                      className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                    >
                      {copied === key ? (
                        <Check className="size-3" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                      {label}
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
