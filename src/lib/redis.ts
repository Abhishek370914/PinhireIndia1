import { Redis } from "@upstash/redis"

/**
 * Global Redis client for Upstash.
 * Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN in .env.local
 */
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
})

/**
 * Helper to get cached data or fetch from DB and cache it.
 */
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttlSeconds: number = 3600
): Promise<T> {
  const cached = await redis.get<T>(key)
  if (cached) {
    console.log(`[Cache Hit] ${key}`)
    return cached
  }

  console.log(`[Cache Miss] ${key}`)
  const data = await fetcher()
  if (data) {
    await redis.set(key, data, { ex: ttlSeconds })
  }
  return data
}
