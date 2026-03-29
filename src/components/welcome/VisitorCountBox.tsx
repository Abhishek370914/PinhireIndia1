"use client"

import { memo } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { useRealtimeVisitors } from "@/hooks/useRealtimeVisitors"
import { useEffect } from "react"

// Smooth animated number
function AnimatedCounter({ value }: { value: number }) {
  const spring = useSpring(value, { stiffness: 60, damping: 18, mass: 0.8 })
  const display = useTransform(spring, (v) => Math.round(v).toLocaleString("en-IN"))

  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  return <motion.span>{display}</motion.span>
}

function VisitorCountBox() {
  const { count, isLive } = useRealtimeVisitors()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 100, damping: 22, delay: 0.2 }}
      className="relative select-none"
      style={{ width: 420 }}
    >
      {/* ── Outer glow pulse ── */}
      <motion.div
        animate={{ opacity: [0.1, 0.28, 0.1], scale: [1, 1.03, 1] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        style={{
          position: "absolute",
          inset: -4,
          borderRadius: 32,
          background: "radial-gradient(ellipse, rgba(52,211,153,0.18) 0%, transparent 70%)",
          filter: "blur(12px)",
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* ── Card ── */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          borderRadius: 24,
          padding: "28px 40px 32px",
          background:
            "linear-gradient(145deg, rgba(10,18,35,0.96) 0%, rgba(6,14,28,0.98) 100%)",
          border: "1px solid rgba(52,211,153,0.18)",
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.04) inset, 0 24px 56px rgba(0,0,0,0.55), 0 0 40px rgba(52,211,153,0.06)",
          backdropFilter: "blur(24px)",
          textAlign: "center",
        }}
      >
        {/* LIVE badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            marginBottom: 12,
          }}
        >
          <motion.div
            animate={{ opacity: [1, 0.25, 1], scale: [1, 1.4, 1] }}
            transition={{ duration: 1.3, repeat: Infinity }}
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: isLive ? "#34d399" : "#94a3b8",
              boxShadow: isLive ? "0 0 8px rgba(52,211,153,0.8)" : "none",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              letterSpacing: "0.2em",
              color: isLive ? "#34d399" : "#64748b",
              textTransform: "uppercase",
            }}
          >
            {isLive ? "Live" : "Connecting…"}
          </span>
        </div>

        {/* Count */}
        <div
          style={{
            fontSize: 64,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.03em",
            background: "linear-gradient(135deg, #6ee7b7 0%, #34d399 40%, #10b981 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            marginBottom: 10,
          }}
        >
          <AnimatedCounter value={count} />
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 16,
            fontWeight: 500,
            color: "rgba(148,163,184,0.85)",
            margin: 0,
            letterSpacing: "0.01em",
          }}
        >
          people exploring jobs right now
        </p>

        {/* Bottom shimmer line */}
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 1,
            background:
              "linear-gradient(90deg, transparent 0%, rgba(52,211,153,0.6) 50%, transparent 100%)",
            borderRadius: "0 0 24px 24px",
          }}
        />
      </div>
    </motion.div>
  )
}

export default memo(VisitorCountBox)
