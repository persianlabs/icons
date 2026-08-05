import { LogoPlayground } from "@/components/logo-playground"

async function getStarCount(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.github.com/repos/persianlabs/icons",
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 3600 },
      }
    )
    if (!response.ok) return null
    const data = (await response.json()) as { stargazers_count?: number }
    return typeof data.stargazers_count === "number"
      ? data.stargazers_count
      : null
  } catch {
    return null
  }
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  name: "Persian Icons",
  description: "A growing collection of Iranian brand logos for React and Vue.",
  programmingLanguage: ["TypeScript", "React", "Vue"],
  license: "https://opensource.org/license/mit",
  codeRepository: "https://github.com/persianlabs/icons",
  url: "https://icons.persian-labs.ir",
  isBasedOn: "https://github.com/zegond/logos-per-banks",
}

export default async function Page() {
  const starCount = await getStarCount()
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LogoPlayground starCount={starCount} />
    </>
  )
}
