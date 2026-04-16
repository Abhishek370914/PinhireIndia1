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
      "glass p-10 rounded-[32px] border border-white/10 relative group transition-all duration-500",
      "before:absolute before:inset-0 before:rounded-[32px] before:p-[1px] before:bg-gradient-to-b before:from-white/20 before:to-transparent before:-z-10"
    )}
  >
    <div className={`w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center mb-6 mx-auto group-hover:bg-white/10 transition-colors shadow-inner ${stat.glow}`}>
      <stat.icon className={`w-7 h-7 ${stat.color}`} />
    </div>
    <div className="text-5xl font-display font-900 mb-2 tracking-tighter">
      <Counter value={stat.value} suffix={stat.suffix} />
    </div>
    <div className="text-[11px] text-gray-500 uppercase tracking-[0.2em] font-800">{stat.label}</div>
    
    <div className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-saffron/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                <span className="bg-gradient-to-r from-saffron via-[#FF8C00] to-[#FF0080] bg-clip-text text-transparent drop-shadow-sm">
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

            {/* Premium CTAs */}
            <motion.div variants={item} className="flex flex-col items-center justify-center gap-8 pt-4 w-full">
              {/* Featured Pin Your Impact Button */}
              <Link href="/pin-your-impact" className="w-full">
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={{ hover: { y: -8 }, tap: { y: -2 } }}
                  className="relative group cursor-pointer max-w-2xl mx-auto"
                >
                  {/* Ultra Premium Multi-Layer Glow */}
                  <motion.div 
                    className="absolute -inset-2 bg-gradient-to-r from-green-400 via-blue-500 to-cyan-400 rounded-3xl blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500 -z-10"
                    animate={{ scale: [1, 1.08, 1], rotate: [0, 2, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-green-500/40 via-blue-500/40 to-cyan-500/40 rounded-3xl blur-xl opacity-60 group-hover:opacity-90 -z-10"
                    animate={{ scale: [1, 1.04, 1], rotate: [0, -1, 0] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                  />

                  <Button 
                    className="relative w-full bg-gradient-to-r from-green-600 via-blue-600 to-cyan-600 hover:from-green-500 hover:via-blue-500 hover:to-cyan-500 text-white font-900 text-2xl h-24 rounded-3xl shadow-[0_30px_80px_rgba(16,185,129,0.35)] overflow-hidden border-2 border-green-400/40 hover:border-green-300/80 transition-all duration-300 group flex items-center justify-center gap-4"
                  >
                    {/* Premium Shimmer Effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full"
                      animate={{ x: '150%' }}
                      transition={{ duration: 1.2, repeat: Infinity }}
                    />

                    {/* Animated Corner Orbs */}
                    <motion.div
                      className="absolute top-4 left-6 w-3 h-3 bg-green-300 rounded-full filter blur-sm"
                      animate={{ y: [0, -15, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-5 right-8 w-2 h-2 bg-cyan-300 rounded-full filter blur-sm"
                      animate={{ y: [0, 15, 0], opacity: [0.3, 1, 0.3], scale: [1, 1.3, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                    />
                    <motion.div
                      className="absolute top-1/2 right-4 w-2 h-2 bg-blue-300 rounded-full filter blur-sm"
                      animate={{ x: [0, 12, 0], opacity: [0.2, 0.8, 0.2], scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                    />

                    {/* Content with Icons */}
                    <span className="relative z-10 flex items-center gap-4 group-hover:gap-5 transition-all duration-300">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="flex-shrink-0"
                      >
                        <Sparkles className="w-7 h-7" />
                      </motion.div>
                      <div className="flex flex-col items-start gap-1">
                        <span className="text-xs font-bold opacity-90 uppercase tracking-widest">AI-Powered Matching</span>
                        <span className="text-2xl font-black">Pin Your Impact</span>
                      </div>
                      <motion.div
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex-shrink-0 ml-2"
                      >
                        <ArrowRight className="w-6 h-6" />
                      </motion.div>
                    </span>

                    {/* Bottom Glow Line */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.5 }}
                    />
                  </Button>
                </motion.div>
              </Link>

              {/* Secondary CTA Row */}
              <motion.div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full">
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  className="relative"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-saffron to-[#FF0080] blur-2xl rounded-3xl -z-10 opacity-30" />
                  
                  <Button 
                    onClick={handleExploreClick}
                    className="bg-gradient-to-r from-saffron to-[#FF0080] hover:from-saffron hover:to-[#FF0080] text-white font-900 text-xl h-20 px-14 rounded-3xl gap-4 shadow-[0_20px_50px_rgba(255,107,0,0.2)] group relative overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center gap-3">
                      Explore Map
                      <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full"
                      variants={{ hover: { x: '100%', transition: { duration: 0.6 } } }}
                    />
                  </Button>
                </motion.div>
              </motion.div>

              {/* Remote Jobs Button - Advanced Animated */}
              <Link href="/remote-jobs">
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={{ hover: { y: -6 }, tap: { y: -2 } }}
                  className="relative group cursor-pointer"
                >
                  {/* Premium Glow Effect */}
                  <motion.div 
                    className="absolute -inset-1 bg-gradient-to-r from-green-500 via-blue-500 to-cyan-500 rounded-3xl blur-xl opacity-40 group-hover:opacity-70 transition-opacity duration-500 -z-10"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-30 group-hover:opacity-60 -z-10"
                    animate={{ scale: [1, 1.02, 1], rotate: [0, 1, 0] }}
                    transition={{ duration: 3, repeat: Infinity }}
                  />

                  <Button 
                    className="relative bg-gradient-to-br from-green-600 via-blue-600 to-cyan-600 hover:from-green-500 hover:via-blue-500 hover:to-cyan-500 text-white font-900 text-xl h-20 px-14 rounded-3xl gap-3 shadow-[0_25px_60px_rgba(16,185,129,0.25)] overflow-hidden border border-green-400/30 hover:border-green-300/60 transition-all duration-300 group"
                  >
                    {/* Animated shimmer effect */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                      animate={{ x: '150%' }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                    />

                    {/* Floating particles */}
                    <motion.div
                      className="absolute top-2 left-4 w-2 h-2 bg-green-300 rounded-full"
                      animate={{ y: [0, -10, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute bottom-3 right-6 w-1.5 h-1.5 bg-cyan-300 rounded-full"
                      animate={{ y: [0, 10, 0], opacity: [0, 1, 0] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    />

                    {/* Button Content */}
                    <span className="relative z-10 flex items-center gap-3 group-hover:gap-4 transition-all duration-300">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="flex-shrink-0"
                      >
                        <Globe className="w-6 h-6" />
                      </motion.div>
                      Remote Jobs
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="flex-shrink-0"
                      >
                        <Zap className="w-5 h-5" />
                      </motion.div>
                    </span>

                    {/* Hover indicator */}
                    <motion.div
                      className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 rounded-full"
                      initial={{ width: 0 }}
                      whileHover={{ width: '100%' }}
                      transition={{ duration: 0.4 }}
                    />
                  </Button>
                </motion.div>
              </Link>

              <div className="flex flex-col sm:flex-row gap-4">
                {/* Find Jobs Button */}
                <Link href="/jobs">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{ hover: { y: -8 }, tap: { y: -2 } }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow Effect - Purple/Blue */}
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-65 transition-opacity duration-500 -z-10"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-red-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 -z-10"
                      animate={{ scale: [1, 1.03, 1], rotate: [0, 2, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity }}
                    />

                    <Button 
                      className="relative bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 hover:from-purple-500 hover:via-pink-500 hover:to-red-500 text-white font-bold text-lg h-16 px-10 rounded-2xl shadow-[0_20px_50px_rgba(168,85,247,0.2)] overflow-hidden border border-purple-400/40 hover:border-purple-300/70 transition-all duration-300 group min-w-[200px] flex items-center justify-center gap-3"
                    >
                      {/* Animated shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                        animate={{ x: '150%' }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.3 }}
                      />

                      {/* Floating dots */}
                      <motion.div
                        className="absolute top-3 right-4 w-1.5 h-1.5 bg-pink-300 rounded-full"
                        animate={{ y: [0, -12, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity }}
                      />
                      <motion.div
                        className="absolute bottom-2 left-3 w-1 h-1 bg-red-300 rounded-full"
                        animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: 0.5 }}
                      />

                      {/* Content with icon */}
                      <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <motion.div
                          animate={{ rotate: [-5, 5, -5], scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Search className="w-5 h-5" />
                        </motion.div>
                        Find Jobs
                      </span>

                      {/* Bottom animated line */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-purple-400 via-pink-400 to-red-400"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>
                </Link>

                {/* Browse Companies Button */}
                <Link href="/companies">
                  <motion.div
                    whileHover="hover"
                    whileTap="tap"
                    variants={{ hover: { y: -8 }, tap: { y: -2 } }}
                    className="relative group cursor-pointer"
                  >
                    {/* Glow Effect - Cyan/Teal */}
                    <motion.div 
                      className="absolute -inset-1 bg-gradient-to-r from-cyan-500 via-teal-500 to-green-500 rounded-2xl blur-lg opacity-40 group-hover:opacity-65 transition-opacity duration-500 -z-10"
                      animate={{ scale: [1, 1.06, 1] }}
                      transition={{ duration: 2.5, repeat: Infinity, delay: 0.3 }}
                    />
                    
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-cyan-500/20 via-teal-500/20 to-green-500/20 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 -z-10"
                      animate={{ scale: [1, 1.03, 1], rotate: [0, -2, 0] }}
                      transition={{ duration: 3.5, repeat: Infinity, delay: 0.2 }}
                    />

                    <Button 
                      className="relative bg-gradient-to-br from-cyan-600 via-teal-600 to-green-600 hover:from-cyan-500 hover:via-teal-500 hover:to-green-500 text-white font-bold text-lg h-16 px-10 rounded-2xl shadow-[0_20px_50px_rgba(34,211,238,0.2)] overflow-hidden border border-cyan-400/40 hover:border-cyan-300/70 transition-all duration-300 group min-w-[200px] flex items-center justify-center gap-3"
                    >
                      {/* Animated shimmer */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full"
                        animate={{ x: '150%' }}
                        transition={{ duration: 1.8, repeat: Infinity, delay: 0.6 }}
                      />

                      {/* Floating dots */}
                      <motion.div
                        className="absolute top-2 left-4 w-1.5 h-1.5 bg-cyan-300 rounded-full"
                        animate={{ y: [0, -12, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.div
                        className="absolute bottom-3 right-3 w-1 h-1 bg-green-300 rounded-full"
                        animate={{ y: [0, 12, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 2.8, repeat: Infinity, delay: 0.7 }}
                      />

                      {/* Content with icon */}
                      <span className="relative z-10 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                        <motion.div
                          animate={{ rotate: [5, -5, 5], scale: [1, 1.1, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: 0.2 }}
                        >
                          <Store className="w-5 h-5" />
                        </motion.div>
                        Browse Companies
                      </span>

                      {/* Bottom animated line */}
                      <motion.div
                        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-cyan-400 via-teal-400 to-green-400"
                        initial={{ width: 0 }}
                        whileHover={{ width: '100%' }}
                        transition={{ duration: 0.5 }}
                      />
                    </Button>
                  </motion.div>
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
