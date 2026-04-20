'use client'

import { useState, lazy, Suspense } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight, MapPin, Users, Award, Zap, Globe, Landmark } from 'lucide-react'
import AIPathfinderForm from './AIPathfinderForm'
import TalentMap from './TalentMap'

const GlobeExplorer = lazy(() => import('./GlobeExplorer'))
const TalentPassport = lazy(() => import('../TalentPassport/TalentPassport'))

type View = 'hero' | 'quiz' | 'map' | 'results' | 'globe' | 'passport'

interface UserProfile {
  name: string
  skills: string[]
  experience: string
  interests: string
  location?: string
  impact?: string
}

export interface MatchedCompany {
  id: string
  name: string
  focus: string
  impactMessage: string
  jobs: Array<{
    title: string
    description: string
    link: string
    isRemote: boolean
  }>
}

export default function PinYourImpact() {
  const [view, setView] = useState<View>('hero')
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [matchedCompanies, setMatchedCompanies] = useState<MatchedCompany[]>([])
  const [participantCount, setParticipantCount] = useState(2847)

  const handleStartQuiz = () => {
    setView('quiz')
  }

  const handleQuizComplete = (profile: UserProfile, companies: MatchedCompany[]) => {
    // Ensure name is provided with fallback
    const normalizedProfile: UserProfile = {
      ...profile,
      name: profile.name || 'Talent Seeker'
    }
    setUserProfile(normalizedProfile)
    setMatchedCompanies(companies)
    setParticipantCount(prev => prev + 1)
    setView('results')
  }

  const handleViewMap = () => {
    setView('map')
  }

  const handleViewGlobe = () => {
    setView('globe')
  }

  const handleCloseGlobe = () => {
    setView('hero')
  }

  const handleViewPassport = () => {
    setView('passport')
  }

  const handleClosePassport = () => {
    setView('results')
  }

  const handleBackToResults = () => {
    setView('results')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {view === 'hero' && (
            <HeroSection key="hero" onStartQuiz={handleStartQuiz} onViewGlobe={handleViewGlobe} participantCount={participantCount} />
          )}

          {view === 'quiz' && (
            <AIPathfinderForm key="quiz" onComplete={handleQuizComplete} />
          )}

          {view === 'results' && userProfile && matchedCompanies.length > 0 && (
            <ResultsSection
              key="results"
              profile={userProfile}
              companies={matchedCompanies}
              onViewMap={handleViewMap}
              onViewGlobe={handleViewGlobe}
              onViewPassport={handleViewPassport}
              participantCount={participantCount}
            />
          )}

          {view === 'map' && userProfile && matchedCompanies.length > 0 && (
            <motion.div key="map" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <TalentMap companies={matchedCompanies} userProfile={userProfile} onViewGlobe={handleViewGlobe} />
            </motion.div>
          )}

          {view === 'globe' && (
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>}>
              <GlobeExplorer key="globe" onClose={handleCloseGlobe} />
            </Suspense>
          )}

          {view === 'passport' && userProfile && (
            <Suspense fallback={<div className="w-full h-screen flex items-center justify-center bg-black"><motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity }} className="w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full" /></div>}>
              <TalentPassport 
                key="passport"
                userProfile={userProfile}
                matchedCompanies={matchedCompanies}
                onClose={handleClosePassport}
              />
            </Suspense>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

function HeroSection({ onStartQuiz, onViewGlobe, participantCount }: { onStartQuiz: () => void; onViewGlobe: () => void; participantCount: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen flex flex-col items-center justify-center px-4 py-20"
    >
      <div className="text-center max-w-4xl">
        {/* Badge */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-400/30 mb-8"
        >
          <Sparkles className="w-4 h-4 text-green-400" />
          <span className="text-green-300 text-sm font-semibold">Project Pin IRE India</span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black mb-6 leading-tight"
        >
          <span className="bg-gradient-to-r from-green-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Pin Your Impact
          </span>
          <br />
          <span className="text-white">Accelerate India's Rare Earth Mission</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
        >
          Join {participantCount.toLocaleString()}+ global talents building IREL's Atmanirbhar Bharat vision. Get personalized job recommendations from our 500+ verified companies in 5 minutes.
        </motion.p>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          {[
            { icon: Users, label: 'Global Talents', value: `${participantCount}+` },
            { icon: Award, label: 'Companies', value: '500+' },
            { icon: Zap, label: 'Remote Roles', value: '2000+' },
          ].map((stat, i) => (
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="p-6 rounded-2xl bg-white/[0.02] border border-white/10 backdrop-blur-sm"
            >
              <stat.icon className="w-8 h-8 mx-auto mb-3 text-green-400" />
              <p className="text-gray-400 text-sm">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Primary CTA - Pin Your Impact */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.03, y: -4 }}
            whileTap={{ scale: 0.98 }}
            onClick={onStartQuiz}
            className="group w-full max-w-2xl mx-auto px-10 py-6 rounded-xl bg-[#166534] hover:bg-[#0d4620] text-white font-bold text-xl shadow-2xl transition-all border border-[#1e7741] flex flex-col items-center gap-2"
          >
            <span className="text-2xl">📍 Pin Your Impact</span>
            <span className="text-sm font-medium text-green-200">AI-Powered Matching</span>
          </motion.button>
        </motion.div>

        {/* Secondary Buttons Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="flex flex-col sm:flex-row gap-4 justify-center mb-8"
        >
          {/* Explore Map Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={onViewGlobe}
            className="px-8 py-4 rounded-lg bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold text-lg shadow-lg transition-all border border-[#3b82f6] flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            <span>🌍 Explore Map</span>
          </motion.button>

          {/* Remote Jobs Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/remote-jobs'}
            className="px-8 py-4 rounded-lg border-2 border-[#166534] hover:bg-[#166534]/10 text-[#166534] hover:text-white font-bold text-lg transition-all flex items-center justify-center gap-2"
          >
            <span>🌐 Remote Jobs Worldwide</span>
          </motion.button>
        </motion.div>

        {/* Bottom Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-4 max-w-lg mx-auto mb-8"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/remote-jobs'}
            className="px-6 py-3 rounded-lg bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold shadow-lg transition-all border border-[#3b82f6] flex items-center justify-center gap-2 text-sm"
          >
            <span>🔍 Find Jobs</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => window.location.href = '/companies'}
            className="px-6 py-3 rounded-lg bg-[#166534] hover:bg-[#0d4620] text-white font-bold shadow-lg transition-all border border-[#1e7741] flex items-center justify-center gap-2 text-sm"
          >
            <span>🏢 Browse Companies</span>
          </motion.button>
        </motion.div>

        {/* Info Text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="text-gray-400 text-sm"
        >
          Takes only 5 minutes • Completely free • No sign-up required
        </motion.p>
      </div>
    </motion.div>
  )
}

function ResultsSection({
  profile,
  companies,
  onViewMap,
  onViewGlobe,
  onViewPassport,
  participantCount,
}: {
  profile: UserProfile
  companies: MatchedCompany[]
  onViewMap: () => void
  onViewGlobe: () => void
  onViewPassport: () => void
  participantCount: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen px-4 py-16 md:py-20"
    >
      <div className="max-w-6xl mx-auto">
        {/* Results Header */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-6xl font-black mb-4">
            <span className="bg-linear-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Your Top 5 Impact Matches</span>
          </h2>
          <p className="text-gray-300 text-lg">
            Based on your {profile.skills?.join(', ')} expertise, here are the best-fit companies and current opportunities.
          </p>
        </motion.div>

        {/* Companies Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6 mb-12">
          {companies.map((company, index) => (
            <motion.div
              key={company.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 md:p-8 rounded-2xl bg-linear-to-br from-white/5 to-white/2 border border-white/10 hover:border-green-400/50 transition-all duration-300 backdrop-blur-sm"
            >
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                {/* Company Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-lg bg-linear-to-br from-green-500 to-blue-500 flex items-center justify-center text-white font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-white">{company.name}</h3>
                      <p className="text-sm text-gray-400">{company.focus}</p>
                    </div>
                  </div>

                  {/* Impact Message */}
                  <p className="text-gray-300 mb-4 italic">"{company.impactMessage}"</p>

                  {/* Job Openings */}
                  <div className="space-y-2">
                    {company.jobs.map((job, jobIndex) => (
                      <motion.a
                        key={jobIndex}
                        href={job.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ x: 4 }}
                        className="block p-3 rounded-lg bg-white/3 border border-white/5 hover:border-green-400/30 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-semibold text-white">{job.title}</p>
                            <p className="text-xs text-gray-400">{job.description}</p>
                          </div>
                          {job.isRemote && (
                            <span className="px-2 py-1 rounded-full text-xs bg-green-500/20 text-green-300 font-semibold whitespace-nowrap">
                              Remote
                            </span>
                          )}
                        </div>
                      </motion.a>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            onClick={onViewMap}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-lg bg-[#1e40af] hover:bg-[#1e3a8a] text-white font-bold transition-colors shadow-md border border-[#3b82f6] flex items-center justify-center gap-2"
          >
            <MapPin className="w-5 h-5" />
            View Talent Map
          </motion.button>
          <motion.button
            onClick={onViewGlobe}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-lg bg-[#166534] hover:bg-[#0d4620] text-white font-bold transition-colors shadow-md border border-[#1e7741] flex items-center justify-center gap-2"
          >
            <Globe className="w-5 h-5" />
            Explore on Globe
          </motion.button>
          <motion.button
            onClick={onViewPassport}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 rounded-lg bg-[#166534] hover:bg-[#0d4620] text-white font-bold transition-colors shadow-md border border-[#1e7741] flex items-center justify-center gap-2"
          >
            <Landmark className="w-5 h-5" />
            My Talent Passport
          </motion.button>
          <a
            href="/remote-jobs"
            className="px-8 py-4 rounded-xl border-2 border-green-400/50 hover:border-green-400 text-white font-bold transition-all text-center"
          >
            Explore All {participantCount}+ Talents
          </a>
        </motion.div>
      </div>
    </motion.div>
  )
}
