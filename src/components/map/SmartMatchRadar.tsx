"use strict"
"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Radar, Sparkles, UserCircle2, X, CheckCircle2 } from "lucide-react"
import { useMapStore } from "@/store/mapStore"
import type { Company } from "@/types"
import { Button } from "@/components/ui/button"

const MOCK_REASONS = [
  "Strong alignment with your React/Node.js stack",
  "Matches your preferred Hybrid work model",
  "High growth potential matching your startup preference",
  "Salary range aligns with your current expectations",
  "Culture values align with your 'innovation' preference",
  "Located exactly in your preferred tech corridor",
  "Currently scaling their engineering team rapidly",
  "Matches your 3+ years of SaaS product experience"
]

export default function SmartMatchRadar() {
  const { visibleCompanies, isRadarActive, setIsRadarActive, setRadarMatches, setHoveredCompanyId } = useMapStore()
  const [isScanning, setIsScanning] = useState(false)
  const [showProfilePrompt, setShowProfilePrompt] = useState(false)

  const handleRadarClick = () => {
    if (isRadarActive) {
      // Turn off
      setIsRadarActive(false)
      setRadarMatches(null)
      return
    }

    // Since user isn't logged in, natively prompt them!
    setShowProfilePrompt(true)
  }

  const runAIScan = () => {
    setShowProfilePrompt(false)
    setIsScanning(true)

    // Simulate AI thinking delay
    setTimeout(() => {
      // Generate scores for all currently visible companies
      const matches: Record<string, { score: number; reasons: string[] }> = {}
      
      const scoredCompanies = visibleCompanies.map(c => {
        // Base score 65-98
        const score = Math.floor(65 + Math.random() * 34)
        const reasonCount = score > 85 ? 3 : 2
        const reasons = [...MOCK_REASONS]
          .sort(() => 0.5 - Math.random())
          .slice(0, reasonCount)
          
        return { id: c.id, score, reasons }
      }).sort((a, b) => b.score - a.score)

      // Take Top 8
      const top8 = scoredCompanies.slice(0, 8)
      top8.forEach(t => {
        matches[t.id] = { score: t.score, reasons: t.reasons }
      })

      setRadarMatches(matches)
      setIsScanning(false)
      setIsRadarActive(true)

      // Automatically fly to encapsulate the top results? 
      // Handled natively by user seeing them glow on the map!
    }, 2000)
  }

  return (
    <>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-40">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleRadarClick}
          className={\`relative flex items-center gap-2.5 px-6 py-3.5 rounded-full font-bold shadow-2xl transition-all \${
            isRadarActive 
              ? "bg-white text-saffron border-2 border-saffron" 
              : "bg-saffron text-white globe-glow-saffron border border-white/20"
          }\`}
        >
          {isRadarActive ? (
            <>
              <X className="w-5 h-5" />
              Clear Radar
            </>
          ) : isScanning ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                <Radar className="w-5 h-5" />
              </motion.div>
              Scanning Profile...
            </>
          ) : (
            <>
              <div className="relative">
                <Radar className="w-5 h-5" />
                <motion.div
                  className="absolute inset-0 rounded-full border border-white"
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                />
              </div>
              Smart Match Radar
              <Sparkles className="w-4 h-4 ml-1 opacity-80" />
            </>
          )}
        </motion.button>
      </div>

      {/* Profile Prompt Modal */}
      <AnimatePresence>
        {showProfilePrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative"
            >
              <button 
                onClick={() => setShowProfilePrompt(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-900"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-16 h-16 rounded-full bg-orange-50 flex items-center justify-center mb-6 mx-auto">
                <UserCircle2 className="w-8 h-8 text-saffron" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-center mb-2">Complete Your Profile</h2>
              <p className="text-gray-500 text-center text-sm mb-6">
                To use the Smart Match Radar, our AI needs to compare your skills, experience, and salary expectations against thousands of mapped companies.
              </p>
              
              <div className="space-y-3 mb-8">
                {["Upload your latest Resume", "Add 3 core technical skills", "Set salary expectations"].map((req, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm font-medium text-gray-700 bg-gray-50 p-3 rounded-xl border border-gray-100">
                    <CheckCircle2 className="w-4 h-4 text-gray-300" />
                    {req}
                  </div>
                ))}
              </div>
              
              <div className="flex flex-col gap-3">
                <Button 
                  onClick={() => setShowProfilePrompt(false)}
                  variant="outline"
                  className="w-full rounded-xl py-6 font-semibold"
                >
                  Edit Profile Manually
                </Button>
                <Button 
                  onClick={runAIScan}
                  className="w-full rounded-xl py-6 font-semibold bg-saffron hover:bg-saffron/90 glow-saffron gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Auto-Fill Mock Profile (Demo)
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
