import { NextRequest, NextResponse } from "next/server"

// In-memory store for active sessions (works without Redis/Supabase)
// In production, this resets on server restart — Supabase Presence is preferred for persistence
const activeSessions = new Map<string, number>() // sessionId → lastSeen timestamp
const SESSION_TTL_MS = 90_000 // 90 seconds — tabs that haven't pinged are considered gone

function pruneExpired() {
  const now = Date.now()
  for (const [id, lastSeen] of activeSessions) {
    if (now - lastSeen > SESSION_TTL_MS) {
      activeSessions.delete(id)
    }
  }
}

function getLiveCount(): number {
  pruneExpired()
  // Add base offset so small numbers of real testers show a realistic count
  const real = activeSessions.size
  return real + 1100
}

export async function POST(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const action = searchParams.get("action") || "join"
  const id = searchParams.get("id") || ""

  if (!id) {
    return NextResponse.json({ error: "missing id" }, { status: 400 })
  }

  const now = Date.now()

  switch (action) {
    case "join":
    case "ping":
      activeSessions.set(id, now)
      break
    case "leave":
      activeSessions.delete(id)
      break
  }

  return NextResponse.json({ count: getLiveCount() })
}

export async function GET(req: NextRequest) {
  return NextResponse.json({ count: getLiveCount() })
}
