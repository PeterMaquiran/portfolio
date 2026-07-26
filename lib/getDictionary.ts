import { headers } from 'next/headers'
import en from '../locales/en.json'
import pt from '../locales/pt.json'

export type Dictionary = typeof en
export type Locale = 'en' | 'pt'

const dictionaries: Record<Locale, Dictionary> = {
  en,
  pt: pt as Dictionary,
}

function resolveLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return 'en'

  const preferred = acceptLanguage
    .split(',')
    .map((part) => {
      const [tag, q = 'q=1'] = part.trim().split(';')
      const lang = tag.split('-')[0]?.toLowerCase() ?? ''
      const quality = Number(q.replace(/q=/i, '')) || 0
      return { lang, quality }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { lang } of preferred) {
    if (lang === 'pt') return 'pt'
    if (lang === 'en') return 'en'
  }

  return 'en'
}

/** Server-side dictionary from the request Accept-Language header. */
export async function getDictionary(): Promise<Dictionary> {
  const headerStore = await headers()
  const locale = resolveLocale(headerStore.get('accept-language'))
  return dictionaries[locale]
}

/** Client-side fallback when browser language is available. */
export function getDictionaryByBrowser(): Dictionary {
  if (typeof window !== 'undefined') {
    const lang = navigator.language?.split('-')[0] || 'en'
    if (lang.startsWith('pt')) return dictionaries.pt
    return dictionaries.en
  }
  return dictionaries.en
}
