import { revalidatePath } from 'next/cache';
import dbConnect from '../../../lib/mongodb.js';
import Archive from '../../../lib/models/Archive.js';
import { serializeData } from '../../../lib/serialize.js';
import { ArchiveSchema, ARCHIVE_FIELDS } from '../../../lib/schemas/content.js';
import { ok, fail } from '../../../lib/api/respond.js';
import { requireAdmin } from '../../../lib/api/requireAdmin.js';
import { handleDbError } from '../../../lib/api/handleDbError.js';

// This route is keyed by `slug` rather than `_id`, so it stays hand-written
// instead of using defineResource.
//
// It was also the only base route missing `force-dynamic` while exporting a
// GET with no `request` argument, i.e. exactly the shape Next 14 evaluates once
// at build and caches forever — and its mutations never called revalidatePath,
// so nothing would have busted that cache.
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

const REVALIDATE = ['/', '/archive'];
const bump = () => REVALIDATE.forEach(path => revalidatePath(path));

const slugify = title =>
  String(title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const pick = obj =>
  Object.fromEntries(Object.entries(obj).filter(([key]) => ARCHIVE_FIELDS.includes(key)));

export async function GET() {
  try {
    await dbConnect();

    // Sorts on `date`, not `publishDate`: no write path ever sets publishDate,
    // so the old secondary sort was inert and disagreed with /archive's own
    // query, meaning the page and the API could return different orderings.
    const archive = await Archive.find({ isActive: true, status: 'Published' })
      .sort({ order: 1, date: -1 })
      .lean();

    // NOTE: the legacy key really is `projects`, not `archive`. Preserved so
    // ArchivePageClient keeps working; renamed when the client moves to `data`.
    return ok(serializeData(archive) ?? [], { legacyKey: 'projects' });
  } catch (error) {
    return handleDbError(error, 'Archive');
  }
}

export async function POST(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const body = await request.json();
    const input = ArchiveSchema.parse(body);

    // `.toLowerCase()` on a missing title used to throw a TypeError -> 500.
    if (!input.title) {
      return fail(400, 'VALIDATION', 'Title is required');
    }

    const slug = input.slug || slugify(input.title);

    if (await Archive.exists({ slug })) {
      return fail(409, 'DUPLICATE', 'A project with this title already exists');
    }

    const archive = await Archive.create({
      ...pick(input),
      slug,
      isActive: true,
      order: input.order ?? 1,
      status: input.status || 'Published',
      featured: input.featured ?? false,
    });

    bump();
    return ok(serializeData(archive.toObject()), {
      status: 201,
      legacyKey: 'archive',
      message: 'Archive record created successfully',
    });
  } catch (error) {
    return handleDbError(error, 'Archive');
  }
}

export async function PUT(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const body = await request.json();
    const { slug } = body;

    if (!slug || typeof slug !== 'string') {
      return fail(400, 'VALIDATION', 'Archive slug is required');
    }

    const input = ArchiveSchema.parse(body);
    // The slug identifies the record; it is not itself updatable here.
    const fields = pick(input);
    delete fields.slug;

    const archive = await Archive.findOneAndUpdate(
      { slug },
      { $set: fields },
      { new: true, runValidators: true }
    ).lean();

    if (!archive) return fail(404, 'NOT_FOUND', 'Archive record not found');

    bump();
    return ok(serializeData(archive), {
      legacyKey: 'archive',
      message: 'Archive record updated successfully',
    });
  } catch (error) {
    return handleDbError(error, 'Archive');
  }
}

export async function DELETE(request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  try {
    await dbConnect();

    const slug = new URL(request.url).searchParams.get('slug');

    if (!slug) return fail(400, 'VALIDATION', 'Archive slug is required');

    const archive = await Archive.findOneAndDelete({ slug });

    if (!archive) return fail(404, 'NOT_FOUND', 'Archive record not found');

    bump();
    return ok({ slug }, { legacyKey: 'archive', message: 'Archive record deleted successfully' });
  } catch (error) {
    return handleDbError(error, 'Archive');
  }
}
