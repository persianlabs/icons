import { LogoPlayground } from "@/components/logo-playground"

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

export default function Page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LogoPlayground />
    </>
  )
}
