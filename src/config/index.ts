/**
 * Chooses which client config is used for this build.
 *
 * - By default: `site.config.ts`.
 * - To use another config, set the environment variable SITE_CONFIG to its `id`,
 *   e.g. SITE_CONFIG=pastelaria-sol (in a `.env` file, in Netlify/Cloudflare
 *   settings, or with `npm run dev:sol`).
 *
 * If you keep several clients in one project, import their config here and add
 * it to the `configs` list.
 */

import defaultConfig from './site.config';
import pastelariaSol from './pastelaria-sol.config';
import type { SiteConfig } from './types';
import { validateConfig } from './validate';

export const configs: SiteConfig[] = [defaultConfig, pastelariaSol];

function pickConfig(): SiteConfig {
  const requested = process.env.SITE_CONFIG?.trim();
  if (!requested) return defaultConfig;
  const found = configs.find((config) => config.id === requested);
  if (!found) {
    throw new Error(
      `SITE_CONFIG="${requested}" does not match any config. Available: ${configs.map((c) => c.id).join(', ')}`,
    );
  }
  return found;
}

/** The active client config. Import this in components: `import { site } from '~/config'`. */
export const site: SiteConfig = pickConfig();
validateConfig(site);

export type * from './types';
