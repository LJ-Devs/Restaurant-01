import type { Locale, LocalizedText } from '../config/types';
import { en } from './en';
import { pt, type UIStrings } from './pt';

export const locales: Locale[] = ['pt', 'en'];
export const defaultLocale: Locale = 'pt';

const ui: Record<Locale, UIStrings> = { pt, en };

/** Interface strings for a language: `const t = useTranslations(lang); t.cta.book`. */
export function useTranslations(lang: Locale): UIStrings {
  return ui[lang];
}

/** Picks the right language from a `{ pt, en }` config text. */
export function localize(text: LocalizedText, lang: Locale): string {
  return text[lang];
}

/** Fills {placeholders}: fill('fecha às {time}', { time: '15:00' }) → 'fecha às 15:00'. */
export function fill(template: string, values: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
}

export function otherLocale(lang: Locale): Locale {
  return lang === 'pt' ? 'en' : 'pt';
}

/**
 * Every page and its address in each language. The language switcher uses this
 * to send visitors to the same page in the other language.
 */
export const routes = {
  home: { pt: '/', en: '/en/' },
  menu: { pt: '/menu/', en: '/en/menu/' },
  privacy: { pt: '/privacidade/', en: '/en/privacy/' },
} as const satisfies Record<string, Record<Locale, string>>;

export type PageKey = keyof typeof routes;
