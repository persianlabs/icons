import * as React from "react"
import { VirtuosoGrid } from "react-virtuoso"

import { cn } from "@workspace/ui/lib/utils"
import { type LogoVariant, type LogoName } from "@persian-labs/icons"
import { LogoIcon } from "@persian-labs/icons/react"
import { colorLogos, monoLogos } from "@persian-labs/icons"

import { toTitle } from "./logo-playground-utils"

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
    className={cn("min-w-0 w-full", className)}
    {...props}
  />
))
GridItem.displayName = "GridItem"

type LogoMap = typeof colorLogos | typeof monoLogos

export function LogoPlaygroundGrid({
  logos,
  visibleIcons,
  query,
  variant,
  size,
  onSelect,
}: {
  logos: LogoMap
  visibleIcons: LogoName[]
  query: string
  variant: LogoVariant
  size: number
  onSelect: (name: LogoName) => void
}) {
  return (
    <section className="mx-auto max-w-370 px-5 py-8 lg:px-8 lg:py-12">
      {visibleIcons.length ? (
        <VirtuosoGrid
          useWindowScroll
          totalCount={visibleIcons.length}
          components={{ List: GridList, Item: GridItem }}
          itemContent={(index) => {
            const name = visibleIcons[index]
            if (!name) return null
            return (
              <button
                type="button"
                onClick={() => onSelect(name)}
                className="group relative flex min-h-56 w-full flex-col border-r border-b border-foreground/10 bg-background p-5 text-left transition-colors hover:bg-muted/45 focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-foreground"
              >
                <span className="flex flex-1 items-center justify-center">
                  <span
                    className="flex items-center justify-center transition-[width,height] duration-300 ease-out motion-reduce:transition-none"
                    style={{ width: size, height: size }}
                  >
                    <LogoIcon
                      icon={logos[name]}
                      width="100%"
                      height="100%"
                      title={`${toTitle(name)} logo`}
                      className={variant === "mono" ? "text-foreground" : undefined}
                    />
                  </span>
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
            )
          }}
        />
      ) : (
        <div className="grid min-h-80 place-items-center border border-foreground/10 text-sm text-foreground/40">
          No logos match “{query}”.
        </div>
      )}
    </section>
  )
}
