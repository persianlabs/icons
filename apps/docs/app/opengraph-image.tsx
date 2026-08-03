import { ImageResponse } from "next/og"

export const alt =
  "Persian Logos — Iranian brand icons for React, Vue, and Iconify"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

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
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 21,
          color: "#999",
        }}
      >
        <span>A growing open-source brand collection</span>
        <span>persian-labs.ir · React · Vue · Iconify</span>
      </div>
    </div>,
    size
  )
}
