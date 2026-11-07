// Astro settings. You normally don't need to change this file:
// client content and design live in src/config/.
import { fileURLToPath } from 'node:url';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// 1. Read a local `.env` file if there is one (e.g. `SITE_CONFIG=cafe-central`).
try {
  process.loadEnvFile();
} catch {
  // No .env file: that's fine.
}

// 2. Load the active client config (chosen with SITE_CONFIG, default: site.config.ts).
const { site } = await import('./src/config/index.ts');
const { fontLibrary } = await import('./src/config/fonts.ts');
type FontName = keyof typeof fontLibrary;

/**
 * The public address of the site, used for links in Google and social media.
 * 1. SITE_URL environment variable, if set.
 * 2. `url` in the config, once it is a real address.
 * 3. While `url` is still an example.com placeholder (like the demos): the project's
 *    own address on Vercel (e.g. https://tasca-do-largo.vercel.app).
 */
function publicUrl(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL;
  const isPlaceholder = new URL(site.url).hostname.endsWith('example.com');
  if (isPlaceholder && process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return site.url;
}

/** Self-hosted font from src/assets/fonts/ (no request to Google Fonts). */
function font(name: FontName, cssVariable: string) {
  const definition = fontLibrary[name];
  const variant = {
    src: [`./src/assets/fonts/${definition.file}`] as [string],
    weight: definition.weight,
    style: 'normal' as const,
    display: 'swap' as const,
  };
  return {
    provider: fontProviders.local(),
    name,
    cssVariable,
    fallbacks: [definition.fallback],
    options: { variants: [variant] as [typeof variant] },
  };
}

export default defineConfig({
  site: publicUrl(),
  // Keep the normal HTML whitespace rules (Astro 7's default 'jsx' mode removes spaces between inline tags).
  compressHTML: true,
  build: {
    // Put the (small) CSS directly in each page: no render-blocking CSS request.
    inlineStylesheets: 'always',
  },
  fonts: [font(site.theme.fonts.heading, '--font-heading'), font(site.theme.fonts.body, '--font-body')],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      // Photos of the active client only (src/assets/images/<id>/), so other clients' photos are never published.
      alias: {
        '@client-images': fileURLToPath(new URL(`./src/assets/images/${site.id}`, import.meta.url)),
      },
    },
  },
  devToolbar: {
    enabled: false,
  },
});
