import { Menu, Search } from "lucide-react"

import { ElasticSlider } from "@/components/elastic-slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@workspace/ui/components/select"
import type { LogoVariant } from "@persianlabs/icons"

export function LogoPlaygroundControls({
  query,
  onQueryChange,
  variant,
  onVariantChange,
  size,
  onSizeChange,
  visibleCount,
  onOpenSidebar,
}: {
  query: string
  onQueryChange: (value: string) => void
  variant: LogoVariant
  onVariantChange: (value: LogoVariant) => void
  size: number
  onSizeChange: (value: number) => void
  visibleCount: number
  onOpenSidebar: () => void
}) {
  return (
    <section className="border-y border-foreground/10 bg-muted/25 lg:border-none lg:bg-transparent">
      <div className="grid gap-4 px-5 py-4 md:grid-cols-[1fr_150px_260px] md:items-center">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenSidebar}
            aria-label="Open categories"
            className="grid size-11 shrink-0 place-items-center rounded-2xl border border-foreground/15 bg-background text-foreground/55 hover:border-foreground/35 hover:text-foreground lg:hidden"
          >
            <Menu className="size-4" />
          </button>
          <label className="flex h-11 flex-1 items-center gap-3 rounded-2xl border border-foreground/15 bg-background px-4 focus-within:border-foreground/45">
            <Search className="size-4 text-foreground/35" />
            <span className="sr-only">Search logos</span>
            <input
              value={query}
              onChange={(event) => onQueryChange(event.target.value)}
              placeholder="Search Iranian brands…"
              className="w-full bg-transparent text-sm outline-none placeholder:text-foreground/30"
            />
            <kbd className="font-mono text-[10px] text-foreground/55">
              /{visibleCount}
            </kbd>
          </label>
        </div>
        <Select
          value={variant}
          onValueChange={(value) => onVariantChange(value as LogoVariant)}
        >
          <SelectTrigger
            aria-label="Logo variant"
            className="h-11 w-full rounded-2xl border-foreground/15 bg-background px-3 capitalize"
          >
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="start" className="rounded-2xl">
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
          onValueChange={onSizeChange}
          formatValue={(value) => `${value}px`}
        />
      </div>
    </section>
  )
}
