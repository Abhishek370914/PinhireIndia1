import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import { createClient } from "@/lib/supabase/server"
import bcrypt from "bcryptjs"

export const { handlers, auth, signIn, signOut } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        const supabase = await createClient()
        
        // We'll check our 'profiles' table which we use for manual users
        // Manual users are stored with a hashed password in the 'profiles' table in this implementation
        const { data: profile, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("email", credentials.email)
          .single()

        if (error || !profile || !profile.password_hash) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          profile.password_hash
        )

        if (!isPasswordValid) return null

        return {
          id: profile.id,
          name: profile.full_name,
          email: profile.email,
          image: profile.avatar_url,
          phone: profile.phone,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.phone = (user as any).phone
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        (session.user as any).phone = token.phone
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },
  session: {
    strategy: "jwt",
  },
})
