"use client"

import { ElasticSlider } from "@/components/elastic-slider"
import {
  colorIcons,
  iconNames,
  monoIcons,
  type IconName,
  type LogoVariant,
} from "@persian-labs/icons"
import { LogoIcon } from "@persian-labs/icons/react"
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
import { Check, Copy, Download, Moon, Search, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Image from "next/image"
import {
  useDeferredValue,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

type PackageManager = "npm" | "pnpm" | "bun"
type SnippetKind = "react" | "vue" | "svelte"

const packageCommands: Record<PackageManager, string> = {
  npm: "npm install @persian-labs/icons",
  pnpm: "pnpm add @persian-labs/icons",
  bun: "bun add @persian-labs/icons",
}

const toTitle = (name: string) =>
  name === "gateway-sep"
    ? "SEP"
    : name.split("-").slice(1).map(capitalize).join(" ")
const toPascal = (value: string) => value.split("-").map(capitalize).join("")
const toCamel = (value: string) => {
  const pascal = toPascal(value)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}
const capitalize = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1)
const downloadFile = (filename: string, contents: BlobPart, type: string) => {
  const url = URL.createObjectURL(new Blob([contents], { type }))
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

function GitHubMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .7A11.5 11.5 0 0 0 8.36 23.1c.58.1.79-.25.79-.56v-2.2c-3.23.7-3.91-1.37-3.91-1.37-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.77 2.72 1.26 3.38.96.1-.75.4-1.26.74-1.55-2.58-.3-5.29-1.29-5.29-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.72 5.38-5.31 5.67.42.36.79 1.07.79 2.16v3.2c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .7Z" />
    </svg>
  )
}

const subscribeToNothing = () => () => undefined
const useMounted = () =>
  useSyncExternalStore(
    subscribeToNothing,
    () => true,
    () => false
  )

function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const mounted = useMounted()
  const dark = !mounted || resolvedTheme === "dark"
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      className="grid size-9 place-items-center border border-foreground/15 text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
    >
      {dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </button>
  )
}

function InstallCommand() {
  const mounted = useMounted()
  const [managerOverride, setManagerOverride] = useState<PackageManager | null>(
    null
  )
  const [copied, setCopied] = useState(false)
  const saved = mounted
    ? (localStorage.getItem(
        "persian-logos-package-manager"
      ) as PackageManager | null)
    : null
  const manager =
    managerOverride ?? (saved && saved in packageCommands ? saved : "npm")
  function select(next: PackageManager) {
    setManagerOverride(next)
    localStorage.setItem("persian-logos-package-manager", next)
  }
  async function copy() {
    await navigator.clipboard.writeText(packageCommands[manager])
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1400)
  }
  return (
    <div className="mt-6 border border-foreground/15 bg-background">
      <div className="flex border-b border-foreground/10 px-2 pt-2">
        {(Object.keys(packageCommands) as PackageManager[]).map((item) => (
          <button
            key={item}
            onClick={() => select(item)}
            className={`px-3 py-2 font-mono text-[11px] ${manager === item ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground"}`}
          >
            {item}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-4 px-4 py-4">
        <code className="min-w-0 flex-1 overflow-x-auto font-mono text-xs whitespace-nowrap text-foreground">
          {packageCommands[manager]}
        </code>
        <button
          onClick={copy}
          aria-label="Copy install command"
          className="text-foreground/45 hover:text-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  )
}

function IconDialog({
  name,
  variant,
  onVariantChange,
  onClose,
}: {
  name: IconName | null
  variant: LogoVariant
  onVariantChange: (variant: LogoVariant) => void
  onClose: () => void
}) {
  const [syntaxIndex, setSyntaxIndex] = useState(() => {
    if (typeof window === "undefined") return 2
    // Keep a visitor's preferred ecosystem syntax between sessions.
    const saved = Number(localStorage.getItem("persian-logos-copy-style"))
    return Number.isInteger(saved) && saved >= 0 && saved <= 12 ? saved : 2
  })
  const [copied, setCopied] = useState<string | null>(null)
  if (!name) return null
  const icon = (variant === "color" ? colorIcons : monoIcons)[name]
  const prefix = variant === "color" ? "persian-logos" : "persian-logos-mono"
  const title = toTitle(name)
  const component = `${toPascal(name)}${variant === "color" ? "Color" : "Mono"}`
  const syntaxes = [
    name,
    toPascal(name),
    `${prefix}:${name}`,
    `${prefix}-${name}`,
    `${prefix}/${name}`,
    `${prefix}--${name}`,
    `${toCamel(prefix)}${toPascal(name)}`,
    `${toPascal(prefix)}${toPascal(name)}`,
    `<${component}/>`,
    `<${prefix}-${name}/>`,
    `i-${prefix}:${name}`,
    `i-${prefix}-${name}`,
    `icon-[${prefix}--${name}]`,
  ]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${icon.left ?? 0} ${icon.top ?? 0} ${icon.width ?? 16} ${icon.height ?? 16}">${icon.body}</svg>`
  const snippets: Record<SnippetKind, string> = {
    react: `import { ${component} } from "@persian-labs/icons/react"\n\nexport function Logo() {\n  return <${component} width={48} title="${title}" />\n}`,
    vue: `<script setup lang="ts">\nimport { ${component} } from "@persian-labs/icons/vue"\n</script>\n\n<template>\n  <${component} width="48" aria-label="${title}" />\n</template>`,
    svelte: `<script lang="ts">\n  import Icon from "@iconify/svelte"\n</script>\n\n<Icon icon="${prefix}:${name}" width="48" aria-label="${title}" />`,
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
        className="max-h-[calc(100svh-2rem)] w-[min(720px,calc(100vw-2rem))] max-w-none gap-0 overflow-hidden rounded-none border-foreground/15 bg-background p-0 text-foreground sm:max-w-none"
      >
        <div className="flex max-h-[calc(100svh-2rem)] min-h-0 flex-col">
          <DialogHeader className="h-16 shrink-0 justify-center gap-0 border-b border-foreground/10 px-5 pr-16">
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription className="font-mono text-[10px] uppercase">
              {variant} · {name.startsWith("bank-") ? "bank" : "gateway"}
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-0 overflow-y-auto">
            <div className="relative grid h-52 place-items-center border-b border-foreground/10 bg-muted/35 p-8">
              <div className="absolute top-4 right-4 flex h-8 items-center gap-2 border border-foreground/15 bg-background px-2.5 font-mono text-[10px] tracking-[0.08em] uppercase">
                <span
                  className={
                    variant === "color"
                      ? "text-foreground"
                      : "text-foreground/35"
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
                      : "text-foreground/35"
                  }
                >
                  Mono
                </span>
              </div>
              <LogoIcon
                icon={icon}
                width={128}
                height={128}
                title={`${title} logo`}
                className={variant === "mono" ? "text-foreground" : undefined}
              />
            </div>
            <div className="p-5 sm:p-7">
              <section>
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/35 uppercase">
                  Copy format · last choice remembered
                </p>
                <div className="flex gap-2">
                  <Select
                    value={String(syntaxIndex)}
                    onValueChange={(value) => selectSyntax(Number(value))}
                  >
                    <SelectTrigger className="!h-9 min-w-0 flex-1 rounded-none border-foreground/15 bg-background px-3 font-mono text-[11px]">
                      <SelectValue>{syntaxes[syntaxIndex] ?? name}</SelectValue>
                    </SelectTrigger>
                    <SelectContent
                      align="start"
                      className="max-w-[min(520px,calc(100vw-3rem))] rounded-none font-mono text-[11px]"
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
                    className="flex h-9 shrink-0 items-center gap-2 bg-foreground px-3 text-[11px] text-background"
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
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/35 uppercase">
                  Download assets
                </p>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() =>
                      downloadFile(`${name}.svg`, svg, "image/svg+xml")
                    }
                    className="flex h-8 items-center gap-1.5 border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                  >
                    <Download className="size-3" /> SVG
                  </button>
                  <button
                    onClick={downloadPng}
                    className="flex h-8 items-center gap-1.5 border border-foreground/15 px-3 text-[10px] hover:border-foreground/35"
                  >
                    <Download className="size-3" /> PNG
                  </button>
                </div>
              </section>
              <section className="mt-7 border-t border-foreground/10 pt-5">
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/35 uppercase">
                  Copy snippets
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(snippets) as SnippetKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() => copyText(kind, snippets[kind])}
                      className="flex h-8 items-center gap-1.5 border border-foreground/15 px-3 text-[10px] capitalize hover:border-foreground/35"
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
                <p className="mb-3 font-mono text-[10px] tracking-[0.16em] text-foreground/35 uppercase">
                  Download snippets
                </p>
                <div className="flex flex-wrap gap-2">
                  {(Object.keys(snippets) as SnippetKind[]).map((kind) => (
                    <button
                      key={kind}
                      onClick={() =>
                        downloadFile(
                          `${name}.${kind === "react" ? "tsx" : kind === "vue" ? "vue" : "svelte"}`,
                          snippets[kind],
                          "text/plain"
                        )
                      }
                      className="flex h-8 items-center gap-1.5 border border-foreground/15 px-3 text-[10px] capitalize hover:border-foreground/35"
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

export function LogoPlayground() {
  const [query, setQuery] = useState("")
  const [variant, setVariant] = useState<LogoVariant>("color")
  const [size, setSize] = useState(48)
  const [selectedIcon, setSelectedIcon] = useState<IconName | null>(null)
  const deferredQuery = useDeferredValue(query)
  const icons = variant === "color" ? colorIcons : monoIcons
  const visibleIcons = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()
    return iconNames.filter(
      (name) =>
        !needle ||
        name.includes(needle) ||
        toTitle(name).toLowerCase().includes(needle)
    )
  }, [deferredQuery])
  return (
    <main className="min-h-svh bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-[1480px] items-center justify-between px-5 lg:px-8">
          <a
            href="#top"
            className="flex items-center gap-3 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={28}
              height={28}
              className="invert dark:invert-0"
            />
            <span className="text-sm font-semibold tracking-[-0.02em]">
              Persian Logos
            </span>
          </a>
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/persian-labs/icons"
              target="_blank"
              rel="noreferrer"
              className="grid size-9 place-items-center border border-foreground/15 text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground"
              aria-label="Persian Logos on GitHub"
            >
              <GitHubMark className="size-4" />
            </a>
            <ThemeToggle />
          </div>
        </div>
      </header>
      <section
        id="top"
        className="mx-auto max-w-[1480px] px-5 pt-16 pb-14 lg:px-8 lg:pt-24 lg:pb-20"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.18em] text-foreground/45 uppercase">
              {iconNames.length} brands · {iconNames.length * 2} marks · MIT
            </p>
            <h1 className="max-w-5xl text-[clamp(3.25rem,8vw,8.5rem)] leading-[0.84] font-semibold tracking-[-0.075em] text-balance">
              Iranian logos,
              <br />
              <span className="text-foreground/35">ready to ship.</span>
            </h1>
          </div>
          <div className="border-l border-foreground/15 pl-6 text-sm leading-6 text-foreground/55">
            <p>
              A growing, typed collection of Iranian brand logos. Use the same
              names in React, Vue, or Iconify.
            </p>
            <InstallCommand />
          </div>
        </div>
      </section>
      <section className="border-y border-foreground/10 bg-muted/25">
        <div className="mx-auto grid max-w-[1480px] gap-4 px-5 py-4 md:grid-cols-[1fr_150px_260px] md:items-center lg:px-8">
          <label className="flex h-11 items-center gap-3 border border-foreground/15 bg-background px-4 focus-within:border-foreground/45">
            <Search className="size-4 text-foreground/35" />
            <span className="sr-only">Search logos</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search Iranian brands…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/30"
            />
            <kbd className="font-mono text-[10px] text-foreground/25">
              /{visibleIcons.length}
            </kbd>
          </label>
          <Select
            value={variant}
            onValueChange={(value) => setVariant(value as LogoVariant)}
          >
            <SelectTrigger className="h-11 w-full rounded-none border-foreground/15 bg-background px-3 capitalize">
              <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="rounded-none">
              <SelectItem value="color">Color</SelectItem>
              <SelectItem value="mono">Mono</SelectItem>
            </SelectContent>
          </Select>
          <ElasticSlider
            label="Size"
            min={32}
            max={88}
            step={8}
            value={size}
            onValueChange={setSize}
            formatValue={(value) => `${value}px`}
          />
        </div>
      </section>
      <section className="mx-auto max-w-[1480px] px-5 py-8 lg:px-8 lg:py-12">
        {visibleIcons.length ? (
          <div className="grid grid-cols-2 border-t border-l border-foreground/10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleIcons.map((name) => (
              <button
                type="button"
                key={name}
                onClick={() => setSelectedIcon(name)}
                className="group relative flex min-h-56 flex-col border-r border-b border-foreground/10 bg-background p-5 text-left transition-colors hover:bg-muted/45 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <span className="flex flex-1 items-center justify-center">
                  <LogoIcon
                    icon={icons[name]}
                    width={size}
                    height={size}
                    title={`${toTitle(name)} logo`}
                    className={
                      variant === "mono" ? "text-foreground" : undefined
                    }
                  />
                </span>
                <span>
                  <span className="block truncate text-sm font-medium">
                    {toTitle(name)}
                  </span>
                  <span className="mt-1 block font-mono text-[10px] text-foreground/30">
                    {name.startsWith("bank-") ? "BANK" : "GATEWAY"} · OPEN
                  </span>
                </span>
              </button>
            ))}
          </div>
        ) : (
          <div className="grid min-h-80 place-items-center border border-foreground/10 text-sm text-foreground/40">
            No logos match “{query}”.
          </div>
        )}
      </section>
      <footer className="border-t border-foreground/10">
        <div className="mx-auto flex max-w-[1480px] flex-col gap-5 px-5 py-10 text-xs text-foreground/40 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>
            Built for React, Vue, and Iconify by{" "}
            <a
              className="text-foreground hover:underline"
              href="https://persian-labs.ir"
            >
              Persian Labs
            </a>
            .
          </p>
          <p>
            Huge credit to{" "}
            <a
              className="text-foreground underline decoration-foreground/25 underline-offset-4 hover:decoration-foreground"
              href="https://github.com/zegond/logos-per-banks"
            >
              zegond/logos-per-banks
            </a>{" "}
            for designing the SVGs.
          </p>
        </div>
      </footer>
      <IconDialog
        name={selectedIcon}
        variant={variant}
        onVariantChange={setVariant}
        onClose={() => setSelectedIcon(null)}
      />
    </main>
  )
}
