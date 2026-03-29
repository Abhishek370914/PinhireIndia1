"use client"

import dynamic from "next/dynamic"
import { Suspense, useMemo, useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Search, MapPin, RotateCcw, Map, ChevronDown, X } from "lucide-react"
import CityCompanySidebar from "@/components/map/CityCompanySidebar"
import { useMapStore } from "@/store/mapStore"
import { SEED_COMPANIES } from "@/lib/seed-companies"
import { SEED_JOBS } from "@/lib/seed-jobs"
import type { Company } from "@/types"
import { INDIA_CITIES } from "@/components/map/MapView"
const GhostAssistant = dynamic(() => import("@/components/welcome/GhostAssistant"), { ssr: false })

const MapView = dynamic(() => import("@/components/map/MapView"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
          className="w-10 h-10 border-2 border-saffron/30 border-t-saffron rounded-full"
        />
        <span className="text-sm text-muted-foreground">Loading map of India…</span>
      </div>
    </div>
  ),
})

import { TOTAL_ACTIVE_ROLES } from "@/lib/data-indices"

const QUICK_CITIES = ["Bengaluru", "Mumbai", "Delhi", "Hyderabad", "Pune", "Chennai", "Gurugram", "Noida", "Ahmedabad"]

function ExploreContent() {
  const flyToCity = useMapStore(s => s.flyToCity)
  const currentCity = useMapStore(s => s.currentCity)
  const setFilters = useMapStore(s => s.setFilters)
  // No need to subscribe to all filters or selectedCompany here if not used in render logic

  const [searchQuery, setSearchQuery] = useState("")
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [isNavigating, setIsNavigating] = useState(false)
  const [navigatingTo, setNavigatingTo] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const allCompanies = SEED_COMPANIES as Company[]
  const totalRoles = TOTAL_ACTIVE_ROLES

  // City search suggestions
  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSuggestions([])
      return
    }
    const q = searchQuery.toLowerCase()
    const matches = Object.keys(INDIA_CITIES)
      .filter((k) => k !== "india" && k.includes(q))
      .map((k) => k.charAt(0).toUpperCase() + k.slice(1))
      .slice(0, 6)
    setSuggestions(matches)
  }, [searchQuery])

  const handleCityNavigate = (cityName: string) => {
    setIsNavigating(true)
    setNavigatingTo(cityName.charAt(0).toUpperCase() + cityName.slice(1))
    setSearchQuery("")
    setSuggestions([])
    setTimeout(() => {
      flyToCity?.(cityName)
      setTimeout(() => setIsNavigating(false), 2000)
    }, 100)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      handleCityNavigate(searchQuery.trim())
    }
  }

  const [isMounted, setIsMounted] = useState(false)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
      <div className="w-full h-[calc(100dvh-4rem)] bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
            className="w-10 h-10 border-2 border-saffron/30 border-t-saffron rounded-full"
          />
          <span className="text-sm text-muted-foreground">Initializing experience…</span>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100dvh-4rem)] overflow-hidden relative">
      {/* Animated navigation overlay */}
      <AnimatePresence>
        {isNavigating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 z-50 pointer-events-none flex flex-col items-center justify-center"
          >
            {/* Blur overlay */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
            {/* Card */}
            <motion.div
              initial={{ scale: 0.85, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.85, opacity: 0, y: -20 }}
              transition={{ type: "spring", stiffness: 300, damping: 28 }}
              className="relative z-10 flex flex-col items-center gap-4 glass border border-saffron/20 rounded-2xl px-10 py-8 shadow-2xl"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                className="w-10 h-10 border-2 border-saffron/30 border-t-saffron rounded-full"
              />
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">Navigating to</p>
                <p className="font-display font-bold text-2xl gradient-saffron">{navigatingTo}</p>
              </div>
              {/* Moving dots */}
              <div className="flex gap-1.5">
                {[0, 1, 2].map((i) => (
                  <motion.div key={i} className="w-1.5 h-1.5 rounded-full bg-saffron"
                    animate={{ y: [0, -6, 0] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Left: Map + Top bar */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        {/* Top bar */}
        <div className="absolute top-0 left-0 right-0 z-20 px-3 py-2.5 flex items-center gap-2">
          {/* Stats chip */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-3 py-1.5 glass border border-white/10 rounded-xl text-xs text-muted-foreground whitespace-nowrap"
          >
            <Map className="w-3.5 h-3.5 text-saffron" />
            <span className="font-semibold text-foreground">{allCompanies.length}</span> companies &nbsp;|&nbsp;
            <span className="font-semibold text-saffron">{totalRoles}</span> roles
          </motion.div>

          {/* City search */}
          <div className="flex-1 max-w-md relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                <input
                  ref={inputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search a city (e.g. Bengaluru, Pune)…"
                  className="w-full pl-9 pr-9 py-2 rounded-xl glass border border-white/15 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-saffron/50 hover:border-white/25 transition-colors"
                />
                {searchQuery && (
                  <button type="button" onClick={() => { setSearchQuery(""); setSuggestions([]) }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </form>

            {/* Autocomplete suggestions */}
            <AnimatePresence>
              {suggestions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  className="absolute top-full mt-1.5 left-0 right-0 glass border border-white/10 rounded-xl overflow-hidden z-30 shadow-xl"
                >
                  {suggestions.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityNavigate(city)}
                      className="w-full flex items-center gap-2 px-3 py-2 text-sm text-left hover:bg-saffron/10 hover:text-saffron transition-colors"
                    >
                      <MapPin className="w-3.5 h-3.5 text-saffron shrink-0" />
                      {city}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Reset to India view */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleCityNavigate("india")}
            className="p-2 rounded-xl glass border border-white/10 text-muted-foreground hover:text-saffron hover:border-saffron/30 transition-all"
            title="Zoom out to all India"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </motion.button>
        </div>

        {/* Quick city pills — below top bar */}
        <div className="absolute top-12 left-3 z-20 flex gap-1.5 flex-wrap max-w-[calc(100%-5rem)]">
          {QUICK_CITIES.map((city, i) => (
            <motion.button
              key={city}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.04 }}
              onClick={() => handleCityNavigate(city)}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer ${
                currentCity?.toLowerCase() === city.toLowerCase()
                  ? "bg-saffron text-white border-saffron glow-saffron"
                  : "glass border-white/15 text-muted-foreground hover:text-saffron hover:border-saffron/40"
              }`}
            >
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              {city}
            </motion.button>
          ))}
        </div>

        {/* Full-screen Map */}
        <div className="flex-1 relative pt-0">
          <MapView companies={allCompanies} />
        </div>
      </div>

      {/* Right: City Company Sidebar */}
      <CityCompanySidebar />

      {/* Floating Ghost Assistant */}
      <GhostAssistant />
    </div>
  )
}

export default function ExplorePage() {
  return (
    <Suspense>
      <ExploreContent />
    </Suspense>
  )
}
