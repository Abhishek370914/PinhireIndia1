"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { MapPin, Eye, EyeOff, Loader2, AlertCircle, User, Phone, Mail, Lock, Zap } from "lucide-react"
import { useState } from "react"
import { signUp } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function SignupPage() {
  const router = useRouter()
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const formData = new FormData(e.currentTarget)
    
    // Simple client-side validation
    const pw = formData.get("password") as string
    if (pw.length < 8) {
      setError("Password must be at least 8 characters long")
      setLoading(false)
      return
    }

    const result = await signUp(formData)
    if (result?.error) {
      setError(result.error)
      setLoading(false)
    } else {
      // Success! Auto-signin happened in action, just redirect
      router.push("/explore")
      router.refresh()
    }
  }



  return (
    <div className="min-h-[calc(100dvh-4rem)] flex items-center justify-center px-4 py-12 relative overflow-hidden bg-[#07091a]">
      {/* Cinematic background blobs */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -ml-40 -mt-40 animate-pulse" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full bg-saffron/10 blur-[100px] pointer-events-none -mr-40 -mb-40" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="w-full max-w-lg relative z-10"
      >
        {/* Logo Section */}
        <div className="flex flex-col items-center gap-4 mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#0A2540] to-[#123050] flex items-center justify-center shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
          >
            <MapPin className="w-7 h-7 text-saffron" strokeWidth={2.5} />
          </motion.div>
          <div className="text-center">
            <span className="font-display font-black text-4xl tracking-tighter text-white">
              Pin<span className="text-saffron">Hire</span>
            </span>
            <p className="text-gray-400 text-sm font-medium mt-1">India&apos;s Premium Job Radar</p>
          </div>
        </div>

        <div className="bg-[#0A2540]/60 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          <div className="text-center mb-8">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-saffron/15 text-saffron text-[10px] font-black uppercase tracking-wider mb-4 border border-saffron/20">
               <Zap className="w-3 h-3" /> Get Hired Fast
             </div>
            <h1 className="font-display font-black text-3xl text-white tracking-tight mb-2">Create Your Account</h1>
            <p className="text-gray-400 text-sm">Join the 0.1% of top tech talent in India</p>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }} 
              animate={{ opacity: 1, x: 0 }}
              className="mb-8 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex gap-3 items-center text-red-400 text-sm"
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </motion.div>
          )}



          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                  <User className="w-3 h-3 text-saffron" /> Full Name
                </label>
                <input 
                  name="full_name"
                  type="text" 
                  required
                  placeholder="Arjun Mehta" 
                  className="w-full h-13 px-5 rounded-2xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-white placeholder:text-gray-600" 
                />
              </div>
              <div className="space-y-2">
                <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                  <Phone className="w-3 h-3 text-saffron" /> Phone Number
                </label>
                <input 
                  name="phone"
                  type="tel" 
                  required
                  placeholder="+91-XXXXX-XXXXX" 
                  className="w-full h-13 px-5 rounded-2xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-white placeholder:text-gray-600" 
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                <Mail className="w-3 h-3 text-saffron" /> Email Address
              </label>
              <input 
                name="email"
                type="email" 
                required
                placeholder="arjun@example.com" 
                className="w-full h-13 px-5 rounded-2xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-white placeholder:text-gray-600" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase tracking-widest text-white/40 ml-1 flex items-center gap-2">
                <Lock className="w-3 h-3 text-saffron" /> Password
              </label>
              <div className="relative">
                <input 
                  name="password"
                  type={showPw ? "text" : "password"} 
                  required
                  placeholder="Min. 8 characters" 
                  className="w-full h-13 px-5 pr-12 rounded-2xl bg-black/40 border border-white/10 text-sm focus:outline-none focus:ring-2 focus:ring-saffron/20 focus:border-saffron transition-all text-white placeholder:text-gray-600" 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPw(!showPw)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-saffron transition-all"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            
            <Button
              type="submit"
              disabled={loading}
              className="w-full h-15 bg-saffron hover:bg-saffron/90 text-white rounded-2xl font-black text-sm tracking-widest transition-all mt-4 shadow-[0_20px_40px_rgba(255,107,0,0.2)] hover:scale-[1.01] active:scale-[0.99] glow-saffron"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Create Account & Explore Map"
              )}
            </Button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-10 font-medium">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-saffron font-bold hover:underline transition-all">Sign in here</Link>
          </p>
        </div>

        {/* Legal Footer */}
        <p className="text-center text-[10px] text-gray-500 mt-12 max-w-sm mx-auto leading-relaxed uppercase tracking-widest opacity-60">
          SECURE CLOUD INFRASTRUCTURE • END-TO-END ENCRYPTED • DPDP ACT COMPLIANT
        </p>
      </motion.div>
    </div>
  )
}
