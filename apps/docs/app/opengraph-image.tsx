import { ImageResponse } from "next/og"
import { readFile } from "node:fs/promises"
import { join } from "node:path"

export const alt = "Persian Icons — Iranian brand icons for React and Vue"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

const logoFiles = [
  "banks/color/ansar.svg",
  "banks/color/mellat.svg",
  "payment-gateways/color/zarrinpal.svg",
  "payment-gateways/color/nextpay.svg",
  "social-media/color/rubika.svg",
  "social-media/color/bale.svg",
  "vod/color/aparat.svg",
  "vod/color/filimo.svg",
  "automobiles/color/iran-khodro.svg",
  "automobiles/color/saipa.svg",
  "tv/color/shabake-3.svg",
  "website-applications/color/digikala.svg",
  "website-applications/color/snap.svg",
  "app-store/color/myket.svg",
  "food-drink/color/zamzam.svg",
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
        position: "relative",
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
          Persian Icons
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          top: 68,
          right: 76,
          width: 342,
          height: 494,
          display: "flex",
          flexWrap: "wrap",
          alignContent: "space-between",
          justifyContent: "space-between",
        }}
      >
        {logoSources.map((src, index) => (
          <div
            key={logoFiles[index]}
            style={{
              width: 90,
              height: 90,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={src}
              width={64}
              height={64}
              style={{ objectFit: "contain" }}
            />
          </div>
        ))}
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
      </div>
    </div>,
    size
  )
}
