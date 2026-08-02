import { z } from 'zod';
import { BlockSchema } from './blocks.js';

/**
 * Request schema for a Section row.
 *
 * Sections own layout, not content: a `builtin` row points at one of the eight
 * existing components and may not carry blocks of its own.
 */
export const SectionBase = z.object({
  key: z
    .string()
    .min(1)
    .max(60)
    .regex(/^[a-z0-9-]+$/, 'Use lowercase letters, digits and dashes only'),
  type: z.string().min(1).max(60),
  source: z.enum(['builtin', 'custom']).default('custom'),
  title: z.string().max(200).default(''),
  anchorId: z
    .string()
    .max(60)
    .regex(/^[a-z0-9-]*$/, 'Use lowercase letters, digits and dashes only')
    .default(''),
  order: z.number().int().min(0).max(10000).default(0),
  visible: z.boolean().default(true),
  status: z.enum(['draft', 'published']).default('draft'),
  navLabel: z.string().max(60).default(''),
  navVisible: z.boolean().default(false),
  numbered: z.boolean().default(false),
  content: z.object({ blocks: z.array(BlockSchema).max(50).default([]) }).default({ blocks: [] }),
});

const withRules = schema =>
  schema.superRefine((value, ctx) => {
    if (value.navVisible && !value.anchorId) {
      ctx.addIssue({
        code: 'custom',
        path: ['anchorId'],
        message: 'A section shown in the nav needs an anchor id to link to',
      });
    }

    if (value.source === 'builtin' && value.content?.blocks?.length) {
      ctx.addIssue({
        code: 'custom',
        path: ['content'],
        message: 'Built-in sections keep their content in their own collection, not in blocks',
      });
    }
  });

export const SectionSchema = withRules(SectionBase);

// .superRefine() returns a ZodEffects, which has no .partial(), so the patch
// schema is derived from the base and re-wrapped.
export const SectionPatchSchema = withRules(SectionBase.partial());

export const SECTION_FIELDS = Object.keys(SectionBase.shape);

export const ReorderSchema = z.object({
  ids: z.array(z.string().min(1)).max(200),
});
