import { revalidatePath } from 'next/cache';
import dbConnect from '../../../../lib/mongodb.js';
import Section from '../../../../lib/models/Section.js';
import { ReorderSchema } from '../../../../lib/schemas/section.js';
import { ok } from '../../../../lib/api/respond.js';
import { requireAdmin } from '../../../../lib/api/requireAdmin.js';
import { handleDbError } from '../../../../lib/api/handleDbError.js';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

/**
 * Persist a drag-reorder in one round trip rather than N writes.
 *
 * Accepts either `{ ids: [...] }` or `{ order: [{ _id, order }] }` so it
 * matches whichever shape the client sends.
 */
async function reorder(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const body = await request.json();
    const ids = Array.isArray(body?.ids)
      ? body.ids
      : Array.isArray(body?.order)
        ? body.order.map(entry => entry?._id ?? entry?.id).filter(Boolean)
        : [];

    const { ids: validIds } = ReorderSchema.parse({ ids });

    if (!validIds.length) return ok({ count: 0 });

    await Section.bulkWrite(
      validIds.map((id, index) => ({
        updateOne: { filter: { _id: id }, update: { $set: { order: (index + 1) * 10 } } },
      }))
    );

    revalidatePath('/');
    return ok({ count: validIds.length }, { message: 'Order saved' });
  } catch (error) {
    return handleDbError(error, 'Section.reorder');
  }
}

export const PUT = reorder;
export const POST = reorder;
