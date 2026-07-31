import { verifyAdmin } from '../auth.js';
import { fail } from './respond.js';

/**
 * Returns `null` when the caller is an authorized admin, otherwise a ready-to
 * -return 401 response.
 *
 *   const denied = await requireAdmin(request);
 *   if (denied) return denied;
 */
export async function requireAdmin(request) {
  const result = await verifyAdmin(request);
  return result.success ? null : fail(401, 'UNAUTHORIZED', result.message);
}

export default requireAdmin;
