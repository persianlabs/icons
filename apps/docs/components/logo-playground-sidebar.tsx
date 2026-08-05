"use client"

import { useMemo, useState } from "react"
import { Search } from "lucide-react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@workspace/ui/components/dialog"
import { cn } from "@workspace/ui/lib/utils"

export type CategoryOption = { key: string; label: string; count: number }

function CategoryList({
  categories,
  totalCount,
  selectedCategory,
  onSelect,
}: {
  categories: CategoryOption[]
  totalCount: number
  selectedCategory: string | null
  onSelect: (category: string | null) => void
}) {
  const [search, setSearch] = useState("")
  const filtered = useMemo(() => {
    const needle = search.trim().toLowerCase()
    if (!needle) return categories
    return categories.filter((category) =>
      category.label.toLowerCase().includes(needle)
    )
  }, [categories, search])
  return (
    <div className="flex h-full flex-col">
      <label className="mb-3 flex h-9 shrink-0 items-center gap-2 rounded-xl border border-foreground/15 bg-background px-3 focus-within:border-foreground/45">
        <Search className="size-3.5 text-foreground/35" />
        <span className="sr-only">Search categories</span>
        <input
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Filter categories…"
          className="w-full bg-transparent text-xs outline-none placeholder:text-foreground/30"
        />
      </label>
      <nav className="min-h-0 flex-1 space-y-0.5 overflow-y-auto">
        <button
          type="button"
          onClick={() => onSelect(null)}
          className={cn(
            "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
            selectedCategory === null
              ? "bg-foreground text-background"
              : "text-foreground/60 hover:bg-muted/60 hover:text-foreground"
          )}
        >
          <span>All categories</span>
          <span className="font-mono text-[10px] opacity-60">{totalCount}</span>
        </button>
        {filtered.map((category) => (
          <button
            key={category.key}
            type="button"
            onClick={() => onSelect(category.key)}
            className={cn(
              "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors",
              selectedCategory === category.key
                ? "bg-foreground text-background"
                : "text-foreground/60 hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span className="truncate">{category.label}</span>
            <span className="font-mono text-[10px] opacity-60">
              {category.count}
            </span>
          </button>
        ))}
        {filtered.length === 0 && (
          <p className="px-3 py-2 text-xs text-foreground/60">
            No categories match “{search}”.
          </p>
        )}
      </nav>
    </div>
  )
}

export function LogoPlaygroundSidebar({
  categories,
  totalCount,
  selectedCategory,
  onSelectCategory,
  mobileOpen,
  onMobileOpenChange,
}: {
  categories: CategoryOption[]
  totalCount: number
  selectedCategory: string | null
  onSelectCategory: (category: string | null) => void
  mobileOpen: boolean
  onMobileOpenChange: (open: boolean) => void
}) {
  return (
    <>
      <aside className="sticky top-16 hidden h-[calc(100svh-4rem)] w-56 shrink-0 border-r border-foreground/10 py-6 pr-5 lg:block">
        <CategoryList
          categories={categories}
          totalCount={totalCount}
          selectedCategory={selectedCategory}
          onSelect={onSelectCategory}
        />
      </aside>
      <Dialog open={mobileOpen} onOpenChange={onMobileOpenChange}>
        <DialogContent
          showCloseButton
          className="start-0 top-0 flex h-svh w-72 max-w-none -translate-x-0 -translate-y-0 flex-col rounded-none rounded-r-2xl border-foreground/15 bg-background p-4 duration-200 sm:max-w-none data-open:slide-in-from-left-full data-closed:slide-out-to-left-full"
        >
          <DialogTitle className="mb-1 shrink-0 text-sm">
            Categories
          </DialogTitle>
          <DialogDescription className="sr-only">
            Filter logos by category
          </DialogDescription>
          <div className="min-h-0 flex-1">
            <CategoryList
              categories={categories}
              totalCount={totalCount}
              selectedCategory={selectedCategory}
              onSelect={(category) => {
                onSelectCategory(category)
                onMobileOpenChange(false)
              }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
