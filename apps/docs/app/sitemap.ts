import type { MetadataRoute } from "next"

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://persianlabs-icons.vercel.app"

export default function sitemap(): MetadataRoute.Sitemap {
  return [{ url: siteUrl, changeFrequency: "weekly", priority: 1 }]
}
