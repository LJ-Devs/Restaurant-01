/**
 * Fonts you can choose in `theme.fonts` of a client config.
 *
 * The font files live in this project (`src/assets/fonts/`) and are served from
 * the site itself: visitors never contact Google Fonts or any other font service,
 * so no cookie banner is needed. Unused fonts are not published.
 *
 * All fonts here are free (SIL Open Font License, see `src/assets/fonts/licenses/`)
 * and contain every Portuguese character (ã, õ, ç, é, à…) and the € sign.
 *
 * To add a font:
 * 1. Go to https://fontsource.org, open the font, choose "Variable" if available,
 *    and download the file ending in `-latin-wght-normal.woff2`.
 * 2. Put it in `src/assets/fonts/` with a simple name (e.g. `my-font.woff2`).
 * 3. Add an entry below. `weight` is the weight range shown on Fontsource.
 */

export interface FontDefinition {
  /** File name inside `src/assets/fonts/`. */
  file: string;
  /** Weight range of the variable font, e.g. '100 900' (or '400' for a single weight). */
  weight: string;
  /** Similar system font shown while the font loads (Astro fine-tunes its size to avoid layout jumps). */
  fallback: 'serif' | 'sans-serif';
}

export const fontLibrary = {
  // Serif fonts: good for titles
  Fraunces: { file: 'fraunces.woff2', weight: '100 900', fallback: 'serif' },
  'Playfair Display': { file: 'playfair-display.woff2', weight: '400 900', fallback: 'serif' },
  Lora: { file: 'lora.woff2', weight: '400 700', fallback: 'serif' },
  // Sans-serif fonts: good for normal text
  'Source Sans 3': { file: 'source-sans-3.woff2', weight: '200 900', fallback: 'sans-serif' },
  'Nunito Sans': { file: 'nunito-sans.woff2', weight: '200 1000', fallback: 'sans-serif' },
  Figtree: { file: 'figtree.woff2', weight: '300 900', fallback: 'sans-serif' },
} as const satisfies Record<string, FontDefinition>;

export type FontName = keyof typeof fontLibrary;
