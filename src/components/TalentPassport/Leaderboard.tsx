'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Trophy, Medal, Target } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  name: string
  impactScore: number
  location: string
  country: string
  companiesMatched: number
  avatar?: string
}

const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: 'Ravi Kumar', impactScore: 9850, location: 'Bengaluru', country: 'India', companiesMatched: 92, avatar: '🏆' },
  { rank: 2, name: 'Priya Sharma', impactScore: 9720, location: 'Mumbai', country: 'India', companiesMatched: 88, avatar: '⭐' },
  { rank: 3, name: 'Amit Patel', impactScore: 9650, location: 'Delhi', country: 'India', companiesMatched: 85, avatar: '🎯' },
  { rank: 4, name: 'Anjali Singh', impactScore: 9580, location: 'Pune', country: 'India', companiesMatched: 82, avatar: '🚀' },
  { rank: 5, name: 'Vikram Desai', impactScore: 9450, location: 'Chennai', country: 'India', companiesMatched: 78, avatar: '💡' },
  { rank: 6, name: 'Zara Khan', impactScore: 9320, location: 'Hyderabad', country: 'India', companiesMatched: 75, avatar: '✨' },
  { rank: 7, name: 'Deepak Verma', impactScore: 9200, location: 'Cochin', country: 'India', companiesMatched: 72, avatar: '🌟' },
  { rank: 8, name: 'Neha Gupta', impactScore: 9100, location: 'Jaipur', country: 'India', companiesMatched: 70, avatar: '🎖️' },
  { rank: 9, name: 'Sanjay Kumar', impactScore: 8980, location: 'Lucknow', country: 'India', companiesMatched: 68, avatar: '🏅' },
  { rank: 10, name: 'Meera Nair', impactScore: 8850, location: 'Kochi', country: 'India', companiesMatched: 65, avatar: '👑' },
]

export default function Leaderboard({
  currentUserRank,
  onClose,
}: {
  currentUserRank?: number
  onClose?: () => void
}) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>(MOCK_LEADERBOARD)
  const [userHighlight, setUserHighlight] = useState<number | null>(currentUserRank || null)

  useEffect(() => {
    // Load from localStorage if available, otherwise use mock data
    const stored = localStorage.getItem('talentLeaderboard')
    if (stored) {
      try {
        setLeaderboard(JSON.parse(stored))
      } catch (e) {
        setLeaderboard(MOCK_LEADERBOARD)
      }
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="w-full max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-3xl font-black text-white flex items-center gap-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              Global Leaderboard
            </h2>
            <p className="text-sm text-gray-400 mt-1">Top 50 Talents Supporting India's Rare Earth Mission</p>
          </div>
          {onClose && (
            <motion.button
              whileHover={{ scale: 1.1 }}
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-all text-gray-400"
            >
              ✕
            </motion.button>
          )}
        </div>
      </div>

      {/* Leaderboard Table */}
      <motion.div className="space-y-2 max-h-[600px] overflow-y-auto">
        {leaderboard.slice(0, 50).map((entry, idx) => (
          <motion.div
            key={entry.rank}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.02 }}
            className={`p-4 rounded-lg border transition-all ${
              userHighlight === entry.rank
                ? 'bg-green-500/20 border-green-500/50'
                : 'bg-white/5 border-white/10 hover:border-white/30'
            }`}
          >
            <div className="flex items-center gap-4">
              {/* Rank Badge */}
              <div className="flex-shrink-0">
                {entry.rank === 1 && (
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 text-white font-black text-lg shadow-lg">
                    🥇
                  </span>
                )}
                {entry.rank === 2 && (
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 text-white font-black text-lg shadow-lg">
                    🥈
                  </span>
                )}
                {entry.rank === 3 && (
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white font-black text-lg shadow-lg">
                    🥉
                  </span>
                )}
                {entry.rank > 3 && (
                  <span className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 text-white font-black">
                    #{entry.rank}
                  </span>
                )}
              </div>

              {/* Name & Location */}
              <div className="flex-1">
                <p className="font-bold text-white flex items-center gap-2">
                  {entry.avatar} {entry.name}
                </p>
                <p className="text-xs text-gray-400">
                  {entry.location}, {entry.country}
                </p>
              </div>

              {/* Stats */}
              <div className="text-right">
                <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                  {entry.impactScore}
                </p>
                <p className="text-xs text-gray-400 flex items-center justify-end gap-1 mt-1">
                  <Target className="w-3 h-3" />
                  {entry.companiesMatched} companies
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(entry.impactScore / 9850) * 100}%` }}
              transition={{ delay: 0.1 + idx * 0.02, duration: 0.5 }}
              className="mt-3 h-1 bg-gradient-to-r from-green-500 to-blue-500 rounded-full"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Footer Stats */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 p-4 rounded-xl bg-gradient-to-r from-green-600/20 to-blue-600/20 border border-white/10"
      >
        <p className="text-xs text-gray-400 text-center">
          <span className="font-bold text-white">{leaderboard.length}+ talents</span> actively contributing to Project Pin IRE India
        </p>
      </motion.div>
    </motion.div>
  )
}
