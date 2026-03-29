"use client"

import { motion } from "framer-motion"
import { calculateProfileStrength, getStrengthColor } from "@/lib/profile-strength"
import { useUserStore } from "@/store/userStore"
import { cn } from "@/lib/utils"
import { useEffect, useState } from "react"

interface ProfileStrengthMeterProps {
  onClick?: () => void
}

export default function ProfileStrengthMeter({ onClick }: ProfileStrengthMeterProps) {
  const { profile } = useUserStore()
  const [isClient, setIsClient] = useState(false)
  
  // Wait for client-side hydration to access localStorage
  useEffect(() => {
    setIsClient(true)
  }, [])

  const { total } = calculateProfileStrength(profile)
  const colorClass = getStrengthColor(total)
  
  // SVG Circle properties
  const radius = 18
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (total / 100) * circumference

  if (!isClient) {
    return (
      <div className="w-10 h-10 rounded-full bg-gray-100 animate-pulse" />
    )
  }

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex items-center justify-center p-1 rounded-full hover:bg-gray-50 transition-colors group"
      title={`Profile Strength: ${total}%`}
    >
      <svg className="w-10 h-10 -rotate-90 transform">
        {/* Background circle */}
        <circle
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          fill="transparent"
          className="text-gray-100"
        />
        {/* Progress circle */}
        <motion.circle
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          cx="20"
          cy="20"
          r={radius}
          stroke="currentColor"
          strokeWidth="3"
          strokeDasharray={circumference}
          fill="transparent"
          strokeLinecap="round"
          className={cn("transition-colors duration-500", colorClass)}
        />
      </svg>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-bold text-gray-700">{total}%</span>
      </div>
      
      {/* Tooltip hint on hover */}
      <div className="absolute -bottom-8 right-0 bg-gray-900 text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10 transition-all">
        Complete Profile
      </div>
    </motion.button>
  )
}
