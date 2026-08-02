import { defineResource } from '../../../lib/api/defineResource.js';
import Project from '../../../lib/models/Project.js';
import { ProjectSchema, PROJECT_FIELDS } from '../../../lib/schemas/content.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const { collection } = defineResource({
  model: Project,
  schema: ProjectSchema,
  allowedFields: PROJECT_FIELDS,
  sort: { order: 1, createdAt: -1 },
  singleton: false,
  legacyKey: 'projects',
});

export const { GET, POST, PUT } = collection;
