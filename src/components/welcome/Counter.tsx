"use client"

import { useEffect, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform, animate } from "framer-motion"

interface CounterProps {
  value: number
  duration?: number
  delay?: number
  suffix?: string
}

export default function Counter({ value, duration = 2, delay = 0, suffix = "" }: CounterProps) {
  const count = useMotionValue(0)
  const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString() + suffix)
  
  const ref = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const controls = animate(count, value, {
      duration: duration,
      delay: delay,
      ease: "easeOut",
    })
    return controls.stop
  }, [count, value, duration, delay])

  return <motion.span ref={ref}>{rounded}</motion.span>
}
