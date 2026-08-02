import { z } from 'zod';
import { nanoid } from 'nanoid';
import { str, SafeHref, ImageRef, Flag } from './_shared.js';

/**
 * Content blocks.
 *
 * A custom section stores an ordered array of blocks; this file is the single
 * definition of what a block may contain. The union is discriminated on `type`
 * so a bad `type` fails fast at the API boundary instead of reaching a renderer.
 *
 * Two deliberate choices make the layer additive rather than breaking:
 *
 *  - Every field except the discriminator has a `.default()`, so a document
 *    written before a field existed still parses.
 *  - Objects strip unknown keys (Zod's default), so a document written *after*
 *    a field was removed still parses.
 *
 * `BLOCK_DESCRIPTORS` is the admin-side mirror: it drives SchemaForm so adding
 * a field means editing one object here, not a form component.
 */

/** Client-generated, stable across reorders — never the Mongo _id. */
const BlockId = z
  .string()
  .max(64)
  .default(() => nanoid());

const Columns = z.union([z.literal(2), z.literal(3), z.literal(4)]);

const Visible = Flag.default(true);

/* -------------------------------------------------------------------------- */
/* markdown                                                                    */
/* -------------------------------------------------------------------------- */

export const MarkdownBlockSchema = z.object({
  id: BlockId,
  type: z.literal('markdown'),
  visible: Visible,
  body: str(20000).default(''),
  align: z.enum(['left', 'center']).default('left'),
  maxWidth: z.number().int().min(320).max(1200).default(700),
});

/* -------------------------------------------------------------------------- */
/* cardGrid                                                                    */
/* -------------------------------------------------------------------------- */

export const CardSchema = z.object({
  id: BlockId,
  title: str(200).default(''),
  body: str(2000).default(''),
  icon: str(120).default(''),
  image: ImageRef.optional(),
  href: SafeHref.default(''),
});

export const CardGridBlockSchema = z.object({
  id: BlockId,
  type: z.literal('cardGrid'),
  visible: Visible,
  columns: Columns.default(3),
  cards: z.array(CardSchema).max(24).default([]),
});

/* -------------------------------------------------------------------------- */
/* timeline                                                                    */
/* -------------------------------------------------------------------------- */

export const TimelineItemSchema = z.object({
  id: BlockId,
  title: str(200).default(''),
  subtitle: str(200).default(''),
  range: str(120).default(''),
  body: str(2000).default(''),
  logo: ImageRef.optional(),
  href: SafeHref.default(''),
});

export const TimelineBlockSchema = z.object({
  id: BlockId,
  type: z.literal('timeline'),
  visible: Visible,
  items: z.array(TimelineItemSchema).max(40).default([]),
});

/* -------------------------------------------------------------------------- */
/* gallery                                                                     */
/* -------------------------------------------------------------------------- */

export const GalleryImageSchema = ImageRef.extend({
  id: BlockId,
  caption: str(300).default(''),
});

export const GalleryBlockSchema = z.object({
  id: BlockId,
  type: z.literal('gallery'),
  visible: Visible,
  layout: z.enum(['grid', 'carousel']).default('grid'),
  columns: Columns.default(3),
  images: z.array(GalleryImageSchema).max(40).default([]),
});

/* -------------------------------------------------------------------------- */
/* stats                                                                       */
/* -------------------------------------------------------------------------- */

export const StatItemSchema = z.object({
  id: BlockId,
  value: str(40).default(''),
  suffix: str(20).default(''),
  label: str(200).default(''),
});

export const StatsBlockSchema = z.object({
  id: BlockId,
  type: z.literal('stats'),
  visible: Visible,
  items: z.array(StatItemSchema).min(1).max(6),
});

/* -------------------------------------------------------------------------- */
/* cta                                                                         */
/* -------------------------------------------------------------------------- */

export const CtaBlockSchema = z.object({
  id: BlockId,
  type: z.literal('cta'),
  visible: Visible,
  heading: str(200).default(''),
  body: str(2000).default(''),
  buttonLabel: str(80).default(''),
  href: SafeHref.default(''),
  variant: z.enum(['outline', 'solid']).default('outline'),
});

/* -------------------------------------------------------------------------- */
/* union                                                                       */
/* -------------------------------------------------------------------------- */

export const BlockSchema = z.discriminatedUnion('type', [
  MarkdownBlockSchema,
  CardGridBlockSchema,
  TimelineBlockSchema,
  GalleryBlockSchema,
  StatsBlockSchema,
  CtaBlockSchema,
]);

export const BLOCK_SCHEMAS = {
  markdown: MarkdownBlockSchema,
  cardGrid: CardGridBlockSchema,
  timeline: TimelineBlockSchema,
  gallery: GalleryBlockSchema,
  stats: StatsBlockSchema,
  cta: CtaBlockSchema,
};

export const BLOCK_TYPES = Object.keys(BLOCK_SCHEMAS);

/* -------------------------------------------------------------------------- */
/* admin descriptors                                                           */
/* -------------------------------------------------------------------------- */

/**
 * SchemaForm descriptor format:
 *   { name, label, type, hint, required, default, options, min, max, rows, of, itemLabel }
 * `type` is one of: text, textarea, markdown, number, select, switch, tags,
 * image, repeater. `repeater` nests a descriptor array under `of`.
 */

const IMAGE_FIELD = {
  name: 'image',
  label: 'Image',
  type: 'image',
  hint: 'Optional. Uploaded to Cloudinary.',
};

export const BLOCK_DESCRIPTORS = {
  markdown: {
    label: 'Rich text',
    icon: '¶',
    description: 'A markdown body. Backticks render as green inline code.',
    fields: [
      {
        name: 'body',
        label: 'Body',
        type: 'markdown',
        rows: 14,
        required: true,
        hint: 'Markdown. Raw HTML is escaped, not executed.',
        max: 20000,
      },
      {
        name: 'align',
        label: 'Alignment',
        type: 'select',
        default: 'left',
        options: [
          { value: 'left', label: 'Left' },
          { value: 'center', label: 'Centered' },
        ],
      },
      {
        name: 'maxWidth',
        label: 'Max width (px)',
        type: 'number',
        default: 700,
        min: 320,
        max: 1200,
        hint: 'Measure of the text column.',
      },
    ],
  },

  cardGrid: {
    label: 'Card grid',
    icon: '▦',
    description: 'A responsive grid of titled cards, styled like the services section.',
    fields: [
      {
        name: 'columns',
        label: 'Columns',
        type: 'select',
        default: 3,
        options: [
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
        hint: 'Collapses to fewer columns on small screens.',
      },
      {
        name: 'cards',
        label: 'Cards',
        type: 'repeater',
        itemLabel: 'Card',
        max: 24,
        of: [
          { name: 'title', label: 'Title', type: 'text', required: true, max: 200 },
          { name: 'body', label: 'Body', type: 'textarea', rows: 4, max: 2000 },
          {
            name: 'icon',
            label: 'Icon',
            type: 'text',
            max: 120,
            hint: 'An emoji or short glyph shown above the title.',
          },
          IMAGE_FIELD,
          {
            name: 'href',
            label: 'Link',
            type: 'text',
            hint: 'Optional. Makes the whole card clickable.',
          },
        ],
      },
    ],
  },

  timeline: {
    label: 'Timeline',
    icon: '⌇',
    description: 'A vertical list of dated entries — roles, milestones, education.',
    fields: [
      {
        name: 'items',
        label: 'Entries',
        type: 'repeater',
        itemLabel: 'Entry',
        max: 40,
        of: [
          { name: 'title', label: 'Title', type: 'text', required: true, max: 200 },
          { name: 'subtitle', label: 'Subtitle', type: 'text', max: 200 },
          {
            name: 'range',
            label: 'Date range',
            type: 'text',
            max: 120,
            hint: 'Free text, e.g. "2021 — Present".',
          },
          { name: 'body', label: 'Body', type: 'textarea', rows: 4, max: 2000 },
          { ...IMAGE_FIELD, name: 'logo', label: 'Logo' },
          { name: 'href', label: 'Link', type: 'text' },
        ],
      },
    ],
  },

  gallery: {
    label: 'Gallery',
    icon: '▤',
    description: 'A grid or swipeable strip of captioned images.',
    fields: [
      {
        name: 'layout',
        label: 'Layout',
        type: 'select',
        default: 'grid',
        options: [
          { value: 'grid', label: 'Grid' },
          { value: 'carousel', label: 'Carousel' },
        ],
      },
      {
        name: 'columns',
        label: 'Columns',
        type: 'select',
        default: 3,
        options: [
          { value: 2, label: '2' },
          { value: 3, label: '3' },
          { value: 4, label: '4' },
        ],
        hint: 'Grid layout only.',
      },
      {
        name: 'images',
        label: 'Images',
        type: 'repeater',
        itemLabel: 'Image',
        max: 40,
        of: [
          { name: 'url', label: 'Image', type: 'image', required: true },
          { name: 'alt', label: 'Alt text', type: 'text', max: 300, hint: 'Required for a11y.' },
          { name: 'caption', label: 'Caption', type: 'text', max: 300 },
        ],
      },
    ],
  },

  stats: {
    label: 'Stats',
    icon: '№',
    description: 'Up to six large figures with labels.',
    fields: [
      {
        name: 'items',
        label: 'Stats',
        type: 'repeater',
        itemLabel: 'Stat',
        min: 1,
        max: 6,
        of: [
          {
            name: 'value',
            label: 'Value',
            type: 'text',
            required: true,
            max: 40,
            hint: 'e.g. "40" or "1.2k".',
          },
          { name: 'suffix', label: 'Suffix', type: 'text', max: 20, hint: 'e.g. "+" or "%".' },
          { name: 'label', label: 'Label', type: 'text', required: true, max: 200 },
        ],
      },
    ],
  },

  cta: {
    label: 'Call to action',
    icon: '➔',
    description: 'A heading, a line of copy and one button.',
    fields: [
      { name: 'heading', label: 'Heading', type: 'text', required: true, max: 200 },
      { name: 'body', label: 'Body', type: 'textarea', rows: 3, max: 2000 },
      { name: 'buttonLabel', label: 'Button label', type: 'text', max: 80 },
      { name: 'href', label: 'Button link', type: 'text' },
      {
        name: 'variant',
        label: 'Style',
        type: 'select',
        default: 'outline',
        options: [
          { value: 'outline', label: 'Outline' },
          { value: 'solid', label: 'Solid' },
        ],
      },
    ],
  },
};

/* -------------------------------------------------------------------------- */
/* factory                                                                     */
/* -------------------------------------------------------------------------- */

const EMPTY_BY_TYPE = {
  markdown: () => ({ body: '', align: 'left', maxWidth: 700 }),
  cardGrid: () => ({ columns: 3, cards: [] }),
  timeline: () => ({ items: [] }),
  gallery: () => ({ layout: 'grid', columns: 3, images: [] }),
  // `stats` requires at least one item, so seed one rather than emit an invalid block.
  stats: () => ({ items: [{ id: nanoid(), value: '', suffix: '', label: '' }] }),
  cta: () => ({ heading: '', body: '', buttonLabel: '', href: '', variant: 'outline' }),
};

/**
 * Build a valid, empty block of `type`. Returns `null` for an unknown type so
 * a stale toolbar button cannot throw in the admin.
 */
export const createBlock = type => {
  const empty = EMPTY_BY_TYPE[type];
  const schema = BLOCK_SCHEMAS[type];
  if (!empty || !schema) return null;

  const parsed = schema.safeParse({ id: nanoid(), type, visible: true, ...empty() });
  return parsed.success ? parsed.data : null;
};

/** Empty row for a repeater field, so "Add card" never produces an id-less item. */
export const createBlockItem = () => ({ id: nanoid() });
