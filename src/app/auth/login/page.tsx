"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Mail, MapPin, ArrowRight, Eye, EyeOff, Loader2, AlertCircle } from "lucide-react"
import { useState } from "react"
import { signIn } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
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
              disabled={loading}
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
