import { defineResource } from '../../../../lib/api/defineResource.js';
import Job from '../../../../lib/models/Job.js';
import { JobSchema, JOB_FIELDS } from '../../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { item } = defineResource({
  model: Job,
  schema: JobSchema,
  allowedFields: JOB_FIELDS,
  singleton: false,
  legacyKey: 'jobs',
});

export const { GET, PUT, DELETE } = item;
