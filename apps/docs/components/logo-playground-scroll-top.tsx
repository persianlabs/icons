"use client"

import { ChevronUp } from "lucide-react"
import { useEffect, useState } from "react"

import { cn } from "@workspace/ui/lib/utils"

export function LogoPlaygroundScrollTop() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 480)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <button
      type="button"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      tabIndex={visible ? 0 : -1}
      className={cn(
        "fixed right-5 bottom-5 z-30 grid size-11 place-items-center rounded-full border border-foreground/15 bg-background/90 text-foreground/60 shadow-lg backdrop-blur-xl transition-all duration-200 hover:border-foreground/35 hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground lg:right-8 lg:bottom-8",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      )}
    >
      <ChevronUp className="size-5" />
    </button>
  )
}
