import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

// Exchange the code from the OAuth redirect for a session
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get("code")
  // Default redirect to /explore as requested by the user
  const next = searchParams.get("next") ?? "/explore"

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error) {
      const forwardTo = new URL(next, origin)
      return NextResponse.redirect(forwardTo.toString())
    }
  }

  // Auth error — redirect to login with error flag
  const loginUrl = new URL("/auth/login", origin)
  loginUrl.searchParams.set("error", "auth_failed")
  return NextResponse.redirect(loginUrl.toString())
}
