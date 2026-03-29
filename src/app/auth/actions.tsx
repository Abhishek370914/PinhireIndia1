"use server"

import React from "react"
import { signIn as authSignIn, signOut as authSignOut } from "@/auth"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import bcrypt from "bcryptjs"
import { Resend } from "resend"
import { WelcomeEmail } from "@/components/email/WelcomeEmail"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await authSignIn("credentials", {
      email,
      password,
      redirectTo: "/explore",
    })
  } catch (error: any) {
    if (error.type === "CredentialsSignin") {
      return { error: "Invalid email or password" }
    }
    throw error
  }
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const phone = formData.get("phone") as string
  
  const supabase = await createClient()

  // 1. Check if user already exists
  const { data: existingUser } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", email)
    .single()

  if (existingUser) {
    return { error: "A user with this email already exists" }
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 10)

  // 3. Create user in 'profiles' table
  const { data: newUser, error: createError } = await supabase
    .from("profiles")
    .insert([
      {
        email,
        full_name: fullName,
        phone,
        password_hash: passwordHash,
      }
    ])
    .select()
    .single()

  if (createError) {
    console.error("Signup error:", createError)
    return { error: "Could not create account. Please try again." }
  }

  // 4. Send Welcome Email via Resend
  try {
    await resend.emails.send({
      from: "PinHire India <onboarding@pinhire.in>",
      to: email,
      subject: "Welcome to PinHire India – Your Job Journey Starts Here! 🚀",
      react: <WelcomeEmail name={fullName} />,
    })
  } catch (emailError) {
    console.warn("Failed to send welcome email:", emailError)
  }

  // 5. Sign in the user
  try {
    await authSignIn("credentials", {
      email,
      password,
      redirect: false,
    })
    return { success: true }
  } catch (error) {
    return { error: "Created account but login failed. Please sign in manually."}
  }
}

export async function signInWithGoogle() {
  await authSignIn("google", { redirectTo: "/explore" })
}

export async function signOut() {
  await authSignOut({ redirectTo: "/auth/login" })
}
