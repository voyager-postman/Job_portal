const ANONYMOUS_CLIENT_KEY = "jp_anonymous_client_id";
const STORAGE_PREFIX = "jp_rate_limit_";
const BLOCK_UNTIL_PREFIX = "jp_rate_block_until_";

const DEFAULT_OPTIONS = {
  maxRequests: 20,
  windowMs: 60_000,
};

const isBrowser = () =>
  typeof window !== "undefined" && typeof localStorage !== "undefined";

/**
 * Stable anonymous id for public pages (localStorage — survives refresh in same browser).
 */
export function getAnonymousClientId() {
  if (!isBrowser()) {
    return "server";
  }

  let id = localStorage.getItem(ANONYMOUS_CLIENT_KEY);
  if (!id) {
    id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `anon-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
    localStorage.setItem(ANONYMOUS_CLIENT_KEY, id);
  }
  return id;
}

function bucketStorageKey(scope, clientId) {
  return `${STORAGE_PREFIX}${scope}:${clientId}`;
}

function blockStorageKey(scope, clientId) {
  return `${BLOCK_UNTIL_PREFIX}${scope}:${clientId}`;
}

function readTimestamps(scope, clientId) {
  if (!isBrowser()) {
    return [];
  }

  try {
    const raw = localStorage.getItem(bucketStorageKey(scope, clientId));
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeTimestamps(scope, clientId, timestamps) {
  if (!isBrowser()) {
    return;
  }
  localStorage.setItem(
    bucketStorageKey(scope, clientId),
    JSON.stringify(timestamps),
  );
}

function readBlockUntil(scope, clientId) {
  if (!isBrowser()) {
    return 0;
  }
  const raw = localStorage.getItem(blockStorageKey(scope, clientId));
  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

function writeBlockUntil(scope, clientId, untilMs) {
  if (!isBrowser()) {
    return;
  }
  if (untilMs > Date.now()) {
    localStorage.setItem(blockStorageKey(scope, clientId), String(untilMs));
  } else {
    localStorage.removeItem(blockStorageKey(scope, clientId));
  }
}

/**
 * Client-side rate limiter persisted in localStorage (per browser + anonymous id).
 * Returns { allowed, retryAfterMs, remaining }.
 */
export function checkSearchRateLimit(key = "default", options = {}) {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const clientId = options.clientId || getAnonymousClientId();
  const now = Date.now();

  const activeBlockUntil = readBlockUntil(key, clientId);
  if (activeBlockUntil > now) {
    return {
      allowed: false,
      retryAfterMs: activeBlockUntil - now,
      remaining: 0,
    };
  }

  const timestamps = readTimestamps(key, clientId).filter(
    (timestamp) => timestamp > now - windowMs,
  );

  if (timestamps.length >= maxRequests) {
    const blockUntil = now + windowMs;
    writeBlockUntil(key, clientId, blockUntil);
    writeTimestamps(key, clientId, timestamps);
    return {
      allowed: false,
      retryAfterMs: windowMs,
      remaining: 0,
    };
  }

  timestamps.push(now);
  writeTimestamps(key, clientId, timestamps);

  return {
    allowed: true,
    retryAfterMs: 0,
    remaining: Math.max(0, maxRequests - timestamps.length),
  };
}

export function resetSearchRateLimit(key, clientId = getAnonymousClientId()) {
  if (!isBrowser()) {
    return;
  }

  if (key) {
    localStorage.removeItem(bucketStorageKey(key, clientId));
    localStorage.removeItem(blockStorageKey(key, clientId));
    return;
  }

  Object.keys(localStorage).forEach((storageKey) => {
    if (
      storageKey.startsWith(STORAGE_PREFIX) ||
      storageKey.startsWith(BLOCK_UNTIL_PREFIX)
    ) {
      localStorage.removeItem(storageKey);
    }
  });
}

export function getRateLimitStatus(key, options = {}) {
  const { maxRequests, windowMs } = { ...DEFAULT_OPTIONS, ...options };
  const clientId = options.clientId || getAnonymousClientId();
  const now = Date.now();
  const activeBlockUntil = readBlockUntil(key, clientId);

  if (activeBlockUntil > now) {
    return {
      blocked: true,
      retryAfterMs: activeBlockUntil - now,
      remaining: 0,
    };
  }

  const timestamps = readTimestamps(key, clientId).filter(
    (timestamp) => timestamp > now - windowMs,
  );

  return {
    blocked: false,
    retryAfterMs: 0,
    remaining: Math.max(0, maxRequests - timestamps.length),
  };
}
