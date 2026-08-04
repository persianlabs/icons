import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://persianlabs-icons.vercel.app"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: `${siteUrl}/sitemap.xml`,
  }
}
