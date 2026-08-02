import { defineResource } from '../../../lib/api/defineResource.js';
import About from '../../../lib/models/About.js';
import { AboutSchema, ABOUT_FIELDS } from '../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { collection } = defineResource({
  model: About,
  schema: AboutSchema,
  allowedFields: ABOUT_FIELDS,
  sort: { order: 1 },
  singleton: true,
  legacyKey: 'about',
});

export const { GET, POST, PUT } = collection;
