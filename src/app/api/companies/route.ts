import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { redis, withCache } from "@/lib/redis"

// Initialize Supabase (Use service role if needed for bypass, or standard client)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

/**
 * High-Performance Companies API
 * FETCHES companies within a bounding box using PostGIS.
 * CACHES the results in Redis based on a coarse grid to maximize cache hits.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const minLat = parseFloat(searchParams.get("minLat") || "0")
  const minLng = parseFloat(searchParams.get("minLng") || "0")
  const maxLat = parseFloat(searchParams.get("maxLat") || "0")
  const maxLng = parseFloat(searchParams.get("maxLng") || "0")
  const zoom = parseInt(searchParams.get("zoom") || "10")

  // 1. Create a cache key based on a rounded bounding box (to increase cache hit rate)
  // We round coordinates to 1 decimal place (~11km precision) for caching
  const cacheKey = `map:companies:v1:grid:${minLat.toFixed(1)}:${minLng.toFixed(1)}:${maxLat.toFixed(1)}:${maxLng.toFixed(1)}`

  try {
    const companies = await withCache(cacheKey, async () => {
      // 2. Call the PostGIS function we created in postgis_setup.sql
      // We use rpc (Remote Procedure Call) for speed and complex spatial logic
      const { data, error } = await supabase.rpc('get_companies_in_bounds', {
        min_lat: minLat,
        min_lng: minLng,
        max_lat: maxLat,
        max_lng: maxLng
      })

      if (error) throw error
      return data
    }, 300) // Cache for 5 minutes

    return NextResponse.json(companies, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=30",
      },
    })
  } catch (error) {
    console.error("Spatial Query Error:", error)
    return NextResponse.json({ error: "Search failed" }, { status: 500 })
  }
}
