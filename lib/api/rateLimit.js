/**
 * Best-effort in-process rate limiter.
 *
 * Caveat worth knowing: on serverless this is per-instance and resets on cold
 * start, so it slows an attacker rather than stopping one. It is a stopgap
 * until a shared store (Upstash/Redis) is wired up. The previous version of
 * this idea in contact/submit also never pruned its Map, so it leaked for the
 * life of the instance; this one sweeps.
 */
const buckets = new Map();

const MAX_KEYS = 5000;

function sweep(now) {
  for (const [key, entry] of buckets) {
    if (entry.resetAt <= now) buckets.delete(key);
  }
  // Hard cap so a spray of unique keys cannot grow this without bound.
  if (buckets.size > MAX_KEYS) {
    const excess = buckets.size - MAX_KEYS;
    let i = 0;
    for (const key of buckets.keys()) {
      buckets.delete(key);
      if (++i >= excess) break;
    }
  }
}

/**
 * @returns {{ allowed: boolean, retryAfter: number, remaining: number }}
 */
export function rateLimit(key, { limit, windowMs }) {
  const now = Date.now();
  sweep(now);

  const entry = buckets.get(key);

  if (!entry || entry.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfter: 0, remaining: limit - 1 };
  }

  entry.count += 1;

  if (entry.count > limit) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1000),
      remaining: 0,
    };
  }

  return { allowed: true, retryAfter: 0, remaining: limit - entry.count };
}

/**
 * Trusted client IP.
 *
 * `x-forwarded-for` is client-supplied at the first hop, so keying a limiter
 * off `xff.split(',')[0]` (as contact/submit did) is defeated by sending a
 * random header per request. Vercel's own header is set by the edge and is
 * not spoofable; fall back to the LAST xff hop, which is the one added by the
 * closest trusted proxy.
 */
export function clientIp(request) {
  const vercel = request.headers.get('x-vercel-forwarded-for');
  if (vercel) return vercel.split(',')[0].trim();

  const real = request.headers.get('x-real-ip');
  if (real) return real.trim();

  const xff = request.headers.get('x-forwarded-for');
  if (xff) {
    const hops = xff.split(',');
    return hops[hops.length - 1].trim();
  }

  return 'unknown';
}
