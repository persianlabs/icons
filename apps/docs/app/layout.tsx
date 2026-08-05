import type { Metadata, Viewport } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"

import "@workspace/ui/globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { cn } from "@workspace/ui/lib/utils"

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://icons.persian-labs.ir"

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: "Persian Labs | Icons", template: "%s · Persian Icons" },
  description:
    "A growing open-source collection of Iranian brand logos for React and Vue.",
  applicationName: "Persian Icons",
  keywords: ["Iranian brand logos", "React icons", "Vue icons", "SVG logos"],
  authors: [
    { name: "Persian Labs", url: "https://github.com/persianlabs" },
    { name: "zegond", url: "https://github.com/zegond/logos-per-banks" },
  ],
  creator: "Persian Labs",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Persian Icons",
    title: "Persian Icons — Iranian brand icons",
    description: "A growing open-source Iranian logo set for React and Vue.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Persian Icons — Iranian brand icons",
    description: "A growing open-source Iranian logo set for React and Vue.",
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
}

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#141414",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      dir="ltr"
      className={cn(
        "dark antialiased",
        fontMono.variable,
        "font-sans",
        geist.variable
      )}
    >
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
        >
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
