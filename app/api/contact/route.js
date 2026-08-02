import { defineResource } from '../../../lib/api/defineResource.js';
import Contact from '../../../lib/models/Contact.js';
import { ContactSchema, CONTACT_FIELDS } from '../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { collection } = defineResource({
  model: Contact,
  schema: ContactSchema,
  allowedFields: CONTACT_FIELDS,
  sort: { order: 1 },
  singleton: true,
  legacyKey: 'contact',
});

export const { GET, POST, PUT } = collection;
