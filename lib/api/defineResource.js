import { revalidatePath } from 'next/cache';
import dbConnect from '../mongodb.js';
import { serializeData } from '../serialize.js';
import { ok, fail } from './respond.js';
import { requireAdmin } from './requireAdmin.js';
import { handleDbError } from './handleDbError.js';

/**
 * Generates the CRUD handlers for a content model.
 *
 * Replaces ~1,400 lines of copy-pasted route code that had drifted into
 * inconsistent status codes, three different auth contracts, and raw body
 * spreads into `strict: false` schemas.
 *
 * `allowedFields` is the security boundary. Every model sets `strict: false`,
 * so without a whitelist any admin-token holder could write arbitrary keys
 * (including `isActive`, `order`, `createdAt`) into documents forever.
 */
export function defineResource(config) {
  const {
    model: Model,
    schema,
    patchSchema = schema.partial ? schema.partial() : schema,
    allowedFields,
    sort = { order: 1 },
    listQuery = { isActive: true },
    singleton = false,
    legacyKey,
    revalidate = ['/'],
    transformIn = value => value,
  } = config;

  const name = Model.modelName;

  const pick = obj =>
    Object.fromEntries(Object.entries(obj).filter(([key]) => allowedFields.includes(key)));

  const bump = () => revalidate.forEach(path => revalidatePath(path));

  const guard = async (request, run) => {
    const denied = await requireAdmin(request);
    if (denied) return denied;

    try {
      await dbConnect();
      return await run();
    } catch (error) {
      return handleDbError(error, name);
    }
  };

  const collection = {
    GET: async () => {
      try {
        await dbConnect();
        const result = singleton
          ? await Model.findOne(listQuery).sort(sort).lean()
          : await Model.find(listQuery).sort(sort).lean();

        return ok(serializeData(result) ?? (singleton ? null : []), { legacyKey });
      } catch (error) {
        return handleDbError(error, name);
      }
    },

    POST: request =>
      guard(request, async () => {
        const input = schema.parse(transformIn(await request.json()));
        const created = await Model.create({ ...pick(input), isActive: true });
        bump();
        return ok(serializeData(created.toObject()), {
          status: 201,
          legacyKey,
          message: `${name} created successfully`,
        });
      }),

    PUT: request =>
      guard(request, async () => {
        const body = transformIn(await request.json());
        const input = patchSchema.parse(body);
        const update = pick(input);

        // Singletons upsert; collections update the document named by `id`.
        const doc = singleton
          ? await Model.findOneAndUpdate({}, { $set: update }, {
              new: true,
              upsert: true,
              runValidators: true,
              setDefaultsOnInsert: true,
            }).lean()
          : await Model.findByIdAndUpdate(body.id ?? body._id, { $set: update }, {
              new: true,
              runValidators: true,
            }).lean();

        if (!doc) return fail(404, 'NOT_FOUND', `${name} not found`);

        bump();
        return ok(serializeData(doc), { legacyKey, message: `${name} updated successfully` });
      }),
  };

  const item = {
    GET: async (request, context) => {
      try {
        // `await` on a plain object is a no-op, so this is correct on Next 14
        // and correct on Next 16 where params became a Promise.
        const { id } = await context.params;
        await dbConnect();
        const doc = await Model.findById(id).lean();
        if (!doc) return fail(404, 'NOT_FOUND', `${name} not found`);
        return ok(serializeData(doc), { legacyKey });
      } catch (error) {
        return handleDbError(error, name);
      }
    },

    PUT: (request, context) =>
      guard(request, async () => {
        const { id } = await context.params;
        const input = patchSchema.parse(transformIn(await request.json()));
        const doc = await Model.findByIdAndUpdate(id, { $set: pick(input) }, {
          new: true,
          runValidators: true,
        }).lean();

        if (!doc) return fail(404, 'NOT_FOUND', `${name} not found`);

        bump();
        return ok(serializeData(doc), { legacyKey, message: `${name} updated successfully` });
      }),

    DELETE: (request, context) =>
      guard(request, async () => {
        const { id } = await context.params;
        const doc = await Model.findByIdAndDelete(id);

        if (!doc) return fail(404, 'NOT_FOUND', `${name} not found`);

        bump();
        return ok({ _id: id }, { legacyKey, message: `${name} deleted successfully` });
      }),
  };

  return { collection, item };
}

export default defineResource;
