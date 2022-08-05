import { createContext, ReactNode } from 'react'
import type { SanityDocument } from '@sanity/types'

export type SeoFields = {
  focus_keyword: string
  seo_title: string
  meta_description: string
  focus_synonyms: string[]
}

export type PreparedData = {
  title: string
  description: string
  locale: string
  content: string
}

export type SeoToolsContextValue<Document extends SanityDocument = SanityDocument> = {
  fetch: boolean
  contentSelector?: string
  select: (doc: Document) => Partial<SeoFields> | Promise<Partial<SeoFields>>
  resolveProductionUrl: (doc: Document) => URL | Promise<URL>
  render: (seo: Partial<SeoFields>, data: PreparedData, serpPreview: ReactNode) => ReactNode
  prepare?: (doc: Document) => PreparedData | Promise<PreparedData>
}

export const SeoToolsContext = createContext<SeoToolsContextValue>({
  fetch: true,
  select: () => ({}),
  render: (seo, data, serpPreview) => serpPreview,
  resolveProductionUrl: () => new URL('https://sanity.io'),
});

