import { z } from 'zod';

/**
 * Shared primitives.
 *
 * These schemas are deliberately permissive about *presence* (the admin UI
 * PUTs partial documents everywhere) but strict about *type*, length and URL
 * scheme. Type strictness is the point: it is what stops a raw JSON value from
 * reaching a Mongoose query or a `strict: false` document.
 */

/** Trimmed string with a length cap; empty allowed unless `.min()` is chained. */
export const str = (max = 500) => z.string().max(max).trim();

/** Accepts '' (the models default many URL fields to '') and blocks javascript: */
export const SafeHref = z
  .string()
  .max(2048)
  .refine(
    v => v === '' || /^(https?:\/\/|\/|#|mailto:|tel:)/i.test(v),
    'Only http(s), /, #, mailto: and tel: links are allowed'
  );

/** Matches the { publicId, url, alt } shape every model uses for images. */
export const ImageRef = z
  .object({
    publicId: z.string().max(300).default(''),
    url: SafeHref.default(''),
    alt: z.string().max(300).default(''),
  })
  .partial();

export const StringList = (max = 100, itemMax = 300) => z.array(z.string().max(itemMax)).max(max);

/** Dates arrive from the client as ISO strings, Date objects, or ''. */
export const DateLike = z.union([z.string().max(64), z.date(), z.null()]);

export const Order = z.number().int().min(0).max(100000);

export const Flag = z.boolean();

/**
 * Strip keys whose value is `undefined` so a partial PUT never blanks a field
 * the form did not render.
 */
export const dropUndefined = obj =>
  Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== undefined));
