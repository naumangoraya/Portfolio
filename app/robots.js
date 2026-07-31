import { SITE_URL } from './layout';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // The admin panel is client-gated only; keep it out of the index.
        disallow: ['/admin', '/api/'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
