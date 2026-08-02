import { defineResource } from '../../../../lib/api/defineResource.js';
import Education from '../../../../lib/models/Education.js';
import { EducationSchema, EDUCATION_FIELDS } from '../../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { item } = defineResource({
  model: Education,
  schema: EducationSchema,
  allowedFields: EDUCATION_FIELDS,
  singleton: false,
  legacyKey: 'education',
});

export const { GET, PUT, DELETE } = item;
