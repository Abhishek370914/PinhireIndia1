'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Globe from 'react-globe.gl'
import { MapPin, Briefcase, X, Loader } from 'lucide-react'
import { SEED_COMPANIES } from '@/lib/seed-companies'
import { SEED_JOBS } from '@/lib/seed-jobs'

interface GeoLocation {
  latitude: number
  longitude: number
  country?: string
}

interface NearbyCompany extends Partial<typeof SEED_COMPANIES[0]> {
  distance: number
  jobs: any[]
}

export default function GlobeExplorer({ onClose }: { onClose?: () => void }) {
  const globeEl = useRef<any>(null)
  const [userLocation, setUserLocation] = useState<GeoLocation | null>(null)
  const [nearbyCompanies, setNearbyCompanies] = useState<NearbyCompany[]>([])
  const [loading, setLoading] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [selectedCompany, setSelectedCompany] = useState<any>(null)
  const [hoveredPin, setHoveredPin] = useState<string | null>(null)

  // Calculate distance between two coordinates (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371 // Earth's radius in km
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
  }

  // Request user location
  const handleExploreNearMe = () => {
    setLoading(true)
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const { latitude, longitude } = position.coords
          setUserLocation({ latitude, longitude })
          setHasPermission(true)

          // Find nearby companies (within 5000 km radius)
          const companies = (SEED_COMPANIES as any[])
            .map(company => {
              const distance = calculateDistance(latitude, longitude, company.lat, company.lng)
              return { ...company, distance }
            })
            .filter(company => company.distance <= 5000)
            .sort((a, b) => a.distance - b.distance)
            .slice(0, 20) // Top 20 nearest companies

          // Add job info for each company
          const companiesWithJobs = companies.map(company => {
            const jobsForCompany = (SEED_JOBS as any[])
              .filter(job => job.company_id === company.id)
              .slice(0, 2)
            return { ...company, jobs: jobsForCompany }
          })

          setNearbyCompanies(companiesWithJobs)
          setLoading(false)

          // Smooth camera animation to user location
          setTimeout(() => {
            if (globeEl.current) {
              globeEl.current.pointOfView({
                lat: latitude,
                lng: longitude,
                altitude: 2.5,
              }, 1200)
            }
          }, 500)
        },
        error => {
          console.error('Geolocation error:', error)
          setHasPermission(false)
          setLoading(false)
        }
      )
    } else {
      alert('Geolocation is not supported by your browser')
      setHasPermission(false)
      setLoading(false)
    }
  }

  // Prepare data for globe pins
  const pinData = [
    ...(userLocation ? [{ lat: userLocation.latitude, lng: userLocation.longitude, type: 'user' }] : []),
    ...nearbyCompanies.map(company => ({
      lat: company.lat,
      lng: company.lng,
      type: 'company',
      company,
    })),
  ]

  const pinAltitude = (d: any) => {
    return d.type === 'user' ? 0.3 : 0.15
  }

  const pinColor = (d: any) => {
    return d.type === 'user' ? '#16a34a' : '#1e40af'
  }

  const pinRadius = (d: any) => {
    return d.type === 'user' ? 0.12 : 0.08
  }

  return (
    <div className="w-full h-screen relative bg-black overflow-hidden">
      {/* 3D Globe */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="w-full h-full"
      >
        <Globe
          ref={globeEl}
          globeImageUrl="//cdn.jsdelivr.net/npm/three-globe/example/img/earth-night.jpg"
          backgroundColor="rgba(0,0,0,1)"
          showAtmosphere={true}
          atmosphereColor="#ffffff"
          atmosphereAltitude={0.15}
          pointsData={pinData}
          pointAltitude={pinAltitude}
          pointColor={pinColor}
          pointRadius={pinRadius}
          pointLabel={(d: any) => `<div style="color:#fff;font-weight:bold">${d.type === 'user' ? 'Your Location' : d.company?.name}</div>`}
          onPointHover={(point: any) => {
            if (point?.company) {
              setHoveredPin(point.company.id)
              setSelectedCompany(point.company)
            } else {
              setHoveredPin(null)
              if (!selectedCompany) setSelectedCompany(null)
            }
          }}
          pointsMerge={true}
        />
      </motion.div>

      {/* Loading Indicator */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur z-40"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
              className="mb-4 flex justify-center"
            >
              <Loader className="w-8 h-8 text-green-500" />
            </motion.div>
            <p className="text-white font-semibold">Finding your location...</p>
          </div>
        </motion.div>
      )}

      {/* Top Control Bar */}
      <motion.div
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="absolute top-0 left-0 right-0 p-4 z-30 bg-linear-to-b from-black/80 to-transparent"
      >
        <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
          <div>
            <h2 className="text-3xl font-black text-white">
              🌍 Globe Explorer
              <span className="block text-lg text-green-400 font-semibold mt-1">
                {nearbyCompanies.length > 0 ? `${nearbyCompanies.length} Companies Near You` : 'Discover Companies'}
              </span>
            </h2>
          </div>

          {!userLocation && !loading && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleExploreNearMe}
              className="px-6 py-3 bg-linear-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-2xl shadow-lg transition-all flex items-center gap-2 whitespace-nowrap"
            >
              <MapPin className="w-5 h-5" />
              Explore Companies Near Me
            </motion.button>
          )}

          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-all"
            >
              <X className="w-6 h-6" />
            </motion.button>
          )}
        </div>
      </motion.div>

      {/* Right Sidebar - Company Details */}
      {selectedCompany && (
        <motion.div
          initial={{ x: 400, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 400, opacity: 0 }}
          className="absolute right-0 top-0 bottom-0 w-96 bg-linear-to-b from-slate-900/95 to-black/95 border-l border-white/10 overflow-y-auto z-20 p-6 backdrop-blur"
        >
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            onClick={() => setSelectedCompany(null)}
            className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400"
          >
            <X className="w-5 h-5" />
          </motion.button>

          <div className="space-y-6 pt-8">
            {/* Company Header */}
            <div>
              <div className="flex items-start gap-4 mb-4">
                <div className="w-16 h-16 rounded-xl bg-linear-to-br from-blue-500 to-blue-700 flex items-center justify-center shrink-0">
                  <span className="text-white font-bold text-lg">
                    {selectedCompany.name?.[0]?.toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-black text-white">{selectedCompany.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    <span className="text-green-400 font-semibold">
                      {(selectedCompany.distance || 0).toFixed(0)} km away
                    </span>
                  </p>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="text-gray-300">
                  <span className="text-gray-500">Location:</span> {selectedCompany.city}, {selectedCompany.state}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Industry:</span> {selectedCompany.industry}
                </p>
                <p className="text-gray-300">
                  <span className="text-gray-500">Size:</span> {selectedCompany.company_size}
                </p>
              </div>
            </div>

            {/* Description */}
            {selectedCompany.description && (
              <div className="p-4 rounded-lg bg-white/5 border border-white/10">
                <p className="text-sm text-gray-300">{selectedCompany.description}</p>
              </div>
            )}

            {/* Job Openings */}
            {selectedCompany.jobs && selectedCompany.jobs.length > 0 && (
              <div>
                <h4 className="font-bold text-white mb-3 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-blue-400" />
                  Remote Job Openings
                </h4>
                <div className="space-y-3">
                  {selectedCompany.jobs.map((job: any, idx: number) => (
                    <motion.a
                      key={idx}
                      href={selectedCompany.career_page_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ x: 4 }}
                      className="block p-4 rounded-lg bg-blue-500/10 border border-blue-400/30 hover:border-blue-400/60 transition-all group"
                    >
                      <p className="font-semibold text-white group-hover:text-blue-300 transition-colors">
                        {job.title || 'Position Available'}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {job.description || 'Exciting remote opportunity'}
                      </p>
                      <div className="flex items-center gap-2 mt-3">
                        <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded font-semibold">
                          Remote
                        </span>
                        <span className="text-xs text-blue-300">→ Apply Now</span>
                      </div>
                    </motion.a>
                  ))}
                </div>
              </div>
            )}

            {/* Visit Website Button */}
            <motion.a
              href={selectedCompany.website}
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.05 }}
              className="block w-full p-3 text-center bg-linear-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold rounded-lg transition-all"
            >
              Visit Company Website →
            </motion.a>
          </div>
        </motion.div>
      )}

      {/* Bottom Info Card */}
      {hasPermission === false && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-6 right-6 max-w-md p-4 bg-red-500/20 border border-red-400/50 rounded-xl backdrop-blur"
        >
          <p className="text-red-200">
            Location access denied. Please enable location permissions in your browser settings to find nearby companies.
          </p>
        </motion.div>
      )}

      {/* Instructions */}
      {!userLocation && !loading && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute bottom-6 left-6 right-6 max-w-md p-4 bg-blue-500/20 border border-blue-400/50 rounded-xl backdrop-blur"
        >
          <p className="text-blue-200 text-sm">
            💡 <strong>Tip:</strong> Click "Explore Companies Near Me" to enable location and discover companies within 5000 km of your location.
          </p>
        </motion.div>
      )}
    </div>
  )
}
