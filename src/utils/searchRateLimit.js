const buckets = new Map();

const DEFAULT_OPTIONS = {
  maxRequests: 25,
  windowMs: 60_000,
};

/**
 * Client-side search rate limiter (reduces abuse; server-side limits are still required).
 */
export function checkSearchRateLimit(key = "default", options = {}) {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const now = Date.now();

  if (!buckets.has(key)) {
    buckets.set(key, []);
  }

  const timestamps = buckets.get(key);

  while (timestamps.length && timestamps[0] < now - windowMs) {
    timestamps.shift();
  }

  if (timestamps.length >= maxRequests) {
    const retryAfterMs = Math.max(0, windowMs - (now - timestamps[0]));
    return { allowed: false, retryAfterMs };
  }

  timestamps.push(now);
  return { allowed: true, retryAfterMs: 0 };
}

export function resetSearchRateLimit(key) {
  if (key) {
    buckets.delete(key);
  } else {
    buckets.clear();
  }
}
