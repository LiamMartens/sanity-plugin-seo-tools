import { LangCultureMap } from '../constants'
import type { PreparedData } from '../context'

type Options = {
  contentSelector?: string
}

export async function prepareRemoteData(
  url: URL,
  options: Options
): Promise<PreparedData> {
  const contentSelector = options.contentSelector ?? 'body'
  const result = await fetch(url.toString())
  const html = await result.text()
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  // remove all script tags
  Array.from(doc.body.querySelectorAll('script')).forEach((script) => {
    script.remove();
  });

  // find the language and culture
  // if only lang is specified - we will map it to a lang culture combination
  let langCulture = doc.documentElement.lang ?? LangCultureMap.en
  if (!langCulture.includes('-')) {
    langCulture = (
      LangCultureMap?.[langCulture.toLowerCase() as keyof typeof LangCultureMap]
      ?? LangCultureMap.en
    )
  }

  // find the title, description and content
  const title = doc.title || doc.querySelector('h1')?.textContent || doc.querySelector('h2')?.textContent || ''
  const description = doc.querySelector<HTMLMetaElement>('meta[name="description"]')?.content || ''
  const content = doc.querySelector(contentSelector)?.innerHTML || ''

  return {
    locale: langCulture,
    title,
    description,
    content,
  }
}