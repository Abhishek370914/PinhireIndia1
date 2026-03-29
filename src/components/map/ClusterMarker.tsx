"use client"

import { motion } from "framer-motion"

interface Props {
  count: number
  onClick: () => void
}

export default function ClusterMarker({ count, onClick }: Props) {
  const size = count < 5 ? 36 : count < 20 ? 44 : 52

  return (
    <motion.button
      onClick={onClick}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      whileHover={{ scale: 1.12 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: "spring", stiffness: 360, damping: 20 }}
      className="relative flex items-center justify-center rounded-full cursor-pointer focus:outline-none"
      style={{ width: size, height: size }}
      aria-label={`Cluster of ${count} companies`}
    >
      {/* Pulse ring */}
      <motion.div
        className="absolute inset-0 rounded-full bg-saffron/20 border border-saffron/30"
        animate={{ scale: [1, 1.4, 1], opacity: [0.5, 0, 0.5] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />

      {/* Outer ring */}
      <div
        className="absolute inset-0 rounded-full bg-saffron/10 border border-saffron/40"
        style={{ transform: "scale(0.85)" }}
      />

      {/* Core */}
      <div
        className="relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br from-saffron to-amber-400 shadow-lg glow-saffron"
        style={{ width: size * 0.65, height: size * 0.65 }}
      >
        <span className="font-display font-bold text-white text-xs leading-none">
          {count > 99 ? "99+" : count}
        </span>
      </div>
    </motion.button>
  )
}
