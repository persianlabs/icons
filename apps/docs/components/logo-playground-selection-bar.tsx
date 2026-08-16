"use client"

import { Download, X } from "lucide-react"
import { useState } from "react"

import { type LogoIconData, type LogoName, type LogoVariant } from "@persianlabs/icons/meta"
import { LogoIcon } from "@persianlabs/icons/logo-icon"
import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@workspace/ui/components/popover"
import { ScrollArea } from "@workspace/ui/components/scroll-area"

import { downloadLogos } from "./logo-download"
import { downloadFormats, type DownloadFormat } from "./logo-format"
import { toTitle } from "./logo-playground-utils"

const PREVIEW_COUNT = 3

function SelectedPreviewPopover({
  selectedNames,
  getIcon,
  previewVariant,
  onRemove,
}: {
  selectedNames: LogoName[]
  getIcon: (name: LogoName, variant: LogoVariant) => LogoIconData | undefined
  previewVariant: LogoVariant
  onRemove: (name: LogoName) => void
}) {
  const shown = selectedNames.slice(0, PREVIEW_COUNT)
  const overflow = selectedNames.length - shown.length
  return (
    <Popover>
      <PopoverTrigger
        render={
          <button
            type="button"
            className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 bg-background px-1.5 hover:border-foreground/35"
          />
        }
      >
        <span className="flex -space-x-1.5">
          {shown.map((name) => {
            const icon = getIcon(name, previewVariant)
            return (
              <span
                key={name}
                className="flex size-6 items-center justify-center rounded-full border border-background bg-muted"
              >
                {icon ? (
                  <LogoIcon
                    icon={icon}
                    width="70%"
                    height="70%"
                    className={
                      previewVariant === "mono" ? "text-foreground" : undefined
                    }
                  />
                ) : null}
              </span>
            )
          })}
        </span>
        {overflow > 0 && (
          <span className="pr-1.5 text-[11px] text-foreground/65">
            +{overflow}
          </span>
        )}
      </PopoverTrigger>
      <PopoverContent align="start" side="top" className="w-80">
        <PopoverHeader>
          <PopoverTitle>{selectedNames.length} selected</PopoverTitle>
        </PopoverHeader>
        <ScrollArea className="h-72" viewportClassName="scroll-fade">
          <div className="grid grid-cols-3 gap-2 pt-1 pr-3 sm:grid-cols-4">
          {selectedNames.map((name) => {
            const icon = getIcon(name, previewVariant)
            return (
              <div
                key={name}
                className="group relative flex flex-col items-center gap-1 rounded-lg border border-foreground/10 p-2"
              >
                <button
                  type="button"
                  onClick={() => onRemove(name)}
                  aria-label={`Remove ${toTitle(name)}`}
                  className="absolute top-1 right-1 flex size-4.5 items-center justify-center rounded-full bg-foreground text-background opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-2.5" />
                </button>
                <span className="flex size-8 items-center justify-center">
                  {icon ? (
                    <LogoIcon
                      icon={icon}
                      width="100%"
                      height="100%"
                      className={
                        previewVariant === "mono" ? "text-foreground" : undefined
                      }
                    />
                  ) : null}
                </span>
                <span className="w-full truncate text-center text-[10px] text-foreground/65">
                  {toTitle(name)}
                </span>
              </div>
            )
          })}
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}

export function LogoPlaygroundSelectionBar({
  selectedNames,
  onDeselectAll,
  onToggleSelect,
  getIcon,
  defaultVariant,
}: {
  selectedNames: LogoName[]
  onDeselectAll: () => void
  onToggleSelect: (name: LogoName) => void
  getIcon: (name: LogoName, variant: LogoVariant) => LogoIconData | undefined
  defaultVariant: LogoVariant
}) {
  const [downloadVariant, setDownloadVariant] = useState<LogoVariant>(defaultVariant)
  const [pending, setPending] = useState<DownloadFormat | null>(null)
  if (!selectedNames.length) return null

  async function handleDownload(format: DownloadFormat) {
    setPending(format)
    try {
      await downloadLogos({
        names: selectedNames,
        variant: downloadVariant,
        format,
        getIcon: (name) => getIcon(name, downloadVariant),
      })
    } finally {
      setPending(null)
    }
  }

  return (
    <div className="fixed inset-x-0 bottom-6 z-30 flex justify-center px-4">
      <div className="flex items-center gap-3 rounded-full border border-foreground/15 bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur-xl">
        <SelectedPreviewPopover
          selectedNames={selectedNames}
          getIcon={getIcon}
          previewVariant={defaultVariant}
          onRemove={onToggleSelect}
        />
        <button
          type="button"
          onClick={onDeselectAll}
          aria-label="Deselect all"
          className="flex aspect-square size-8 shrink-0 items-center justify-center gap-1.5 rounded-full border border-foreground/15 text-[11px] hover:border-foreground/35 sm:aspect-auto sm:w-auto sm:px-3"
        >
          <X className="size-3 shrink-0" /> <span className="hidden sm:inline">Deselect all</span>
        </button>
        <Popover>
          <PopoverTrigger
            render={
              <button
                type="button"
                aria-label="Download"
                className="flex aspect-square size-8 shrink-0 items-center justify-center gap-1.5 rounded-full bg-foreground text-[11px] text-background sm:aspect-auto sm:w-auto sm:px-3"
              />
            }
          >
            <Download className="size-3 shrink-0" /> <span className="hidden sm:inline">Download</span>
          </PopoverTrigger>
          <PopoverContent align="end" side="top">
            <PopoverHeader>
              <PopoverTitle>Download {selectedNames.length} logos</PopoverTitle>
            </PopoverHeader>
            <div className="flex gap-1 rounded-lg bg-muted/60 p-1">
              {(["color", "mono"] as LogoVariant[]).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setDownloadVariant(option)}
                  className={`h-7 flex-1 rounded-md text-xs capitalize transition-colors ${
                    downloadVariant === option
                      ? "bg-background text-foreground shadow-sm"
                      : "text-foreground/60 hover:text-foreground"
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {downloadFormats.map(({ key, label }) => (
                <button
                  key={key}
                  type="button"
                  disabled={pending !== null}
                  onClick={() => handleDownload(key)}
                  className="flex h-8 items-center gap-1.5 rounded-full border border-foreground/15 px-3 text-[11px] hover:border-foreground/35 disabled:opacity-50"
                >
                  {pending === key ? "…" : label}
                </button>
              ))}
            </div>
            <p className="pt-1 text-[11px] text-foreground/55">
              {selectedNames.length === 1
                ? "Downloads as a single file."
                : "Downloads as a single .zip file."}
            </p>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  )
}
