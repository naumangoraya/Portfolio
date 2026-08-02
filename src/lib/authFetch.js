'use client';

import toast from 'react-hot-toast';

/**
 * The single place outside AuthContext that reads the admin JWT.
 *
 * The server speaks two envelopes at once during the CMS migration
 * (see `lib/api/respond.js`): the new `{ ok, data }` shape and the legacy
 * per-entity keys. `authFetch` unwraps `data` when present and otherwise
 * hands back the raw JSON, so callers can be written against the new shape
 * today and keep working once the legacy keys are dropped.
 */

const TOKEN_KEY = 'adminToken';

/** Error thrown for any non-2xx response. Carries the parsed envelope details. */
export class ApiError extends Error {
  constructor(message, { status, code, details } = {}) {
    super(message || 'Request failed');
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let unauthorizedHandler = null;

/**
 * Register the callback invoked when the API answers 401.
 * Typically wired to AuthContext's `logout` plus a redirect.
 */
export function setUnauthorizedHandler(fn) {
  unauthorizedHandler = typeof fn === 'function' ? fn : null;
}

export function getUnauthorizedHandler() {
  return unauthorizedHandler;
}

/** SSR-safe token read. Returns null on the server or when storage is blocked. */
export function getToken() {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    return window.localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

/** SSR-safe token clear, used when the server rejects our credentials. */
export function clearToken() {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* storage unavailable - nothing to clear */
  }
}

async function readJson(response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

/**
 * Authenticated fetch wrapper.
 *
 * @param {string} url
 * @param {object} [options]
 * @param {string} [options.method='GET']
 * @param {any}    [options.body]    JSON-serialisable payload (ignored when `form` is set).
 * @param {FormData} [options.form]  Multipart payload; suppresses the JSON content-type.
 * @param {boolean} [options.silent] Suppress the error toast (the throw still happens).
 * @param {object} [options.headers]
 * @param {AbortSignal} [options.signal]
 * @returns {Promise<any>} `json.data` when the new envelope is used, else the raw JSON.
 */
export async function authFetch(url, options = {}) {
  const { method = 'GET', body, form, silent = false, headers = {}, signal, ...rest } = options;

  const token = getToken();
  const finalHeaders = { ...headers };

  if (token) {
    finalHeaders.Authorization = `Bearer ${token}`;
  }

  let payload;
  if (form) {
    // Let the browser set the multipart boundary.
    payload = form;
  } else if (body !== undefined) {
    if (!finalHeaders['Content-Type']) {
      finalHeaders['Content-Type'] = 'application/json';
    }
    payload = typeof body === 'string' ? body : JSON.stringify(body);
  }

  let response;
  try {
    response = await fetch(url, {
      ...rest,
      method,
      headers: finalHeaders,
      signal,
      ...(payload !== undefined ? { body: payload } : {}),
    });
  } catch (networkError) {
    if (networkError?.name === 'AbortError') {
      throw networkError;
    }
    const message = 'Network error - please check your connection';
    if (!silent) {
      toast.error(message);
    }
    throw new ApiError(message, { status: 0, code: 'NETWORK_ERROR' });
  }

  const json = await readJson(response);

  if (response.status === 401) {
    clearToken();
    const message =
      json?.error?.message || json?.message || 'Session expired - please sign in again';
    if (unauthorizedHandler) {
      unauthorizedHandler({ status: 401, message });
    } else if (!silent) {
      toast.error(message);
    }
    throw new ApiError(message, {
      status: 401,
      code: json?.error?.code || 'UNAUTHORIZED',
      details: json?.error?.details,
    });
  }

  if (!response.ok || json?.ok === false) {
    const message = json?.error?.message || json?.message || `Request failed (${response.status})`;
    if (!silent) {
      toast.error(message);
    }
    throw new ApiError(message, {
      status: response.status,
      code: json?.error?.code,
      details: json?.error?.details,
    });
  }

  if (json === null) {
    return null;
  }

  return json.data !== undefined ? json.data : json;
}

export default authFetch;
