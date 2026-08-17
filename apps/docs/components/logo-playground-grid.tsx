import * as React from "react"
import { VirtuosoGrid } from "react-virtuoso"

import { cn } from "@workspace/ui/lib/utils"
import { Checkbox } from "@workspace/ui/components/checkbox"
import {
  type LogoVariant,
  type LogoName,
  type LogoIconData,
} from "@persianlabs/icons/meta"
import { LogoIcon } from "@persianlabs/icons/logo-icon"

import { getCategory, getCategoryLabel, toTitle } from "./logo-playground-utils"

const GridList = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={style}
    className={cn(
      "grid grid-cols-2 border-t border-l border-foreground/10 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
      className
    )}
    {...props}
  />
))
GridList.displayName = "GridList"

const GridItem = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, style, ...props }, ref) => (
  <div
    ref={ref}
    style={style}
    className={cn("w-full min-w-0", className)}
    {...props}
  />
))
GridItem.displayName = "GridItem"

type LogoMap = Partial<Record<LogoName, LogoIconData>>

export function LogoPlaygroundGrid({
  logos,
  visibleIcons,
  query,
  variant,
  size,
  onSelect,
  hasMore,
  onLoadMore,
  totalCount,
  onShowAll,
  selectedNames,
  onToggleSelect,
}: {
  logos: LogoMap
  visibleIcons: LogoName[]
  query: string
  variant: LogoVariant
  size: number
  onSelect: (name: LogoName) => void
  hasMore: boolean
  onLoadMore: () => void
  totalCount: number
  onShowAll: () => void
  selectedNames: ReadonlySet<LogoName>
  onToggleSelect: (name: LogoName) => void
}) {
  const selectionMode = selectedNames.size > 0
  return (
    <section className="px-5 py-8 lg:py-12">
      {visibleIcons.length ? (
        <>
          <VirtuosoGrid
            useWindowScroll
            totalCount={visibleIcons.length}
            components={{ List: GridList, Item: GridItem }}
            itemContent={(index) => {
              const name = visibleIcons[index]
              if (!name) return null
              const icon = logos[name]
              const checked = selectedNames.has(name)
              return (
                <button
                  type="button"
                  disabled={!icon}
                  onClick={() =>
                    selectionMode ? onToggleSelect(name) : onSelect(name)
                  }
                  className={cn(
                    "group relative isolate flex min-h-56 w-full flex-col border-r border-b border-foreground/10 bg-background p-5 text-left transition-colors hover:bg-muted/45 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-foreground",
                    checked && "bg-muted/45 ring-2 ring-primary ring-inset"
                  )}
                >
                  <span
                    onClick={(event) => event.stopPropagation()}
                    onPointerDown={(event) => event.stopPropagation()}
                    className={cn(
                      "absolute top-3 left-3 z-10 transition-opacity",
                      selectionMode
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 has-[:focus-visible]:opacity-100"
                    )}
                  >
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => onToggleSelect(name)}
                      aria-label={`Select ${toTitle(name)}`}
                    />
                  </span>
                  <span className="flex flex-1 items-center justify-center">
                    <span
                      className="flex items-center justify-center transition-[width,height] duration-300 ease-out motion-reduce:transition-none"
                      style={{ width: size, height: size }}
                    >
                      {icon ? (
                        <LogoIcon
                          icon={icon}
                          width="100%"
                          height="100%"
                          title={`${toTitle(name)} logo`}
                          className={
                            variant === "mono" ? "text-foreground" : undefined
                          }
                        />
                      ) : (
                        <span
                          className="block animate-pulse rounded-full bg-muted"
                          style={{ width: size, height: size }}
                        />
                      )}
                    </span>
                  </span>
                  <span>
                    <span className="block truncate text-sm font-medium">
                      {toTitle(name)}
                    </span>
                    <span className="mt-1 block font-mono text-[10px] text-foreground/55">
                      {getCategoryLabel(getCategory(name)).toUpperCase()} · OPEN
                    </span>
                  </span>
                </button>
              )
            }}
          />
          {hasMore && (
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <button
                type="button"
                onClick={onLoadMore}
                className="h-11 rounded-full border border-foreground/15 bg-background px-6 text-sm font-medium hover:border-foreground/35"
              >
                Load more
              </button>
              <button
                type="button"
                onClick={onShowAll}
                className="h-11 rounded-full border border-foreground/15 bg-background px-6 text-sm font-medium text-foreground/65 hover:border-foreground/35 hover:text-foreground"
              >
                Load all (+{totalCount - visibleIcons.length})
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="grid min-h-80 place-items-center border border-foreground/10 text-sm text-foreground/60">
          No logos match “{query}”.
        </div>
      )}
    </section>
  )
}
