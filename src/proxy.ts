import { type NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"

// 1. Initialize Ratelimit (Requires UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN)
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
})

const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(50, "10 s"),
  analytics: true,
  prefix: "@upstash/ratelimit",
})

/**
 * Handles:
 * 1. Rate Limiting (Concurrency Protection)
 */
export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // A. Rate Limiting (Concurrency Protection)
  if (
    process.env.UPSTASH_REDIS_REST_URL && 
    !pathname.startsWith('/_next') &&
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/api/auth') &&
    !pathname.startsWith('/welcome')
  ) {
    const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1"
    const { success, limit, remaining, reset } = await ratelimit.limit(ip)

    if (!success) {
      return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
          "X-RateLimit-Reset": reset.toString(),
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/companies|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

