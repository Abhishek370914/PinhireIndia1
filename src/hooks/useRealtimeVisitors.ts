"use client"

import { useEffect, useRef, useState } from "react"
import { createClient } from "@/lib/supabase/client"

// Generates a stable per-tab session ID
function getSessionId(): string {
  if (typeof window === "undefined") return ""
  let id = sessionStorage.getItem("ph_visitor_id")
  if (!id) {
    id = `v_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
    sessionStorage.setItem("ph_visitor_id", id)
  }
  return id
}

// Check if Supabase is actually configured (not placeholder)
function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
  return url.length > 0 && !url.includes("your-project") && url.startsWith("https://")
}

export function useRealtimeVisitors(): { count: number; isLive: boolean } {
  const [count, setCount] = useState(1247)
  const [isLive, setIsLive] = useState(false)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>["channel"]> | null>(null)
  const pollRef = useRef<NodeJS.Timeout | null>(null)
  const simulateRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const sessionId = getSessionId()

    // ── Mode A: Supabase Realtime Presence ──────────────────────────────────
    if (isSupabaseConfigured()) {
      const supabase = createClient()
      
      // Clean up any existing channel to prevent React Strict Mode / HMR errors
      const existingChannel = supabase.getChannels().find((c) => c.topic === "realtime:pinhire_visitors")
      if (existingChannel) {
        supabase.removeChannel(existingChannel)
      }

      const channel = supabase.channel("pinhire_visitors", {
        config: {
          presence: { key: sessionId },
        },
      })

      channelRef.current = channel

      channel
        .on("presence", { event: "sync" }, () => {
          const state = channel.presenceState()
          const total = Object.keys(state).length
          // Add a base offset so 1 real user shows a realistic number
          setCount(Math.max(total + 1100, 1100))
          setIsLive(true)
        })
        .subscribe(async (status) => {
          if (status === "SUBSCRIBED") {
            await channel.track({
              visitor_id: sessionId,
              page: window.location.pathname,
              joined_at: new Date().toISOString(),
            })
          }
        })

      return () => {
        channel.untrack().then(() => supabase.removeChannel(channel))
        channelRef.current = null
      }
    }

    // ── Mode B: API Polling Fallback ─────────────────────────────────────────
    // Try the /api/visitors route (works even without Supabase)
    let active = true

    const poll = async () => {
      try {
        const res = await fetch(`/api/visitors?action=join&id=${sessionId}`, {
          method: "POST",
          cache: "no-store",
        })
        if (res.ok) {
          const json = await res.json()
          if (active && typeof json.count === "number") {
            setCount(json.count)
            setIsLive(true)
            return // successfully got real count
          }
        }
      } catch {
        // API not available — fall through to simulation
      }

      // ── Mode C: Realistic simulation (smooth fluctuation) ─────────────────
      setCount((prev) => {
        const time = Date.now() / 1000
        // Sine wave for natural-looking fluctuation (10–30 range swing)
        const base = 1247
        const wave = Math.sin(time * 0.08) * 15 + Math.sin(time * 0.03) * 10
        const noise = (Math.random() - 0.5) * 4
        return Math.round(base + wave + noise)
      })
    }

    // Initial fetch
    poll()

    // Poll every 3 seconds (heartbeat to keep session alive)
    pollRef.current = setInterval(poll, 3000)

    // Heartbeat ping to keep session registered
    const heartbeat = setInterval(async () => {
      if (!active) return
      try {
        await fetch(`/api/visitors?action=ping&id=${sessionId}`, { method: "POST", cache: "no-store" })
      } catch {}
    }, 30000)

    // Cleanup on tab close
    const handleUnload = () => {
      navigator.sendBeacon(`/api/visitors?action=leave&id=${sessionId}`)
    }
    window.addEventListener("beforeunload", handleUnload)

    return () => {
      active = false
      if (pollRef.current) clearInterval(pollRef.current)
      if (simulateRef.current) clearInterval(simulateRef.current)
      clearInterval(heartbeat)
      window.removeEventListener("beforeunload", handleUnload)
      try {
        navigator.sendBeacon(`/api/visitors?action=leave&id=${sessionId}`)
      } catch {}
    }
  }, [])

  return { count, isLive }
}
