import { SITE_URL } from './layout';

export const revalidate = 3600;

// Only the routes that actually exist. Archive entries are rendered inline on
// /archive; there is no /archive/[slug] page, so listing per-entry URLs here
// would advertise 404s. Add them here if that page is ever built.
export default function sitemap() {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/archive`, changeFrequency: 'weekly', priority: 0.8 },
  ];
}
