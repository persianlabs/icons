import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "Persian Logos — Iranian brand icons for React and Vue"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const logoFiles = [
  "banks/color/blubank.svg",
  "banks/color/ansar.svg",
  "payment-gateways/color/zibal.svg",
] as const

// Read the source artwork once so the OG route stays static and self-contained.
const logoSources = await Promise.all(
  logoFiles.map(async (file) => {
    const source = await readFile(
      join(process.cwd(), "../../packages/icons/assets", file),
      "base64"
    )
    return `data:image/svg+xml;base64,${source}`
  })
)

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#141414",
        color: "#f4f4f0",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "68px 76px",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 25,
            fontWeight: 600,
          }}
        >
          <svg width="50" height="50" viewBox="0 0 1024 1024" fill="none">
            <path
              d="M210 842V330C210 286 226 251 258 219L382 95V842H210Z"
              fill="#fff"
            />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M382 95H608C754 95 848 187 848 326C848 465 754 557 608 557H382V405H594C661 405 696 375 696 326C696 277 661 247 594 247H382V95Z"
              fill="#fff"
            />
          </svg>
          Persian Logos
        </div>
        <div style={{ display: "flex", fontSize: 19, color: "#888" }}>
          github.com/persian-labs/icons
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 64,
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              lineHeight: 0.95,
              letterSpacing: "-6px",
              fontWeight: 650,
            }}
          >
            Iranian logos,
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 88,
              lineHeight: 0.95,
              letterSpacing: "-6px",
              fontWeight: 650,
              color: "#777",
            }}
          >
            ready to ship.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 20,
            paddingRight: 4,
          }}
        >
          {logoSources.map((src, index) => (
            <div
              key={logoFiles[index]}
              style={{
                width: 62,
                height: 62,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <img
                src={src}
                width={56}
                height={56}
                style={{ objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 21,
          color: "#999",
        }}
      >
        <span>A growing open-source brand collection</span>
        <span>persianlabs-icons.vercel.app · React · Vue</span>
      </div>
    </div>,
    size
  )
}
