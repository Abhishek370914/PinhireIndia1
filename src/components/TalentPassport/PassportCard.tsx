'use client'

import { motion } from 'framer-motion'
import { Download, Share2, Trophy, Zap, Globe, Award, MessageCircle } from 'lucide-react'
import { useRef, memo, useCallback } from 'react'
import html2canvas from 'html2canvas'

export interface PassportData {
  name: string
  impactScore: number
  globalRank: number
  location: { lat: number; lng: number; city: string; country: string }
  voiceEcho?: { text: string; duration: number }
  matchedJobs: Array<{ title: string; company: string; link: string }>
  badges: Array<{ name: string; icon: string; earned: boolean }>
  skillsMatch: number
  companiesMatched: number
}

function PassportCardComponent({
  data,
  onShare,
  isShareable = true,
}: {
  data: PassportData
  onShare?: () => void
  isShareable?: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  const downloadCard = async () => {
    if (!cardRef.current) return
    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#000000',
        scale: 2,
      })
      const link = document.createElement('a')
      link.href = canvas.toDataURL('image/png')
      link.download = `talent-passport-${data.name}-${Date.now()}.png`
      link.click()
    } catch (error) {
      console.error('Download failed:', error)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Passport Card */}
      <div
        ref={cardRef}
        className="relative bg-linear-to-br from-slate-900 via-blue-900/50 to-slate-900 rounded-3xl border-2 border-green-500/30 overflow-hidden p-8 shadow-2xl"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(22, 163, 74, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(30, 64, 175, 0.1) 0%, transparent 50%)
          `,
        }}
      >
        {/* Decorative Elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-green-500/20 to-transparent rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-linear-to-tl from-blue-500/20 to-transparent rounded-full blur-3xl -z-10" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-bold text-green-400 uppercase tracking-widest">TALENT PASSPORT</p>
            <h2 className="text-3xl font-black text-white mt-2">{data.name}</h2>
          </div>
          <div className="text-4xl">🇮🇳</div>
        </div>

        {/* Impact Score Display */}
        <motion.div
          className="relative p-6 rounded-2xl bg-linear-to-r from-green-600/20 to-blue-600/20 border border-green-500/30 mb-6 overflow-hidden"
          animate={{ boxShadow: ['0 0 20px rgba(34, 197, 94, 0.2)', '0 0 40px rgba(34, 197, 94, 0.4)', '0 0 20px rgba(34, 197, 94, 0.2)'] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          <div className="relative z-10">
            <p className="text-xs text-gray-400 mb-1">IMPACT SCORE</p>
            <p className="text-5xl font-black text-transparent bg-clip-text bg-linear-to-r from-green-400 to-blue-400">
              {data.impactScore}
            </p>
            <p className="text-sm text-gray-300 mt-2">Global Rank: #{data.globalRank}</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-gray-400">{data.skillsMatch}%</p>
            <p className="text-xs font-bold text-white">Skills Match</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-gray-400">{data.companiesMatched}</p>
            <p className="text-xs font-bold text-white">Companies</p>
          </div>
          <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-center">
            <p className="text-xs text-gray-400">📍</p>
            <p className="text-xs font-bold text-white">{data.location.city}</p>
          </div>
        </div>

        {/* Badges */}
        <div className="mb-6">
          <p className="text-xs font-bold text-gray-400 mb-2 uppercase">EARNED BADGES</p>
          <div className="flex gap-2">
            {data.badges.slice(0, 3).map((badge, i) => (
              <motion.div
                key={i}
                whileHover={{ scale: 1.1 }}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-xl ${
                  badge.earned
                    ? 'bg-linear-to-br from-yellow-400 to-yellow-600 shadow-lg'
                    : 'bg-white/5 border border-white/20 opacity-40'
                }`}
                title={badge.name}
              >
                {badge.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Top Matched Jobs */}
        {data.matchedJobs.length > 0 && (
          <div className="mb-6">
            <p className="text-xs font-bold text-gray-400 mb-2 uppercase">Top Opportunities</p>
            <div className="space-y-2">
              {data.matchedJobs.slice(0, 3).map((job, i) => (
                <motion.a
                  key={i}
                  href={job.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ x: 2 }}
                  className="block p-2 rounded-lg bg-white/5 border border-white/10 hover:border-green-500/50 transition-all group text-xs"
                >
                  <p className="font-semibold text-white group-hover:text-green-300">{job.title}</p>
                  <p className="text-gray-400 text-xs">{job.company} →</p>
                </motion.a>
              ))}
            </div>
          </div>
        )}

        {/* Location */}
        <div className="flex items-center gap-2 p-3 rounded-lg bg-white/5 border border-white/10">
          <Globe className="w-4 h-4 text-blue-400" />
          <div className="text-xs">
            <p className="font-bold text-white">
              {data.location.city}, {data.location.country}
            </p>
            <p className="text-gray-400">Latitude: {data.location.lat.toFixed(2)}°</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-4 border-t border-white/10">
          <p className="text-xs text-gray-500 text-center">
            Supporting India's Atmanirbhar Bharat Mission • Project Pin IRE
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      {isShareable && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-3 mt-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={downloadCard}
            className="flex-1 p-3 rounded-xl bg-linear-to-r from-green-600 to-green-700 hover:from-green-500 hover:to-green-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Download className="w-4 h-4" />
            Download
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onShare}
            className="flex-1 p-3 rounded-xl bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Share2 className="w-4 h-4" />
            Share
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default memo(PassportCardComponent)
