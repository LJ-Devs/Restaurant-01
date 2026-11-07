// Generates /apple-touch-icon.png (icon used when the site is added to a phone's home screen).
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import { site } from '~/config';
import { faviconSvg } from '~/lib/favicon';

export const GET: APIRoute = async () => {
  const svg = faviconSvg(site.theme.colors.primary, site.theme.colors.onPrimary).replace('rx="14"', 'rx="0"');
  const png = await sharp(Buffer.from(svg)).resize(180, 180).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
