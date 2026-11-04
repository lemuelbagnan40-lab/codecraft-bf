import { SITE_BASE, SITE_URL } from '$lib/site-config.js';

export const prerender = true;

export function GET() {
  const body = `User-agent: *\nAllow: /\n${SITE_URL ? `Sitemap: ${SITE_URL}${SITE_BASE}/sitemap.xml\n` : ''}`;
  return new Response(body, { headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'public, max-age=3600' } });
}
