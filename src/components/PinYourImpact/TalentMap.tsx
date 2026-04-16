'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MapPin, Briefcase, Globe, Share2 } from 'lucide-react'
import type { MatchedCompany } from './PinYourImpact'

export default function TalentMap({ companies, userProfile, onViewGlobe }: { companies: MatchedCompany[]; userProfile: any; onViewGlobe?: () => void }) {
  const [selectedCompany, setSelectedCompany] = useState<MatchedCompany | null>(companies[0] || null)
  const [pinnedLocations, setPinnedLocations] = useState<string[]>([])

  // Simulate map interactions
  useEffect(() => {
    if (companies.length > 0) {
      setSelectedCompany(companies[0])
    }
  }, [companies])

  const handlePinLocation = (companyName: string) => {
    setPinnedLocations(prev =>
      prev.includes(companyName) ? prev.filter(c => c !== companyName) : [...prev, companyName]
    )
  }

  const shareProfile = () => {
    const profileText = `Check out my Rare Earth Talent Profile! I'm interested in: ${userProfile.interests} at companies like ${companies.map(c => c.name).join(', ')}.`
    navigator.clipboard.writeText(profileText)
    alert('Profile link copied to clipboard!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-900 to-black px-4 py-12">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-12 text-center">
          <h1 className="text-5xl font-black text-white mb-4">
            Your Global Talent Map
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-500 mt-2">
              500+ Companies, 2000+ Opportunities
            </span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            Visualize where your impact can matter most. Pin companies you want to work with.
          </p>
        </motion.div>

        {/* Main Map Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Container (Left/Top) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            <div className="relative h-96 lg:h-[600px] bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-white/10 overflow-hidden">
              {/* Stylized World Map (ASCII/Grid style) */}
              <div className="absolute inset-0 opacity-20 bg-[url('data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%22100%22%20height%3D%22100%22%3E%3Cline%20x1%3D%220%22%20y1%3D%2250%22%20x2%3D%22100%22%20y2%3D%2250%22%20stroke%3D%22%23fff%22%20opacity%3D%220.1%22/%3E%3Cline%20x1%3D%2250%22%20y1%3D%220%22%20x2%3D%2250%22%20y2%3D%22100%22%20stroke%3D%22%23fff%22%20opacity%3D%220.1%22/%3E%3C/svg%3E')] bg-repeat"></div>

              {/* Company Pins */}
              <div className="absolute inset-0 flex items-center justify-center">
                {companies.map((company, idx) => {
                  const angle = (idx / companies.length) * Math.PI * 2
                  const radius = 35
                  const x = 50 + radius * Math.cos(angle)
                  const y = 50 + radius * Math.sin(angle)

                  return (
                    <motion.button
                      key={company.id}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      onClick={() => setSelectedCompany(company)}
                      className={`absolute flex items-center justify-center transition-all cursor-pointer group`}
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    >
                      {/* Pin Glow */}
                      <motion.div
                        animate={{ scale: selectedCompany?.id === company.id ? [1, 1.3, 1] : 1 }}
                        transition={{ duration: 0.6, repeat: selectedCompany?.id === company.id ? Infinity : 0 }}
                        className={`absolute w-12 h-12 rounded-full ${
                          selectedCompany?.id === company.id
                            ? 'bg-green-500/30'
                            : 'bg-blue-500/20'
                        }`}
                      />

                      {/* Pin Icon */}
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className={`relative z-10 p-2 rounded-full ${
                          selectedCompany?.id === company.id
                            ? 'bg-green-500 text-white'
                            : 'bg-blue-500 text-white group-hover:bg-blue-600'
                        } transition-colors`}
                      >
                        <MapPin className="w-5 h-5" />
                      </motion.div>

                      {/* Pin Label */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{
                          opacity: selectedCompany?.id === company.id ? 1 : 0,
                          y: selectedCompany?.id === company.id ? -40 : -30,
                        }}
                        className="absolute whitespace-nowrap bg-white/10 backdrop-blur px-3 py-2 rounded-lg text-xs text-white border border-white/20 pointer-events-none"
                      >
                        {company.name}
                      </motion.div>
                    </motion.button>
                  )
                })}
              </div>

              {/* Map Info */}
              <div className="absolute bottom-4 left-4 bg-black/50 backdrop-blur px-4 py-2 rounded-lg text-xs text-gray-300 border border-white/10">
                <Globe className="w-4 h-4 inline mr-2" />
                Interactive Map • {companies.length} Recommended Companies
              </div>
            </div>
          </motion.div>

          {/* Sidebar - Company Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
            <div className="sticky top-8 space-y-4">
              {selectedCompany && (
                <motion.div
                  key={selectedCompany.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-gradient-to-b from-white/10 to-white/5 border border-white/20 rounded-xl p-6 backdrop-blur"
                >
                  {/* Company Header */}
                  <div className="mb-6">
                    <h3 className="text-2xl font-black text-white mb-2">{selectedCompany.name}</h3>
                    <p className="text-sm text-gray-400 mb-4">{selectedCompany.focus}</p>

                    {/* Impact Badge */}
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      className="p-3 bg-green-500/20 border border-green-500/50 rounded-lg mb-4"
                    >
                      <p className="text-sm text-green-200 font-semibold">{selectedCompany.impactMessage}</p>
                    </motion.div>
                  </div>

                  {/* Job Openings */}
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Available Roles
                    </h4>
                    <div className="space-y-2">
                      {selectedCompany.jobs.map((job, idx) => (
                        <motion.a
                          key={idx}
                          href={job.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          whileHover={{ x: 4 }}
                          className="block p-3 rounded-lg bg-white/5 border border-white/10 hover:border-blue-500/50 transition-all group"
                        >
                          <p className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                            {job.title}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs text-gray-500">{job.description}</span>
                            {job.isRemote && (
                              <span className="px-2 py-1 bg-green-500/20 text-green-300 text-xs rounded font-semibold">
                                Remote
                              </span>
                            )}
                          </div>
                        </motion.a>
                      ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <motion.button
                      onClick={() => handlePinLocation(selectedCompany.name)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-full py-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
                        pinnedLocations.includes(selectedCompany.name)
                          ? 'bg-green-500/20 border border-green-500/50 text-green-300'
                          : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                      }`}
                    >
                      <MapPin className="w-4 h-4" />
                      {pinnedLocations.includes(selectedCompany.name) ? 'Pinned!' : 'Pin Company'}
                    </motion.button>

                    <motion.button
                      onClick={shareProfile}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-full py-3 rounded-lg font-semibold bg-blue-500/20 border border-blue-500/50 text-blue-300 hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-4 h-4" />
                      Share Profile
                    </motion.button>

                    {onViewGlobe && (
                      <motion.button
                        onClick={onViewGlobe}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="w-full py-3 rounded-lg font-semibold bg-cyan-500/20 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-500/30 transition-all flex items-center justify-center gap-2"
                      >
                        <motion.div animate={{ rotate: 360 }} transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}>
                          <Globe className="w-4 h-4" />
                        </motion.div>
                        Explore on 3D Globe
                      </motion.button>
                    )}
                  </div>

                  {/* Pin Count */}
                  {pinnedLocations.length > 0 && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-white/5 rounded-lg border border-white/10">
                      <p className="text-xs text-gray-400">
                        <span className="font-bold text-white">{pinnedLocations.length}</span> companies pinned
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              )}

              {/* Company List */}
              <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto">
                <h4 className="text-sm font-bold text-white mb-3">Top Matches</h4>
                <div className="space-y-2">
                  {companies.map((company, idx) => (
                    <motion.button
                      key={company.id}
                      onClick={() => setSelectedCompany(company)}
                      whileHover={{ x: 4 }}
                      className={`w-full text-left p-3 rounded-lg transition-all border ${
                        selectedCompany?.id === company.id
                          ? 'bg-green-500/20 border-green-500/50'
                          : 'bg-white/5 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <p className="text-sm font-semibold text-white truncate">#{idx + 1} {company.name}</p>
                      <p className="text-xs text-gray-400 truncate mt-1">{company.focus}</p>
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-gray-400 mb-4">Ready to make your impact?</p>
          <motion.a
            href="#"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-lg hover:from-green-500 hover:to-blue-500 transition-all"
          >
            Apply to Pinned Companies →
          </motion.a>
        </motion.div>
      </div>
    </div>
  )
}
