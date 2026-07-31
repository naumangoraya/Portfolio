import { defineResource } from '../../../lib/api/defineResource.js';
import Hero from '../../../lib/models/Hero.js';
import { HeroSchema, HERO_FIELDS } from '../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Hero has two generations of field names in the wild. This preserves the
// exact mapping the hand-written PUT did (greeting->title, name->subtitle,
// tagline->description, description->longDescription) so existing admin forms
// keep working, and drops the aliases so they are not also written raw.
const heroTransformIn = body => {
  if (!body || typeof body !== 'object') return body;
  const { greeting, name, tagline, description, longDescription, ...rest } = body;
  const out = { ...rest };
  if (greeting !== undefined) out.title = greeting;
  if (name !== undefined) out.subtitle = name;
  if (tagline !== undefined) out.description = tagline;
  if (description !== undefined) out.longDescription = description;
  if (longDescription !== undefined) out.longDescription = longDescription;
  return out;
};

const { collection } = defineResource({
  model: Hero,
  schema: HeroSchema,
  allowedFields: HERO_FIELDS,
  sort: { order: 1 },
  singleton: true,
  legacyKey: 'hero',
  transformIn: heroTransformIn,
});

export const { GET, POST, PUT } = collection;
