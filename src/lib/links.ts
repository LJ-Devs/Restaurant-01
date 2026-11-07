import type { Locale, SiteConfig } from '../config/types';

/** "+351 900 000 000" → "tel:+351900000000" */
export function telHref(phone: string): string {
  return `tel:${phone.replace(/[^\d+]/g, '')}`;
}

/** WhatsApp "click to chat" link, optionally with a pre-filled message. */
export function whatsappHref(number: string, message?: string): string {
  const digits = number.replace(/\D/g, '');
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
}

/** Where the "Reservar mesa" button goes: booking page, WhatsApp, or a phone call. */
export function bookingHref(site: SiteConfig, lang: Locale): string {
  if (site.booking.url) return site.booking.url;
  if (site.contact.whatsapp) return whatsappHref(site.contact.whatsapp, site.booking.message[lang]);
  return telHref(site.contact.phone);
}

/** Google Maps directions (opens the Maps app on phones). */
export function directionsHref(site: SiteConfig): string {
  return (
    site.map.directionsUrl ||
    `https://www.google.com/maps/dir/?api=1&destination=${site.geo.lat}%2C${site.geo.lng}`
  );
}

/** Address of the Google map loaded only after the visitor clicks "Mostrar mapa". */
export function mapEmbedSrc(site: SiteConfig, lang: Locale): string {
  const query = encodeURIComponent(`${site.geo.lat},${site.geo.lng}`);
  return `https://maps.google.com/maps?q=${query}&z=${site.map.zoom}&hl=${lang === 'pt' ? 'pt-PT' : 'en'}&output=embed`;
}

/**
 * Portuguese numbers starting with 2 are landlines and with 9 are mobiles.
 * Used for the call-cost note required next to phone numbers in Portugal.
 */
export function phoneKind(phone: string): 'landline' | 'mobile' | null {
  let digits = phone.replace(/\D/g, '');
  if (digits.startsWith('351') && digits.length === 12) digits = digits.slice(3);
  if (digits.length !== 9) return null;
  if (digits.startsWith('2')) return 'landline';
  if (digits.startsWith('9')) return 'mobile';
  return null;
}

/** True for links to other websites (opened in a new tab). */
export function isExternal(href: string): boolean {
  return /^https?:\/\//.test(href);
}
