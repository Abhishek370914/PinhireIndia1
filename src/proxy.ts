import { type NextRequest, NextResponse } from "next/server"
import { Ratelimit } from "@upstash/ratelimit"
import { Redis } from "@upstash/redis"
import { auth } from "@/auth"

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
 * 2. Full Authentication Guard (Auth.js session)
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

  // B. Authentication Guard (Auth.js)
  const session = await auth()
  const isAuthPath = pathname.startsWith("/auth")
  const isApiAuthPath = pathname.startsWith("/api/auth")

  // 1. Skip checks for API Auth routes
  if (isApiAuthPath) return NextResponse.next()

  // 2. Force Redirect to /auth/login if NOT authenticated and NOT on /auth path
  if (!session && !isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/auth/login"
    return NextResponse.redirect(url)
  }

  // 3. Redirect to /welcome if authenticated and trying to access /auth
  if (session && isAuthPath) {
    const url = request.nextUrl.clone()
    url.pathname = "/welcome"
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|api/companies|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
