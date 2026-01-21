import { logger } from '../logger';

interface RateLimitConfig {
  maxRequests: number;
  windowMs: number;
}

const cache = new Map<string, { count: number; resetTime: number }>();

export function isRateLimited(key: string, config: RateLimitConfig): boolean {
  const now = Date.now();
  const userData = cache.get(key);

  if (!userData || now > userData.resetTime) {
    cache.set(key, {
      count: 1,
      resetTime: now + config.windowMs,
    });
    return false;
  }

  userData.count++;
  if (userData.count > config.maxRequests) {
    logger.warn({ msg: 'Rate limit exceeded', key, count: userData.count });
    return true;
  }

  return false;
}

// Cleanup interval to prevent memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, data] of cache.entries()) {
    if (now > data.resetTime) {
      cache.delete(key);
    }
  }
}, 60000);
