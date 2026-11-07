// Generates /sitemap.xml with every page in both languages (and links between translations).
import type { APIRoute } from 'astro';
import { locales, routes } from '~/i18n';

const hreflang = { pt: 'pt-PT', en: 'en' } as const;

export const GET: APIRoute = ({ site }) => {
  const url = (path: string) => new URL(path, site).href;
  const entries = Object.values(routes).flatMap((page) =>
    locales.map((lang) => {
      const links = locales
        .map((alt) => `    <xhtml:link rel="alternate" hreflang="${hreflang[alt]}" href="${url(page[alt])}"/>`)
        .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${url(page.pt)}"/>`)
        .join('\n');
      return `  <url>\n    <loc>${url(page[lang])}</loc>\n${links}\n  </url>`;
    }),
  );

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
