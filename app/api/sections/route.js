import { revalidatePath } from 'next/cache';
import dbConnect from '../../../lib/mongodb.js';
import Section from '../../../lib/models/Section.js';
import { serializeData } from '../../../lib/serialize.js';
import { SectionSchema, SECTION_FIELDS } from '../../../lib/schemas/section.js';
import { DEFAULT_LAYOUT } from '../../../lib/sections/layout.js';
import { ok, fail } from '../../../lib/api/respond.js';
import { requireAdmin } from '../../../lib/api/requireAdmin.js';
import { handleDbError } from '../../../lib/api/handleDbError.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const pick = obj =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => SECTION_FIELDS.includes(key)));

/**
 * Admin listing: every row regardless of visibility/status, so drafts and
 * hidden sections are manageable. The public read path is
 * lib/sections/registry.js, which filters to visible+published.
 */
export async function GET(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();
    const rows = await Section.find({}).sort({ order: 1 }).lean();

    // Before the seed has run the collection is empty; hand back the code
    // layout so the admin shows what the site is actually rendering.
    if (!rows.length) {
      return ok(DEFAULT_LAYOUT, { legacyKey: 'sections' });
    }

    return ok(serializeData(rows), { legacyKey: 'sections' });
  } catch (error) {
    return handleDbError(error, 'Section');
  }
}

export async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const input = SectionSchema.parse(await request.json());

    if (await Section.exists({ key: input.key })) {
      return fail(409, 'DUPLICATE', `A section with the key "${input.key}" already exists`);
    }

    // New sections go to the end rather than colliding on order 0.
    if (input.order === 0) {
      const last = await Section.findOne({}).sort({ order: -1 }).select('order').lean();
      input.order = (last?.order ?? 0) + 10;
    }

    const created = await Section.create(pick(input));

    revalidatePath('/');
    return ok(serializeData(created.toObject()), {
      status: 201,
      legacyKey: 'section',
      message: 'Section created',
    });
  } catch (error) {
    return handleDbError(error, 'Section');
  }
}
