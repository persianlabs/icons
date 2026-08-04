"use client"

import Image from "next/image"
import { Moon, Sun, Check, Copy } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useSyncExternalStore } from "react"

import {
  packageCommands,
  type PackageManager,
} from "./logo-playground-utils"

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
      className="grid size-9 place-items-center rounded-full border border-foreground/15 text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground"
      aria-label={`Switch to ${dark ? "light" : "dark"} theme`}
    >
      <Sun className="size-4 hidden dark:block" />
      <Moon className="size-4 dark:hidden" />
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
    <div className="mt-6 overflow-hidden rounded-2xl border border-foreground/15 bg-background">
      <div className="flex border-b border-foreground/10 px-2 py-2">
        {(Object.keys(packageCommands) as PackageManager[]).map((item) => (
          <button
            key={item}
            onClick={() => select(item)}
            className={`rounded-md px-3  font-mono text-[11px] ${manager === item ? "bg-foreground text-background" : "text-foreground/40 hover:text-foreground"}`}
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
          className="rounded-full p-1 text-foreground/45 hover:text-foreground"
        >
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        </button>
      </div>
    </div>
  )
}

export function LogoPlaygroundShell({
  logoCount,
}: {
  logoCount: number
}) {
  return (
    <>
      <header className="sticky top-0 z-20 border-b border-foreground/10 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-370 items-center justify-between px-5 lg:px-8">
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
              className="grid size-9 place-items-center rounded-full border border-foreground/15 text-foreground/55 transition-colors hover:border-foreground/35 hover:text-foreground"
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
        className="mx-auto max-w-370 px-5 pt-16 pb-14 lg:px-8 lg:pt-24 lg:pb-20"
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_390px] lg:items-end">
          <div>
            <p className="mb-5 font-mono text-[11px] tracking-[0.18em] text-foreground/45 uppercase">
              {logoCount} brands · {logoCount * 2} marks · MIT
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
              names in native React or Vue components.
            </p>
            <InstallCommand />
          </div>
        </div>
      </section>
    </>
  )
}
