"use client"

import { useEffect, useRef, memo } from "react"

// ── ChampagneGlass SVG ───────────────────────────────────────────
const ChampagneGlass = ({ size = 18 }: { size?: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    style={{ filter: "drop-shadow(0 0 4px rgba(253,224,71,0.9))" }}
  >
    {/* Glass bowl */}
    <path
      d="M7 3 L17 3 L13.5 11 Q12.5 13 12 13 Q11.5 13 10.5 11 Z"
      fill="rgba(253,224,71,0.25)"
      stroke="rgba(253,224,71,0.9)"
      strokeWidth="0.8"
      strokeLinejoin="round"
    />
    {/* Stem */}
    <line x1="12" y1="13" x2="12" y2="19" stroke="rgba(253,224,71,0.9)" strokeWidth="0.8" />
    {/* Base */}
    <line x1="9" y1="19" x2="15" y2="19" stroke="rgba(253,224,71,0.9)" strokeWidth="1" strokeLinecap="round" />
    {/* Bubbles */}
    <circle cx="11" cy="9" r="0.7" fill="rgba(253,224,71,0.8)" />
    <circle cx="13" cy="7" r="0.5" fill="rgba(253,224,71,0.6)" />
    <circle cx="12" cy="5" r="0.6" fill="rgba(253,224,71,0.7)" />
  </svg>
)

// ── Canvas-based snake that roams a rectangular border ─────────────
// We do this on canvas for maximum performance (no React re-renders)
function SnakeCanvas({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)
  const tRef = useRef(0) // perimeter parameter [0, 1)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")!

    const PADDING = 10           // inset from card edge
    const SEGMENT_LENGTH = 10    // px between snake segments
    const SEGMENTS = 7
    const SPEED = 0.0006         // perimeter fraction per ms
    const RADIUS = 20            // corner rounding of path

    // Build the rectangular perimeter path as a series of waypoints
    const x0 = PADDING, y0 = PADDING
    const x1 = width - PADDING, y1 = height - PADDING
    const W = x1 - x0, H = y1 - y0
    const perimeter = 2 * (W + H)

    /** Convert perimeter fraction [0,1) → {x,y} on the rounded rect border */
    function perimeterToXY(frac: number): [number, number] {
      let dist = ((frac % 1) + 1) % 1 * perimeter
      // top edge
      if (dist < W) return [x0 + dist, y0]
      dist -= W
      // right edge
      if (dist < H) return [x1, y0 + dist]
      dist -= H
      // bottom edge
      if (dist < W) return [x1 - dist, y1]
      dist -= W
      // left edge
      return [x0, y1 - dist]
    }

    /** Compute tangent angle at perimeter position */
    function perimeterAngle(frac: number): number {
      let dist = ((frac % 1) + 1) % 1 * perimeter
      if (dist < W) return 0               // →
      dist -= W
      if (dist < H) return Math.PI / 2     // ↓
      dist -= H
      if (dist < W) return Math.PI         // ←
      return -Math.PI / 2                  // ↑
    }

    let lastTime = 0

    function draw(time: number) {
      const dt = time - lastTime
      lastTime = time
      tRef.current = (tRef.current + SPEED * dt) % 1

      ctx.clearRect(0, 0, width, height)

      // Build segment positions (head at front)
      const segFrac = SEGMENT_LENGTH / perimeter
      const positions: Array<[number, number]> = []
      for (let i = 0; i < SEGMENTS; i++) {
        const f = tRef.current - i * segFrac
        positions.push(perimeterToXY(f))
      }

      const [hx, hy] = positions[0]
      const angle = perimeterAngle(tRef.current)

      // Draw snake body (tail → head gradient)
      for (let i = SEGMENTS - 1; i >= 1; i--) {
        const [ax, ay] = positions[i]
        const [bx, by] = positions[i - 1]
        const t = 1 - i / SEGMENTS
        const alpha = 0.25 + t * 0.55
        const r = 3 + t * 2.5

        ctx.beginPath()
        ctx.moveTo(ax, ay)
        ctx.lineTo(bx, by)
        ctx.strokeStyle = `rgba(74,222,128,${alpha})`
        ctx.lineWidth = r * 2
        ctx.lineCap = "round"
        ctx.stroke()

        // Segment highlight
        ctx.beginPath()
        ctx.arc(bx, by, r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(134,239,172,${alpha * 0.6})`
        ctx.fill()
      }

      // Snake head (glowing circle)
      const grad = ctx.createRadialGradient(hx, hy, 0, hx, hy, 7)
      grad.addColorStop(0, "rgba(74,222,128,1)")
      grad.addColorStop(1, "rgba(34,197,94,0.3)")
      ctx.beginPath()
      ctx.arc(hx, hy, 6, 0, Math.PI * 2)
      ctx.fillStyle = grad
      ctx.fill()
      ctx.beginPath()
      ctx.arc(hx, hy, 7, 0, Math.PI * 2)
      ctx.strokeStyle = "rgba(134,239,172,0.6)"
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Eyes (two tiny white dots offset from head)
      const eyeOffset = 3.5
      const eyeL: [number, number] = [
        hx + Math.cos(angle - Math.PI / 2) * eyeOffset,
        hy + Math.sin(angle - Math.PI / 2) * eyeOffset,
      ]
      const eyeR: [number, number] = [
        hx + Math.cos(angle + Math.PI / 2) * eyeOffset,
        hy + Math.sin(angle + Math.PI / 2) * eyeOffset,
      ]
      for (const [ex, ey] of [eyeL, eyeR]) {
        ctx.beginPath()
        ctx.arc(ex, ey, 1.5, 0, Math.PI * 2)
        ctx.fillStyle = "#fff"
        ctx.fill()
      }

      // Glow: outer aura around head
      const auraGrad = ctx.createRadialGradient(hx, hy, 3, hx, hy, 18)
      auraGrad.addColorStop(0, "rgba(74,222,128,0.25)")
      auraGrad.addColorStop(1, "rgba(74,222,128,0)")
      ctx.beginPath()
      ctx.arc(hx, hy, 18, 0, Math.PI * 2)
      ctx.fillStyle = auraGrad
      ctx.fill()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [width, height])

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="absolute inset-0 pointer-events-none z-10"
      style={{ imageRendering: "pixelated" }}
    />
  )
}

// ── Wrapper: measures its container and renders both canvas + glass ──
export default memo(function SnakeAnimation({ width = 340, height = 130 }: { width?: number; height?: number }) {
  return (
    <div
      className="relative"
      style={{ width, height }}
      aria-hidden="true"
    >
      <SnakeCanvas width={width} height={height} />

      {/* Champagne glass floats near the head position — we render it at top-right corner
          as the snake always passes through corners. A fixed corner position looks intentional. */}
      <div
        className="absolute z-20 pointer-events-none"
        style={{ top: -12, right: 4 }}
      >
        <ChampagneGlass size={22} />
      </div>
    </div>
  )
})
