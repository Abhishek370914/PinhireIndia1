'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Share2, Landmark, Users, Zap } from 'lucide-react'
import PassportCard, { PassportData } from './PassportCard'
import Leaderboard from './Leaderboard'
import { SEED_COMPANIES } from '@/lib/seed-companies'
import { SEED_JOBS } from '@/lib/seed-jobs'

interface TalentPassportProps {
  userProfile?: {
    name: string
    skills: string[]
    experience: string
    interests: string
    location?: string
    impact?: string
  }
  userLocation?: { latitude: number; longitude: number }
  voiceEcho?: { text: string; duration: number }
  matchedCompanies?: Array<{ id: string; name: string; focus?: string }>
  onClose?: () => void
}

export default function TalentPassport({
  userProfile,
  userLocation,
  voiceEcho,
  matchedCompanies = [],
  onClose,
}: TalentPassportProps) {
  const [view, setView] = useState<'card' | 'leaderboard'>('card')
  const [copied, setCopied] = useState(false)

  // Calculate impact score
  const calculateImpactScore = (): number => {
    let score = 500 // Base score

    // Skills match (5 companies per skill)
    if (userProfile?.skills) {
      score += userProfile.skills.length * 50
    }

    // Companies matched
    score += matchedCompanies.length * 75

    // Experience level
    const expMultiplier =
      userProfile?.experience === 'Senior (8+ yrs)'
        ? 2
        : userProfile?.experience === 'Mid-level (3-7 yrs)'
          ? 1.5
          : 1

    // Location bonus (if in India)
    if (userLocation) {
      const isInIndia =
        userLocation.latitude > 8 &&
        userLocation.latitude < 35 &&
        userLocation.longitude > 68 &&
        userLocation.longitude < 97
      if (isInIndia) {
        score += 200
      }
    }

    // Voice echo bonus
    if (voiceEcho) {
      score += 150
    }

    // Impact statement bonus
    if (userProfile?.impact) {
      score += 100
    }

    return Math.floor(score * expMultiplier)
  }

  // Get top 3 matched jobs
  const getTopJobs = () => {
    if (matchedCompanies.length === 0) return []

    const allJobs: any[] = []
    matchedCompanies.slice(0, 5).forEach(company => {
      const companyRecord = (SEED_COMPANIES as any[]).find(c => c.id === company.id)
      if (companyRecord) {
        const jobs = (SEED_JOBS as any[])
          .filter(j => j.company_id === company.id)
          .slice(0, 2)
        jobs.forEach(job => {
          allJobs.push({
            title: job.title || 'Position Available',
            company: companyRecord.name,
            link: companyRecord.career_page_url || companyRecord.website,
          })
        })
      }
    })

    return allJobs.slice(0, 3)
  }

  // Get badges
  const getBadges = () => {
    const badges = [
      { name: 'Early Pioneer', icon: '🚀', earned: true },
      { name: 'Rare Earth Expert', icon: '⚛️', earned: matchedCompanies.length >= 3 },
      { name: 'Global Ambassador', icon: '🌍', earned: !!userLocation },
      { name: 'Voice Echo', icon: '🎤', earned: !!voiceEcho },
      { name: 'Impact Maker', icon: '💚', earned: !!userProfile?.impact },
      { name: 'Career Explorer', icon: '🎯', earned: getTopJobs().length > 0 },
    ]
    return badges
  }

  // Calculate global rank (mock)
  const globalRank = Math.floor(Math.random() * 450) + 1

  // Get user location info
  const getLocationInfo = () => {
    if (!userLocation) {
      return { lat: 20.5937, lng: 78.9629, city: 'India', country: 'India' }
    }

    // Mock location to city mapping
    const cities: { [key: string]: { city: string; country: string } } = {
      '19.076': { city: 'Mumbai', country: 'India' },
      '28.6139': { city: 'Delhi', country: 'India' },
      '13.0827': { city: 'Bengaluru', country: 'India' },
      '18.5204': { city: 'Hyderabad', country: 'India' },
    }

    const cityKey = Object.keys(cities).find(key =>
      Math.abs(parseFloat(key) - userLocation.latitude) < 1
    )

    return {
      lat: userLocation.latitude,
      lng: userLocation.longitude,
      city: cityKey ? cities[cityKey].city : 'Global',
      country: cityKey ? cities[cityKey].country : 'Worldwide',
    }
  }

  const passportData: PassportData = {
    name: userProfile?.name || 'Rare Earth Talent',
    impactScore: calculateImpactScore(),
    globalRank,
    location: getLocationInfo(),
    voiceEcho,
    matchedJobs: getTopJobs(),
    badges: getBadges(),
    skillsMatch: Math.min((userProfile?.skills?.length || 0) * 15, 100),
    companiesMatched: matchedCompanies.length,
  }

  const sharePassport = async () => {
    const shareUrl = `${window.location.origin}/talent/${btoa(userProfile?.name || 'talent')}`
    const shareText = `Check out my Talent Passport! Impact Score: ${passportData.impactScore} | Global Rank: #${passportData.globalRank} | Supporting India's Rare Earth Mission via Project Pin IRE India`

    const shareOptions = [
      {
        name: 'LinkedIn',
        url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
      },
      {
        name: 'WhatsApp',
        url: `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + shareUrl)}`,
      },
      {
        name: 'X (Twitter)',
        url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
      },
    ]

    // Copy to clipboard for manual sharing
    try {
      await navigator.clipboard.writeText(shareUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (e) {
      console.error('Failed to copy:', e)
    }
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="min-h-screen bg-gradient-to-b from-slate-900 via-blue-900 to-slate-900 px-4 py-12 relative overflow-hidden"
      >
        {/* Background Glows */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        </div>

        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="max-w-4xl mx-auto mb-12 flex items-center justify-between"
        >
          <div>
            <h1 className="text-5xl font-black text-white flex items-center gap-3">
              <Landmark className="w-10 h-10 text-green-400" />
              Talent Passport
            </h1>
            <p className="text-gray-400 mt-2">Your shareable digital identity supporting India's Atmanirbhar Bharat mission</p>
          </div>

          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="p-3 hover:bg-white/10 rounded-xl transition-all text-gray-300"
            >
              <X className="w-6 h-6" />
            </motion.button>
          )}
        </motion.div>

        {/* View Tabs */}
        <motion.div
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="max-w-4xl mx-auto mb-8 flex gap-4 justify-center"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('card')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              view === 'card'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Landmark className="w-5 h-5" />
            My Passport
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setView('leaderboard')}
            className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
              view === 'leaderboard'
                ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white shadow-lg'
                : 'bg-white/10 border border-white/20 text-gray-300 hover:bg-white/20'
            }`}
          >
            <Users className="w-5 h-5" />
            Leaderboard
          </motion.button>
        </motion.div>

        {/* Content */}
        <div className="max-w-4xl mx-auto relative z-10">
          {view === 'card' && (
            <motion.div
              key="card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <PassportCard data={passportData} onShare={sharePassport} />

              {/* Quick Stats */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4"
              >
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Zap className="w-8 h-8 text-yellow-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">{userProfile?.skills?.length || 0}</p>
                  <p className="text-sm text-gray-400">Skills Tracked</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Share2 className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">{matchedCompanies.length}</p>
                  <p className="text-sm text-gray-400">Companies Matched</p>
                </div>
                <div className="p-6 rounded-xl bg-white/5 border border-white/10 text-center">
                  <Users className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-2xl font-black text-white">#{passportData.globalRank}</p>
                  <p className="text-sm text-gray-400">Global Rank</p>
                </div>
              </motion.div>

              {/* Share CTA */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="mt-8"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={sharePassport}
                  className="w-full p-4 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
                >
                  <Share2 className="w-5 h-5" />
                  {copied ? 'Link Copied! 🎉' : 'Share My Passport'}
                </motion.button>
              </motion.div>
            </motion.div>
          )}

          {view === 'leaderboard' && (
            <motion.div
              key="leaderboard"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Leaderboard currentUserRank={passportData.globalRank} />
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
