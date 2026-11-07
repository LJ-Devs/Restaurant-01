/**
 * Chooses which client config is used for this build.
 *
 * - By default: `site.config.ts`.
 * - Several clients in one project (optional): add their config files here (see the
 *   `configs` list below) and set the environment variable SITE_CONFIG to the `id` of
 *   the client to build, e.g. SITE_CONFIG=cafe-central (in a `.env` file, or in the
 *   Vercel project's environment variables).
 */

import defaultConfig from './site.config';
import type { SiteConfig } from './types';
import { validateConfig } from './validate';

/**
 * Every client config in this project. To add one:
 *   import cafeCentral from './cafe-central.config';
 *   export const configs: SiteConfig[] = [defaultConfig, cafeCentral];
 */
export const configs: SiteConfig[] = [defaultConfig];

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
