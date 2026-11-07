// Generates /favicon.svg in the client's brand colour.
import type { APIRoute } from 'astro';
import { site } from '~/config';
import { faviconSvg } from '~/lib/favicon';

export const GET: APIRoute = () =>
  new Response(faviconSvg(site.theme.colors.primary, site.theme.colors.onPrimary), {
    headers: { 'Content-Type': 'image/svg+xml' },
  });
