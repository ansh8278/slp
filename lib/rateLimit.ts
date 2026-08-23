type RateLimitEntry = {
  count: number;
  resetAt: number;
  lockedUntil?: number;
};

const store = new Map<string, RateLimitEntry>();

// Clean up expired rate-limit records every 5 minutes to prevent memory leak
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now && (!entry.lockedUntil || entry.lockedUntil < now)) {
      store.delete(key);
    }
  }
}, 5 * 60 * 1000);

/**
  Rate Limiter & Brute-Force Lockout Protection.
  @param key Unique identifier (e.g. `login:ip:email` or `ip`)
  @param maxAttempts Max allowed attempts before lockout (default: 5)
  @param windowMs Time window in milliseconds (default: 15 mins)
  @param lockoutMs Lockout duration in milliseconds (default: 15 mins)
 */
export function checkRateLimit(
  key: string,
  maxAttempts: number = 5,
  windowMs: number = 15 * 60 * 1000,
  lockoutMs: number = 15 * 60 * 1000
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: maxAttempts - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  // Check if key is currently locked out
  if (entry.lockedUntil && entry.lockedUntil > now) {
    const resetInSeconds = Math.ceil((entry.lockedUntil - now) / 1000);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  // Reset counter if window expired
  if (entry.resetAt < now) {
    entry.count = 1;
    entry.resetAt = now + windowMs;
    delete entry.lockedUntil;
    return { allowed: true, remaining: maxAttempts - 1, resetInSeconds: Math.ceil(windowMs / 1000) };
  }

  // Increment count
  entry.count += 1;

  if (entry.count > maxAttempts) {
    entry.lockedUntil = now + lockoutMs;
    const resetInSeconds = Math.ceil(lockoutMs / 1000);
    console.warn(`[SECURITY AUDIT] Rate limit exceeded / Account locked for key: ${key}. Locked for ${resetInSeconds}s.`);
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  return {
    allowed: true,
    remaining: maxAttempts - entry.count,
    resetInSeconds: Math.ceil((entry.resetAt - now) / 1000),
  };
}

/** Reset rate limit counter upon successful authentication. */
export function resetRateLimit(key: string) {
  store.delete(key);
}
