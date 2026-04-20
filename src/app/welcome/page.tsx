"use client"

import { useState, useEffect, useMemo, memo, Suspense } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Briefcase, Building2, ArrowRight, Mail, Sparkles, Globe, Zap, Search, Store } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"
import Counter from "@/components/welcome/Counter"

// All client-only components loaded with ssr:false to avoid hydration mismatches
const GhostAssistant = dynamic(() => import("@/components/welcome/GhostAssistant"), { ssr: false })
const VisitorCounter3D = dynamic(() => import("@/components/welcome/VisitorCounter3D"), { ssr: false })

const stats = [
  { label: "Companies", value: 500, suffix: "+", icon: Building2, color: "text-blue-400", glow: "shadow-blue-500/20" },
  { label: "Job Roles", value: 2500, suffix: "+", icon: Briefcase, color: "text-saffron", glow: "shadow-saffron/20" },
  { label: "Cities", value: 12, suffix: "", icon: MapPin, color: "text-emerald-400", glow: "shadow-emerald-500/20" },
]

// Memoized Stat Card for performance
const StatCard = memo(({ stat, i }: { stat: typeof stats[0], i: number }) => (
  <motion.div
    whileHover={{ y: -12, scale: 1.02 }}
    className={cn(
      "glass p-10 rounded-4xl border border-white/10 relative group transition-all duration-500",
      "before:absolute before:inset-0 before:rounded-4xl before:p-px before:bg-linear-to-b before:from-white/20 before:to-transparent before:-z-10"
    )}
  >
    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 mx-auto group-hover:bg-white/10 transition-colors shadow-inner ${stat.glow}`}>
      <stat.icon className={`w-7 h-7 ${stat.color}`} />
    </div>
    <div className="text-5xl font-display font-900 mb-2 tracking-tighter">
      <Counter value={stat.value} suffix={stat.suffix} />
    </div>
    <div className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-800">{stat.label}</div>
    
    <div className="absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-saffron/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
  </motion.div>
))
StatCard.displayName = "StatCard"

// Fixed particle positions generated once (seeded, no Math.random during render)
// This avoids SSR/client mismatch — particles are fully client-only via useEffect
const PARTICLE_CONFIGS = [
  { top: 18, left: 22, dur: 9, delay: 0 },
  { top: 35, left: 68, dur: 11, delay: 1.2 },
  { top: 55, left: 14, dur: 8, delay: 2.5 },
  { top: 72, left: 45, dur: 13, delay: 0.8 },
  { top: 28, left: 81, dur: 10, delay: 3.1 },
  { top: 63, left: 58, dur: 9, delay: 1.8 },
  { top: 42, left: 35, dur: 12, delay: 0.4 },
  { top: 80, left: 75, dur: 8, delay: 2.2 },
]

// Client-only particle layer — no SSR risk
function ParticleLayer() {
  const [mounted, setMounted] = useState(false)
  useEffect(() => { setMounted(true) }, [])

  if (!mounted) return null

  return (
    <>
      {PARTICLE_CONFIGS.map((p, i) => (
        <motion.div
          key={i}
          animate={{ y: [0, -60, 0], opacity: [0, 0.35, 0] }}
          transition={{ duration: p.dur, repeat: Infinity, delay: p.delay, ease: "easeInOut" }}
          className="absolute w-1 h-1 bg-blue-400/40 rounded-full will-change-transform"
          style={{ top: `${p.top}%`, left: `${p.left}%` }}
        />
      ))}
    </>
  )
}

export default function WelcomePage() {
  const router = useRouter()
  const [isExiting, setIsExiting] = useState(false)
  const gmailUrl = "https://mail.google.com/mail/?view=cm&fs=1&to=abhiajjers@gmail.com"

  const handleExploreClick = () => {
    setIsExiting(true)
    setTimeout(() => router.push("/explore"), 800)
  }

  const container = useMemo(() => ({
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.1 }
    },
    exit: {
      opacity: 0,
      scale: 1.05,
      filter: "blur(12px)",
      transition: { duration: 0.6, ease: "easeInOut" as const }
    }
  }), [])

  const item = {
    hidden: { opacity: 0, y: 30 },
    show: { 
      opacity: 1, 
      y: 0, 
      transition: { type: "spring" as const, stiffness: 100, damping: 25 } 
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center p-6 bg-[#03050C] text-white relative overflow-hidden font-sans">
      
      {/* --- Optimized Background Layer --- */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.02]" 
          style={{ 
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '50px 50px' 
          }} 
        />
        {/* Client-only particles — no hydration mismatch */}
        <ParticleLayer />
        {/* Static radial glows — safe for SSR */}
        <div className="absolute -top-[20%] -left-[10%] w-[80%] h-[80%] bg-blue-900/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[80%] h-[80%] bg-purple-900/10 rounded-full blur-[120px]" />
      </div>

      {/* --- Content --- */}
      <AnimatePresence>
        {!isExiting && (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
            className="max-w-6xl w-full text-center z-10 space-y-12"
          >
            {/* Top Badge */}
            <motion.div variants={item} className="flex justify-center">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(255,107,0,0.2)" }}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/[0.03] border border-white/10 text-saffron text-sm font-bold tracking-tight shadow-2xl backdrop-blur-md"
              >
                <Sparkles className="w-4 h-4" />
                Next-Gen Career Discovery
              </motion.div>
            </motion.div>

            {/* Powerful Headline */}
            <motion.div variants={item} className="space-y-6">
              <h1 className="text-6xl md:text-8xl font-display font-900 tracking-tightest leading-[1.05]">
                Discover Opportunities <br />
                <span className="bg-linear-to-r from-saffron via-[#FF8C00] to-[#FF0080] bg-clip-text text-transparent drop-shadow-sm">
                  Around You, Instantly
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-medium">
                Explore thousands of jobs, companies, and career paths mapped to real locations — 
                <span className="text-white"> your next opportunity is closer than you think.</span>
              </p>
            </motion.div>

            {/* Stats Section */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
              {stats.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} i={i} />
              ))}
            </motion.div>

            {/* ── 3D Real-Time Visitor Counter ── */}
            <motion.div variants={item} className="flex justify-center w-full px-4">
              <VisitorCounter3D />
            </motion.div>

            {/* Professional CTAs */}
            <motion.div variants={item} className="flex flex-col items-center justify-center gap-6 pt-4 w-full">
              {/* Featured Pin Your Impact Button */}
              <Link href="/pin-your-impact" className="w-full max-w-2xl">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#166534] hover:bg-[#0d4620] text-white font-bold text-xl h-20 px-6 rounded-xl transition-colors duration-300 flex items-center justify-center gap-4 shadow-lg hover:shadow-xl border border-[#1e7741]"
                >
                  <Sparkles className="w-6 h-6" />
                  <div className="flex flex-col items-start">
                    <span className="text-xs uppercase tracking-widest opacity-90">AI-Powered Matching</span>
                    <span className="text-xl font-black">Pin Your Impact</span>
                  </div>
                  <ArrowRight className="w-5 h-5 ml-auto" />
                </motion.button>
              </Link>

              {/* Secondary CTAs */}
              <motion.div className="flex flex-col md:flex-row items-center justify-center gap-6 w-full">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExploreClick}
                  className="flex-1 max-w-md bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold text-lg h-16 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-[#3b82f6]"
                >
                  <MapPin className="w-5 h-5" />
                  <span>Explore Map</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>

              {/* Remote Jobs Button */}
              <Link href="/remote-jobs" className="w-full max-w-md">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full bg-[#166534] hover:bg-[#0d4620] text-white font-bold text-lg h-16 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-[#1e7741]"
                >
                  <Globe className="w-5 h-5" />
                  <span>Remote Jobs Worldwide</span>
                </motion.button>
              </Link>

              {/* Bottom Action Row */}
              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                {/* Find Jobs Button */}
                <Link href="/jobs" className="flex-1 max-w-xs">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold text-base h-14 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg border border-[#3b82f6]"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Jobs</span>
                  </motion.button>
                </Link>

                {/* Browse Companies Button */}
                <Link href="/companies" className="flex-1 max-w-xs">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-[#166534] hover:bg-[#0d4620] text-white font-bold text-base h-14 px-6 rounded-lg transition-colors duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg border border-[#1e7741]"
                  >
                    <Store className="w-4 h-4" />
                    <span>Browse Companies</span>
                  </motion.button>
                </Link>
              </div>
            </motion.div>

            {/* Email Contact */}
            <motion.div variants={item} className="pt-12">
              <motion.a 
                href={gmailUrl}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -2 }}
                className="inline-flex items-center gap-4 text-gray-500 hover:text-saffron transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-center group-hover:border-saffron/30 group-hover:bg-saffron/5 transition-all">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-[0.2em] font-bold opacity-50">Support & Feedback</div>
                  <div className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">
                    abhiajjers@gmail.com
                  </div>
                </div>
              </motion.a>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Suspense fallback={null}>
        <GhostAssistant />
      </Suspense>
    </div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
