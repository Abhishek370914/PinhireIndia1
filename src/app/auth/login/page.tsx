"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, MapPin, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { signIn, signInWithGoogle } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    const result = await signIn(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push("/explore")
      router.refresh()
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    await signInWithGoogle()
  }

  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* Background blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full bg-saffron/8 blur-[120px] pointer-events-none -mr-40 -mt-40" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-blue-500/5 blur-[100px] pointer-events-none -ml-40 -mb-40" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 220, damping: 24 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 justify-center mb-10 group">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#1a3a5c] flex items-center justify-center shadow-2xl border border-white/10"
          >
            <MapPin className="w-6 h-6 text-saffron" strokeWidth={2.5} />
          </motion.div>
          <span className="font-display font-black text-3xl tracking-tight">
            <span className="text-[#0A2540]">Pin</span><span className="text-saffron">Hire</span>
          </span>
        </div>

        <div className="bg-white/70 dark:bg-[#0A2540]/40 backdrop-blur-2xl border border-white/20 dark:border-white/5 rounded-[2.5rem] p-10 shadow-2xl shadow-black/5">
          <div className="text-center mb-8">
            <h1 className="font-display font-black text-3xl text-[#0A2540] dark:text-white tracking-tight mb-2">Welcome Back</h1>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Access your personalized job matches and insights</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 flex gap-3 items-center text-red-600 dark:text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}

          {/* Google OAuth (Prominent) */}
          <Button 
            disabled={googleLoading || loading}
            onClick={handleGoogle}
            className="w-full h-14 bg-white hover:bg-gray-50 text-gray-700 dark:text-gray-900 border border-gray-200 shadow-sm rounded-2xl font-bold flex items-center justify-center gap-3 transition-all mb-6 hover:scale-[1.02] active:scale-[0.98]"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            Continue with Google
          </Button>

          <div className="relative mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-white/10" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-transparent px-4 text-gray-500 font-bold tracking-widest">or email</span>
            </div>
          </div>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[11px] font-black uppercase tracking-widest text-[#0A2540]/60 dark:text-white/40 ml-1">Email address</label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="you@pinhire.in" 
                className="w-full h-12 px-5 rounded-2xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-gray-900 dark:text-white placeholder:text-gray-400" 
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[11px] font-black uppercase tracking-widest text-[#0A2540]/60 dark:text-white/40">Password</label>
                <Link href="#" className="text-[10px] font-bold text-saffron hover:underline leading-none">Forgot?</Link>
              </div>
              <div className="relative">
                <input 
                  name="password"
                  type={showPw ? "text" : "password"} 
                  required
                  placeholder="••••••••" 
                  className="w-full h-12 px-5 pr-12 rounded-2xl bg-white/50 dark:bg-black/20 border border-gray-200 dark:border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-gray-900 dark:text-white placeholder:text-gray-400" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-saffron transition-colors"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full h-14 bg-[#0A2540] hover:bg-saffron text-white rounded-2xl font-black text-sm tracking-wide gap-2 transition-all mt-4 shadow-xl shadow-[#0A2540]/10"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-8 font-medium">
            New to PinHire?{" "}
            <Link href="/auth/signup" className="text-saffron font-bold hover:underline">Create an account</Link>
          </p>
        </div>

        {/* Footer info */}
        <p className="text-center text-[10px] text-gray-400 mt-10 uppercase tracking-[0.2em] font-medium">
          Secure Cloud Infrastructure • End-to-end Encrypted
        </p>
      </motion.div>
    </div>
  )
}
