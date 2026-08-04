"use client"

import {
  colorLogos,
  logoNames,
  monoLogos,
  type LogoName,
  type LogoVariant,
} from "@persian-labs/icons"
import { useDeferredValue, useMemo, useState } from "react"

import { LogoPlaygroundControls } from "./logo-playground-controls"
import { LogoPlaygroundDialog } from "./logo-playground-dialog"
import { LogoPlaygroundFooter } from "./logo-playground-footer"
import { LogoPlaygroundGrid } from "./logo-playground-grid"
import { LogoPlaygroundShell } from "./logo-playground-shell"
import { toTitle } from "./logo-playground-utils"

export function LogoPlayground() {
  const [query, setQuery] = useState("")
  const [variant, setVariant] = useState<LogoVariant>("color")
  const [size, setSize] = useState(48)
  const [selectedIcon, setSelectedIcon] = useState<LogoName | null>(null)
  const deferredQuery = useDeferredValue(query)
  const logos = variant === "color" ? colorLogos : monoLogos
  const visibleIcons = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()
    return logoNames.filter(
      (name) =>
        !needle ||
        name.includes(needle) ||
        toTitle(name).toLowerCase().includes(needle)
    )
  }, [deferredQuery])
  return (
    <main className="min-h-svh bg-background text-foreground">
      <LogoPlaygroundShell logoCount={logoNames.length} />
      <LogoPlaygroundControls
        query={query}
        onQueryChange={setQuery}
        variant={variant}
        onVariantChange={setVariant}
        size={size}
        onSizeChange={setSize}
        visibleCount={visibleIcons.length}
      />
      <LogoPlaygroundGrid
        logos={logos}
        visibleIcons={visibleIcons}
        query={query}
        variant={variant}
        size={size}
        onSelect={setSelectedIcon}
      />
      <LogoPlaygroundFooter />
      <LogoPlaygroundDialog
        name={selectedIcon}
        logos={logos}
        variant={variant}
        onVariantChange={setVariant}
        onClose={() => setSelectedIcon(null)}
      />
    </main>
  )
}
