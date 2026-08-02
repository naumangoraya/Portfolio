import { revalidatePath } from 'next/cache';
import dbConnect from '../../../../lib/mongodb.js';
import Section from '../../../../lib/models/Section.js';
import { serializeData } from '../../../../lib/serialize.js';
import { SectionPatchSchema, SECTION_FIELDS } from '../../../../lib/schemas/section.js';
import { ok, fail } from '../../../../lib/api/respond.js';
import { requireAdmin } from '../../../../lib/api/requireAdmin.js';
import { handleDbError } from '../../../../lib/api/handleDbError.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const pick = obj =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => SECTION_FIELDS.includes(key)));

export async function GET(request, context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await dbConnect();

    const section = await Section.findById(id).lean();
    if (!section) return fail(404, 'NOT_FOUND', 'Section not found');

    return ok(serializeData(section), { legacyKey: 'section' });
  } catch (error) {
    return handleDbError(error, 'Section');
  }
}

export async function PUT(request, context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await dbConnect();

    const input = SectionPatchSchema.parse(await request.json());
    const update = pick(input);

    // `key` and `source` identify the row and decide how it renders; changing
    // either would silently repoint a section at a different component.
    delete update.key;
    delete update.source;

    const section = await Section.findByIdAndUpdate(
      id,
      { $set: update },
      { returnDocument: 'after', runValidators: true }
    ).lean();

    if (!section) return fail(404, 'NOT_FOUND', 'Section not found');

    revalidatePath('/');
    return ok(serializeData(section), { legacyKey: 'section', message: 'Section updated' });
  } catch (error) {
    return handleDbError(error, 'Section');
  }
}

export async function DELETE(request, context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    const { id } = await context.params;
    await dbConnect();

    const section = await Section.findById(id);
    if (!section) return fail(404, 'NOT_FOUND', 'Section not found');

    // Built-ins wrap real content in another collection. Deleting the row would
    // only hide the section while orphaning the layout entry, so hide it
    // explicitly instead and keep the row editable.
    if (section.source === 'builtin') {
      section.visible = false;
      await section.save();
      revalidatePath('/');
      return ok(serializeData(section.toObject()), {
        legacyKey: 'section',
        message: 'Built-in section hidden (its content was kept)',
      });
    }

    await section.deleteOne();

    revalidatePath('/');
    return ok({ _id: id }, { legacyKey: 'section', message: 'Section deleted' });
  } catch (error) {
    return handleDbError(error, 'Section');
  }
}
