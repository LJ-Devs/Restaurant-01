/**
 * Checks a client config when the site is built and explains problems in
 * plain English. Errors stop the build; warnings are printed but the build goes on.
 * You don't need to edit this file.
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { contrastRatio, parseHex } from '../lib/contrast';
import type { MenuItem, SiteConfig, Weekday } from './types';

const WEEKDAYS: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TIME = /^([01]\d|2[0-3]):[0-5]\d$/;
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function isLocalizedText(value: unknown): value is { pt: unknown; en: unknown } {
  return (
    typeof value === 'object' &&
    value !== null &&
    !Array.isArray(value) &&
    Object.keys(value).length === 2 &&
    'pt' in value &&
    'en' in value
  );
}

/** Walks the whole config and reports every { pt, en } text that is empty. */
function findEmptyTexts(value: unknown, path: string, out: string[]): void {
  if (isLocalizedText(value)) {
    for (const lang of ['pt', 'en'] as const) {
      const text = value[lang];
      if (typeof text !== 'string' || text.trim() === '') out.push(`${path}.${lang}`);
    }
    return;
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => findEmptyTexts(item, `${path}[${i}]`, out));
  } else if (typeof value === 'object' && value !== null) {
    for (const [key, child] of Object.entries(value)) findEmptyTexts(child, `${path}.${key}`, out);
  }
}

export function validateConfig(site: SiteConfig): void {
  const errors: string[] = [];
  const warnings: string[] = [];
  const file = `config "${site.id}"`;

  // Texts in both languages
  const empty: string[] = [];
  findEmptyTexts(site, 'config', empty);
  for (const path of empty) errors.push(`Missing text at ${path}`);

  // Basics
  if (!SLUG.test(site.id)) errors.push(`id "${site.id}" must be lowercase letters, numbers and dashes`);
  if (!/^https?:\/\/[^/]+$/.test(site.url))
    errors.push(`url "${site.url}" must look like https://www.example.pt (no slash at the end)`);
  if (!/^\d{9}$/.test(site.legal.nif.replace(/\s/g, ''))) warnings.push(`legal.nif "${site.legal.nif}" should have 9 digits`);
  if (site.contact.phone.replace(/\D/g, '').length < 9) errors.push(`contact.phone "${site.contact.phone}" looks incomplete`);
  if (site.contact.whatsapp !== undefined && site.contact.whatsapp.replace(/\D/g, '').length < 11)
    errors.push(`contact.whatsapp "${site.contact.whatsapp}" must include the country code, e.g. +351 912 345 678`);
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(site.contact.email)) errors.push(`contact.email "${site.contact.email}" is not valid`);

  // Opening hours
  for (const day of WEEKDAYS) {
    const shifts = site.hours[day];
    if (!Array.isArray(shifts)) {
      errors.push(`hours.${day} is missing (use [] for a closed day)`);
      continue;
    }
    shifts.forEach((shift, i) => {
      for (const key of ['open', 'close'] as const) {
        if (!TIME.test(shift[key])) errors.push(`hours.${day}[${i}].${key} "${shift[key]}" must be in HH:MM format, e.g. "09:30"`);
      }
      if (shift.open === shift.close) errors.push(`hours.${day}[${i}] opens and closes at the same time`);
    });
  }

  // Menu
  const categoryIds = new Set<string>();
  const items = new Map<string, MenuItem>();
  for (const category of site.menu) {
    if (!SLUG.test(category.id)) errors.push(`menu category id "${category.id}" must be lowercase letters, numbers and dashes`);
    if (categoryIds.has(category.id)) errors.push(`menu category id "${category.id}" is used twice`);
    categoryIds.add(category.id);
    if (category.items.length === 0) warnings.push(`menu category "${category.id}" has no items`);
    for (const item of category.items) {
      if (items.has(item.id)) errors.push(`menu item id "${item.id}" is used twice`);
      items.set(item.id, item);
      const prices = typeof item.price === 'number' ? [item.price] : (item.price ?? []).map((p) => p.price);
      if (item.price === undefined && !item.priceNote)
        warnings.push(`menu item "${item.id}" has no price and no priceNote`);
      for (const price of prices) {
        if (!Number.isFinite(price) || price < 0) errors.push(`menu item "${item.id}" has an invalid price (${price})`);
      }
    }
  }
  for (const id of site.featuredDishes) {
    const item = items.get(id);
    if (!item) errors.push(`featuredDishes: there is no menu item with id "${id}"`);
    else if (!item.photo) errors.push(`featuredDishes: menu item "${id}" needs a photo to be featured`);
  }
  if (site.featuredDishes.length < 4 || site.featuredDishes.length > 6)
    warnings.push(`featuredDishes has ${site.featuredDishes.length} dishes; 4 to 6 looks best`);

  // Dish of the day
  const specialPrice = site.dailySpecial?.price;
  if (specialPrice !== undefined && (!Number.isFinite(specialPrice) || specialPrice < 0))
    errors.push(`dailySpecial.price is invalid (${specialPrice})`);

  // Booking button on phones must stay short
  for (const lang of ['pt', 'en'] as const) {
    const shown = site.booking.shortLabel?.[lang] ?? site.booking.label?.[lang];
    if (shown && shown.length > 12)
      warnings.push(
        `the booking button text "${shown}" is too long for phones: add a booking.shortLabel of 12 letters or less`,
      );
  }

  // Reviews
  if (site.reviews.rating < 0 || site.reviews.rating > 5) errors.push('reviews.rating must be between 0 and 5');
  if (site.reviews.featured.length < 3 || site.reviews.featured.length > 6)
    warnings.push(`reviews.featured has ${site.reviews.featured.length} reviews; 3 to 6 looks best`);

  // Images exist?
  const folder = join(process.cwd(), 'src', 'assets', 'images', site.id);
  const photos = [
    site.images.hero.src,
    ...site.images.about.map((p) => p.src),
    site.images.share,
    ...(site.images.logo ? [site.images.logo.src] : []),
    ...[...items.values()].flatMap((item) => (item.photo ? [item.photo.src] : [])),
  ];
  if (!existsSync(folder)) {
    errors.push(`the photo folder src/assets/images/${site.id}/ does not exist (it must match the config id)`);
  } else {
    for (const photo of new Set(photos)) {
      if (!existsSync(join(folder, photo))) errors.push(`photo not found: src/assets/images/${site.id}/${photo}`);
    }
  }
  if (site.images.about.length < 2 || site.images.about.length > 3)
    warnings.push(`images.about has ${site.images.about.length} photos; use 2 or 3`);

  // Colours: valid and readable (WCAG AA = 4.5:1 for normal text)
  const c = site.theme.colors;
  for (const [key, value] of Object.entries(c)) {
    if (!parseHex(value)) errors.push(`theme.colors.${key} "${value}" must be a hex colour like "#1D4F91"`);
  }
  if (errors.length === 0) {
    const pairs: Array<[string, string, string]> = [
      ['text on background', c.text, c.background],
      ['muted text on background', c.muted, c.background],
      ['muted text on surface', c.muted, c.surface],
      ['onPrimary text on primary (buttons)', c.onPrimary, c.primary],
      ['primary (links) on background', c.primary, c.background],
      ['accent text on background', c.accent, c.background],
      ['accent text on surface', c.accent, c.surface],
      ['white text on dark', '#FFFFFF', c.dark],
    ];
    for (const [label, fg, bg] of pairs) {
      const ratio = contrastRatio(fg, bg);
      if (ratio < 4.5)
        warnings.push(`colour contrast too low for ${label}: ${ratio.toFixed(2)}:1 (needs 4.5:1). Make one of the colours darker or lighter.`);
    }
  }

  // Report (only once per build, even if this module is loaded several times)
  const flag = `__siteConfigChecked_${site.id}`;
  const g = globalThis as Record<string, unknown>;
  if (warnings.length > 0 && !g[flag]) {
    console.warn(`\n⚠️  Site config warnings (${file}):\n${warnings.map((w) => `   - ${w}`).join('\n')}\n`);
  }
  g[flag] = true;
  if (errors.length > 0) {
    throw new Error(
      `\n\n❌ Problems in the site config (${file}). Please fix them in src/config/:\n${errors
        .map((e) => `   - ${e}`)
        .join('\n')}\n`,
    );
  }
}
