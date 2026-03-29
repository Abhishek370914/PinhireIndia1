import { NextRequest, NextResponse } from "next/server"

// This is a Vercel Cron Job endpoint meant to be called daily.
// Configured in vercel.json:
// { "crons": [{ "path": "/api/cron/refresh-jobs", "schedule": "0 0 * * *" }] }

export async function GET(request: NextRequest) {
  // 1. Verify cron secret to prevent unauthorized public triggers
  const authHeader = request.headers.get("authorization")
  if (
    process.env.CRON_SECRET &&
    authHeader !== `Bearer ${process.env.CRON_SECRET}`
  ) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    // 2. Mock daily job refresh operation
    // In a real implementation:
    // - Fetch SEED_COMPANIES or DB companies
    // - Hit respective ATS APIs (Greenhouse, Lever, Workday etc.)
    // - Diff current jobs with new jobs
    // - Deactivate closed jobs (is_active = false)
    // - Insert new jobs

    const start = Date.now()
    
    // Simulate API scraping / DB operations delay
    await new Promise((resolve) => setTimeout(resolve, 800))
    
    const durationMs = Date.now() - start

    // 3. Return success
    return NextResponse.json(
      {
        success: true,
        message: "Daily job refresh completed successfully.",
        metrics: {
          companies_scanned: 29,
          jobs_added: 4,
          jobs_closed: 2,
          duration_ms: durationMs,
        },
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("Cron refresh-jobs failed:", error)
    return NextResponse.json(
      { success: false, error: "Internal Server Error" },
      { status: 500 }
    )
  }
}
