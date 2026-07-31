import { defineResource } from '../../../lib/api/defineResource.js';
import Service from '../../../lib/models/Service.js';
import { ServiceSchema, SERVICE_FIELDS } from '../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { collection } = defineResource({
  model: Service,
  schema: ServiceSchema,
  allowedFields: SERVICE_FIELDS,
  sort: { order: 1 },
  singleton: false,
  legacyKey: 'services',
});

export const { GET, POST, PUT } = collection;
