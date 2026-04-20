'use client'

import { useState, useRef, useMemo, useCallback, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { MapPin, X, ExternalLink, Loader, Navigation, Menu } from 'lucide-react'
import { SEED_COMPANIES } from '@/lib/seed-companies'

// Dynamic import for SSR safety with realistic Earth textures
const Globe = dynamic(() => import('react-globe.gl'), { ssr: false })

// Realistic Earth textures
const EARTH_IMAGE = 'https://unpkg.com/three-globe/example/img/earth-night.jpg'
const CLOUDS_IMAGE = 'https://unpkg.com/three-globe/example/img/earth-clouds.png'

interface CompanyPin {
  id: string
  name: string
  lat: number
  lng: number
  focus: string
  jobs: Array<{ title: string; link: string }>
  impactMessage: string
  city?: string
  state?: string
}

interface UserLocation {
  lat: number
  lng: number
}


// Skeleton loader for globe loading state
const GlobeSkeleton = () => (
  <div className="w-full h-full bg-linear-to-b from-[#0f172a] to-[#111827] flex items-center justify-center">
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
      className="w-24 h-24 border-4 border-[#1e40af]/30 border-t-[#1e40af] rounded-full"
    />
  </div>
)

export default function TalentMap({ companies, userProfile, onViewGlobe }: { companies?: any[]; userProfile?: any; onViewGlobe?: () => void }) {
  const globeRef = useRef<any>(null)
  const [selectedPin, setSelectedPin] = useState<CompanyPin | null>(null)
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null)
  const [isLoadingLocation, setIsLoadingLocation] = useState(false)
  const [nearbyCompanies, setNearbyCompanies] = useState<CompanyPin[]>([])
  const [showNearbyOnly, setShowNearbyOnly] = useState(false)

  // Parse company data to pins with memoization
  const allCompanyPins = useMemo(() => {
    return SEED_COMPANIES.slice(0, 300).map((company: any) => ({
      id: company.id,
      name: company.name,
      lat: company.latitude,
      lng: company.longitude,
      focus: company.focus_area || 'Strategic Industries',
      jobs: [
        {
          title: company.job_title || 'Career Opportunity',
          link: company.career_url || '#',
        },
      ],
      impactMessage: `${company.name} is creating impact in rare earth materials and strategic minerals.`,
      city: company.city,
      state: company.state,
    }))
  }, [])

  // Haversine formula for distance calculation
  const calculateDistance = useCallback((lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 6371 // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }, [])

  // Request user location and filter nearby companies
  const handleFindNearby = useCallback(() => {
    setIsLoadingLocation(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserLocation({ lat: latitude, lng: longitude })

        // Fly to user location with smooth animation
        if (globeRef.current) {
          globeRef.current.pointOfView({ lat: latitude, lng: longitude, altitude: 0.3 }, 1500)
        }

        // Find nearby companies within 100km radius
        const nearby = allCompanyPins.filter(
          (pin) => calculateDistance(latitude, longitude, pin.lat, pin.lng) <= 100
        )
        setNearbyCompanies(nearby)
        setShowNearbyOnly(true)
        setIsLoadingLocation(false)
      },
      () => {
        setIsLoadingLocation(false)
        alert('Unable to get location. Please enable location services.')
      },
      { timeout: 10000, enableHighAccuracy: false }
    )
  }, [allCompanyPins, calculateDistance])

  // Handle pin click with camera animation
  const handlePinClick = useCallback((pin: CompanyPin) => {
    setSelectedPin(pin)
    if (globeRef.current) {
      globeRef.current.pointOfView({ lat: pin.lat, lng: pin.lng, altitude: 0.4 }, 1000)
    }
  }, [])

  // Determine which pins to display
  const visiblePins = showNearbyOnly ? nearbyCompanies : allCompanyPins
  const pinData = visiblePins.map((pin) => ({
    lat: pin.lat,
    lng: pin.lng,
    size: 0.8,
    color: '#1e40af',
    id: pin.id,
  }))

  // Initialize globe view
  useEffect(() => {
    if (globeRef.current) {
      setTimeout(() => {
        globeRef.current?.pointOfView({ lat: 20, lng: 78.5, altitude: 2.5 }, 1000)
      }, 500)
    }
  }, [])

  return (
    <div className="min-h-screen bg-linear-to-b from-[#0f172a] via-[#030712] to-[#0f172a] relative overflow-hidden">
      {/* Background Grid Pattern */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-900/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-900/10 rounded-full blur-3xl" />
      </div>

      {/* Professional Header */}
      <header className="relative z-20 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-linear-to-br from-[#16a34a] to-[#1e40af] flex items-center justify-center text-white font-bold text-lg">
              📍
            </div>
            <div>
              <h1 className="text-xl font-black text-white">Project Pin IRE India</h1>
              <p className="text-xs text-gray-400">IREL's National Rare Earth Permanent Magnet Mission</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <a href="#" className="text-gray-300 hover:text-white transition text-sm font-medium">
              About
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Locations
            </a>
            <a href="#" className="text-gray-300 hover:text-white transition text-sm font-medium">
              Resources
            </a>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-4 py-2 rounded-lg bg-[#166534] hover:bg-[#0d4620] text-white text-sm font-bold transition-colors border border-[#1e7741]"
            >
              Login
            </motion.button>
          </nav>

          {/* Mobile Menu */}
          <button className="md:hidden p-2 hover:bg-white/10 rounded-lg transition">
            <Menu className="w-5 h-5 text-gray-300" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative z-10 min-h-[calc(100vh-80px)] flex">
        {/* Globe Container */}
        <div className="flex-1 relative">
          {typeof window !== 'undefined' ? (
            <>
              <Globe
                ref={globeRef}
                globeImageUrl={EARTH_IMAGE}
                bumpImageUrl={CLOUDS_IMAGE}
                pointsData={pinData}
                pointColor={() => '#1e40af'}
                pointAltitude={() => 0.01}
                onPointClick={(point: any) => {
                  const pin = visiblePins.find((p) => p.id === point.id)
                  if (pin) handlePinClick(pin)
                }}
                polygonsData={[
                  {
                    type: 'Feature',
                    properties: { name: 'India' },
                    geometry: {
                      type: 'Polygon',
                      coordinates: [
                        [
                          [68.1766451354, 7.9539316988],
                          [97.395561842, 7.9539316988],
                          [97.395561842, 35.5176651563],
                          [68.1766451354, 35.5176651563],
                          [68.1766451354, 7.9539316988],
                        ],
                      ],
                    },
                  },
                ]}
                polygonCapColor={() => 'rgba(22, 163, 74, 0.3)'}
                polygonSideColor={() => 'rgba(22, 163, 74, 0.8)'}
                polygonStrokeColor={() => '#16a34a'}
              />
            </>
          ) : (
            <GlobeSkeleton />
          )}

          {/* Locate Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleFindNearby}
            disabled={isLoadingLocation}
            className="absolute top-6 right-6 px-6 py-3 bg-[#166534] hover:bg-[#0d4620] text-white font-bold rounded-lg shadow-lg transition-colors disabled:opacity-60 flex items-center gap-2 z-30 border border-[#1e7741]"
          >
            {isLoadingLocation ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span className="hidden sm:inline">Locating...</span>
              </>
            ) : (
              <>
                <Navigation className="w-4 h-4" />
                <span className="hidden sm:inline">Find Near Me</span>
              </>
            )}
          </motion.button>

          {/* Reset Button */}
          {showNearbyOnly && (
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowNearbyOnly(false)
                setNearbyCompanies([])
                setSelectedPin(null)
              }}
              className="absolute top-6 right-48 px-6 py-3 bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold rounded-lg shadow-lg transition-colors z-30 border border-[#3b82f6] hidden sm:flex items-center gap-2"
            >
              <span>View All</span>
            </motion.button>
          )}
        </div>

        {/* Right Sidebar - Company Card */}
        {selectedPin && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-96 bg-linear-to-b from-white/5 to-white/2 backdrop-blur-xl border-l border-white/10 p-6 flex flex-col gap-6 max-h-screen overflow-y-auto z-20"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedPin(null)}
              className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Company Header */}
            <div>
              <div className="w-12 h-12 rounded-lg bg-linear-to-br from-[#16a34a] to-[#1e40af] flex items-center justify-center text-white font-bold mb-4 text-lg">
                {selectedPin.name[0]}
              </div>
              <h3 className="text-2xl font-black text-white">{selectedPin.name}</h3>
              <p className="text-sm text-gray-400 mt-2">{selectedPin.focus}</p>
            </div>

            {/* Impact Message */}
            <p className="text-gray-300 italic text-sm">{selectedPin.impactMessage}</p>

            {/* Job Listings */}
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-gray-300 uppercase tracking-wider">Remote Opportunities</h4>
              {selectedPin.jobs.map((job, idx) => (
                <motion.a
                  key={idx}
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 4 }}
                  className="block p-4 rounded-lg bg-white/5 border border-white/10 hover:border-[#1e40af]/50 transition group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <p className="font-semibold text-white group-hover:text-[#16a34a] transition">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-1">🌍 Remote · Full-time</p>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-[#1e40af] transition shrink-0" />
                  </div>
                </motion.a>
              ))}
            </div>

            {/* Company Website Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 rounded-lg bg-linear-to-r from-[#166534] to-[#1e40af] hover:from-[#0d4620] hover:to-[#1e3a8a] text-white font-bold transition-all shadow-lg border border-[#1e7741]"
            >
              Visit Company
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* Bottom Explore Button */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleFindNearby}
          disabled={isLoadingLocation}
          className="px-8 py-4 rounded-lg bg-linear-to-r from-[#166534] to-[#1e40af] hover:from-[#0d4620] hover:to-[#1e3a8a] text-white font-bold text-lg shadow-2xl border border-[#1e7741] flex items-center gap-3 transition-all disabled:opacity-60"
        >
          <span className="text-2xl">🌍</span>
          <span>Explore Companies Near Me</span>
        </motion.button>
      </motion.div>
    </div>
  )
}
