"use client"

import {
  colorLogos,
  logoNames,
  monoLogos,
  type LogoName,
  type LogoVariant,
} from "@persianlabs/icons"
import dynamic from "next/dynamic"
import { useDeferredValue, useMemo, useState } from "react"

import { LogoPlaygroundControls } from "./logo-playground-controls"
import { LogoPlaygroundFooter } from "./logo-playground-footer"
import { LogoPlaygroundGrid } from "./logo-playground-grid"
import { LogoPlaygroundScrollTop } from "./logo-playground-scroll-top"
import { LogoPlaygroundShell } from "./logo-playground-shell"
import { LogoPlaygroundSidebar } from "./logo-playground-sidebar"
import { getCategory, getCategoryLabel, toTitle } from "./logo-playground-utils"

const LogoPlaygroundDialog = dynamic(
  () => import("./logo-playground-dialog").then((m) => m.LogoPlaygroundDialog),
  { ssr: false }
)

export function LogoPlayground({ starCount }: { starCount: number | null }) {
  const [query, setQuery] = useState("")
  const [variant, setVariant] = useState<LogoVariant>("color")
  const [size, setSize] = useState(48)
  const [selectedIcon, setSelectedIcon] = useState<LogoName | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const deferredQuery = useDeferredValue(query)
  const logos = variant === "color" ? colorLogos : monoLogos
  const categories = useMemo(() => {
    const counts = new Map<string, number>()
    for (const name of logoNames) {
      const category = getCategory(name)
      counts.set(category, (counts.get(category) ?? 0) + 1)
    }
    return [...counts.entries()]
      .map(([key, count]) => ({ key, label: getCategoryLabel(key), count }))
      .sort((a, b) => a.label.localeCompare(b.label))
  }, [])
  const visibleIcons = useMemo(() => {
    const needle = deferredQuery.trim().toLowerCase()
    return logoNames.filter((name) => {
      if (selectedCategory && getCategory(name) !== selectedCategory)
        return false
      return (
        !needle ||
        name.includes(needle) ||
        toTitle(name).toLowerCase().includes(needle)
      )
    })
  }, [deferredQuery, selectedCategory])
  return (
    <main className="min-h-svh bg-background text-foreground">
      <LogoPlaygroundShell logoCount={logoNames.length} starCount={starCount} />
      <div className="mx-auto flex max-w-370 items-start lg:gap-8 lg:px-8">
        <LogoPlaygroundSidebar
          categories={categories}
          totalCount={logoNames.length}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          mobileOpen={sidebarOpen}
          onMobileOpenChange={setSidebarOpen}
        />
        <div className="min-w-0 flex-1">
          <LogoPlaygroundControls
            query={query}
            onQueryChange={setQuery}
            variant={variant}
            onVariantChange={setVariant}
            size={size}
            onSizeChange={setSize}
            visibleCount={visibleIcons.length}
            onOpenSidebar={() => setSidebarOpen(true)}
          />
          <LogoPlaygroundGrid
            logos={logos}
            visibleIcons={visibleIcons}
            query={query}
            variant={variant}
            size={size}
            onSelect={setSelectedIcon}
          />
        </div>
      </div>
      <LogoPlaygroundFooter />
      <LogoPlaygroundScrollTop />
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
