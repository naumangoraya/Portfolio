/**
 * Convert Mongoose lean() output into plain, JSON-safe values that can cross the
 * Server Component -> Client Component boundary.
 *
 * The Date branch is load-bearing: `Object.entries(new Date())` is `[]`, so a
 * generic object walk turns every Date into `{}`. That produced `NaN` years on
 * /archive and made job/project updates PUT `{}` back into Date fields, which
 * Mongoose rejected with a CastError (500).
 */
export function serializeData(data) {
  if (data === null || data === undefined) return null;

  if (data instanceof Date) return data.toISOString();

  // ObjectId, Decimal128, Buffer and friends all serialize via toString/toJSON.
  if (typeof data === 'object' && typeof data.toHexString === 'function') {
    return data.toHexString();
  }

  if (Array.isArray(data)) return data.map(serializeData);

  if (typeof data === 'object') {
    const plain = {};
    for (const [key, value] of Object.entries(data)) {
      if (key.startsWith('$') || key === '__v') continue;
      plain[key] = serializeData(value);
    }
    return plain;
  }

  return data;
}

export default serializeData;
