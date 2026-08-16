import { categoryLoaders } from "./generated/categories/index.js"
import type { LogoName } from "./generated/data.js"
import type { LogoIconData } from "./types.js"

/** Lets large consumers (like a logo browser UI) load icon data per
 * category instead of importing the full dataset up front. */
export type LogoCategory = keyof typeof categoryLoaders

export const logoCategories = Object.keys(categoryLoaders) as LogoCategory[]

export type CategoryLogos = {
  colorLogos: Record<LogoName, LogoIconData>
  monoLogos: Record<LogoName, LogoIconData>
}

const cache = new Map<string, Promise<CategoryLogos>>()

export function loadCategoryLogos(category: string): Promise<CategoryLogos> {
  let promise = cache.get(category)
  if (!promise) {
    const loader = categoryLoaders[category as LogoCategory]
    if (!loader) throw new Error(`Unknown logo category: ${category}`)
    promise = loader() as Promise<CategoryLogos>
    cache.set(category, promise)
  }
  return promise
}
