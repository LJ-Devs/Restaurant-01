import { defineMiddleware } from 'astro:middleware';

/**
 * Development only (`npm run dev`): optimised photos keep the same address when you
 * replace a file with another one of the same name, and Astro tells the browser to keep
 * them for a year. That would show the OLD photo. So, while developing, ask the browser
 * to check for a newer version every time. The published site is not affected
 * (there, every version of a photo gets its own file name).
 */
export const onRequest = defineMiddleware(async (context, next) => {
  const response = await next();
  if (!import.meta.env.DEV || context.url.pathname !== '/_image') return response;

  const headers = new Headers(response.headers);
  headers.set('Cache-Control', 'no-cache');
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
});
