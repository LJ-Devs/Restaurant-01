/**
 * Structured data (JSON-LD) for Google: tells search engines the business
 * name, address, opening hours, menu, etc. Generated from the client config.
 *
 * Note: reviews and ratings are deliberately NOT included. Google ignores
 * (and may penalise) reviews that a business publishes about itself.
 */

import type { Locale, SiteConfig } from '../config/types';
import { routes } from '../i18n';
import { directionsHref } from './links';
import { WEEKDAYS } from './hours';

const schemaDays = {
  monday: 'Monday',
  tuesday: 'Tuesday',
  wednesday: 'Wednesday',
  thursday: 'Thursday',
  friday: 'Friday',
  saturday: 'Saturday',
  sunday: 'Sunday',
} as const;

function openingHours(site: SiteConfig) {
  // Group days that share exactly the same period: { "12:00-15:00": ["Tuesday", ...] }
  const groups = new Map<string, string[]>();
  for (const day of WEEKDAYS) {
    for (const shift of site.hours[day]) {
      const key = `${shift.open}-${shift.close}`;
      groups.set(key, [...(groups.get(key) ?? []), schemaDays[day]]);
    }
  }
  return [...groups.entries()].map(([key, days]) => {
    const [opens, closes] = key.split('-');
    return { '@type': 'OpeningHoursSpecification', dayOfWeek: days, opens, closes };
  });
}

export function businessJsonLd(site: SiteConfig, lang: Locale, siteUrl: URL, imageUrls: string[]) {
  const sameAs = [site.social.instagram, site.social.facebook, site.social.tripadvisor].filter(
    (url): url is string => Boolean(url) && !/^https?:\/\/(www\.)?(instagram|facebook)\.com\/?$/.test(url ?? ''),
  );
  return {
    '@context': 'https://schema.org',
    '@type': site.businessType,
    '@id': new URL('/#business', siteUrl).href,
    name: site.name,
    description: site.seo.description[lang],
    url: new URL(routes.home[lang], siteUrl).href,
    image: imageUrls,
    telephone: site.contact.phone.replace(/[^\d+]/g, ''),
    email: site.contact.email,
    priceRange: site.priceRange,
    servesCuisine: site.cuisine[lang],
    hasMenu: new URL(routes.menu[lang], siteUrl).href,
    ...(site.businessType === 'Restaurant' && !site.booking.url ? { acceptsReservations: true } : {}),
    ...(site.booking.url ? { acceptsReservations: site.booking.url } : {}),
    address: {
      '@type': 'PostalAddress',
      streetAddress: site.address.street,
      postalCode: site.address.postalCode,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      addressCountry: site.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: site.geo.lat,
      longitude: site.geo.lng,
    },
    hasMap: directionsHref(site),
    openingHoursSpecification: openingHours(site),
    ...(sameAs.length > 0 ? { sameAs } : {}),
  };
}
