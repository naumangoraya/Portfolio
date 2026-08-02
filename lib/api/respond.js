import { NextResponse } from 'next/server';

/**
 * Single response envelope for the API.
 *
 * `legacyKey` is a migration hinge: the handlers used to return per-entity
 * shapes (`{ hero }`, `{ education }`, `{ success, service }`) that ~29 hand
 * written client fetches read directly. Emitting both the new `{ ok, data }`
 * envelope AND the old key lets the server and client migrate independently.
 * It is removed once a grep proves no client reads the old keys.
 */
export function ok(data, { status = 200, legacyKey, message } = {}) {
  const body = { ok: true, data };

  if (legacyKey) {
    body.success = true;
    body[legacyKey] = data;
    if (message) body.message = message;
  }

  return NextResponse.json(body, { status });
}

export function fail(status, code, message, details) {
  return NextResponse.json(
    {
      ok: false,
      success: false,
      error: { code, message, ...(details ? { details } : {}) },
      // Legacy clients read `.error` as a string and `.message`.
      message,
    },
    { status }
  );
}
