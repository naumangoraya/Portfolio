import { z } from 'zod';
import { fail } from './respond.js';

/**
 * Maps thrown errors to correct status codes without leaking internals.
 *
 * Handlers used to return `{ error, details: error.message }`, which exposed
 * Mongo hostnames, index names and replica-set topology to any caller. The
 * detail is now logged server-side and only surfaced outside production.
 */
export function handleDbError(error, context = 'api') {
  if (error instanceof z.ZodError) {
    return fail(400, 'VALIDATION', 'Invalid input', z.flattenError(error).fieldErrors);
  }

  if (error?.name === 'ValidationError') {
    return fail(400, 'VALIDATION', 'Invalid input');
  }

  if (error?.name === 'CastError') {
    return fail(400, 'BAD_ID', 'Malformed identifier');
  }

  if (error?.code === 11000) {
    return fail(409, 'DUPLICATE', 'That value already exists', Object.keys(error.keyValue || {}));
  }

  console.error(`[${context}]`, error);

  return fail(
    500,
    'SERVER_ERROR',
    'Internal server error',
    process.env.NODE_ENV === 'production' ? undefined : String(error?.message || error)
  );
}
