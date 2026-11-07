import type { Locale, MenuItem } from '../config/types';

const euro = new Intl.NumberFormat('pt-PT', { style: 'currency', currency: 'EUR' });

/**
 * Prices are always written the Portuguese way, in both languages,
 * to match the printed menu and the bill: 12.5 → "12,50 €".
 */
export function formatPrice(value: number): string {
  return euro.format(value);
}

const numberLocale: Record<Locale, string> = { pt: 'pt-PT', en: 'en-GB' };

/** 4.7 → "4,7" (pt) or "4.7" (en). */
export function formatRating(value: number, lang: Locale): string {
  return new Intl.NumberFormat(numberLocale[lang], { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(value);
}

/** 1250 → "1250" (pt) or "1,250" (en). */
export function formatCount(value: number, lang: Locale): string {
  return new Intl.NumberFormat(numberLocale[lang]).format(value);
}

/** Lowest price of an item (for "from 9,50 €"), or undefined if it has none. */
export function lowestPrice(item: MenuItem): number | undefined {
  if (typeof item.price === 'number') return item.price;
  if (!item.price || item.price.length === 0) return undefined;
  return Math.min(...item.price.map((p) => p.price));
}

/** Splits a text into paragraphs at empty lines. */
export function paragraphs(text: string): string[] {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}
