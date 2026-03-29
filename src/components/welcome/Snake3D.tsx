"use client"

import { useEffect, useRef, memo } from "react"

// ─── 3D Snake around the visitor box ─────────────────────────────────────────
// Uses canvas with sine-wave Z-depth simulation to create a "wrapping around"
// 3D cylinder illusion. Segments behind the box are drawn first (dimmer),
// segments in front are drawn on top (brighter) — creating genuine depth.

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  maxLife: number
  size: number
}

interface Segment {
  x: number
  y: number
  z: number // -1 (behind) to +1 (front)
}

function SnakeCanvas({ width, height }: { width: number; height: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d", { alpha: true })!
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    // Scale canvas for retina
    canvas.width = width * dpr
    canvas.height = height * dpr
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    ctx.scale(dpr, dpr)

    // ── Config ───────────────────────────────────────────────────────────────
    const SEGMENTS = 28
    const SPEED = 0.00045          // perimeter fraction per ms (smooth, not rushed)
    const PADDING = 8              // snake path inset from canvas edge
    const CORNER_R = 24            // corner roundness radius
    const AMPLITUDE = 14           // Z-oscillation amplitude (3D depth illusion)
    const HEAD_RADIUS = 8
    const TAIL_RADIUS = 2.5
    const SEGMENT_GAP = 0.022      // perimeter fraction between segments

    const particles: Particle[] = []
    let tPerim = 0                 // head perimeter position [0, 1)
    let lastTime = 0

    // ── Rounded-rect perimeter math ──────────────────────────────────────────
    const x0 = PADDING, y0 = PADDING
    const x1 = width - PADDING, y1 = height - PADDING
    const W = x1 - x0, H = y1 - y0
    const straight = 2 * (W - 2 * CORNER_R) + 2 * (H - 2 * CORNER_R)
    const corners = 4 * (Math.PI / 2) * CORNER_R
    const PERIMETER = straight + corners

    function perimeterToPos(frac: number): { x: number; y: number; angle: number } {
      let d = ((frac % 1) + 1) % 1 * PERIMETER
      const r = CORNER_R

      // Define 8 segments: 4 straights + 4 quarter-circle corners
      // Top-right corner, right edge, bottom-right corner, bottom edge, bottom-left, left edge, top-left, top edge
      const segments = [
        // Top edge (left→right, skipping corners)
        { len: W - 2*r, type: "line", x: x0+r, y: y0, dx: 1, dy: 0 },
        // Top-right corner
        { len: (Math.PI/2)*r, type: "arc", cx: x1-r, cy: y0+r, startAngle: -Math.PI/2, dir: 1 },
        // Right edge
        { len: H - 2*r, type: "line", x: x1, y: y0+r, dx: 0, dy: 1 },
        // Bottom-right corner
        { len: (Math.PI/2)*r, type: "arc", cx: x1-r, cy: y1-r, startAngle: 0, dir: 1 },
        // Bottom edge (right→left)
        { len: W - 2*r, type: "line", x: x1-r, y: y1, dx: -1, dy: 0 },
        // Bottom-left corner
        { len: (Math.PI/2)*r, type: "arc", cx: x0+r, cy: y1-r, startAngle: Math.PI/2, dir: 1 },
        // Left edge
        { len: H - 2*r, type: "line", x: x0, y: y1-r, dx: 0, dy: -1 },
        // Top-left corner
        { len: (Math.PI/2)*r, type: "arc", cx: x0+r, cy: y0+r, startAngle: Math.PI, dir: 1 },
      ] as const

      for (const seg of segments) {
        if (d <= seg.len) {
          if (seg.type === "line") {
            const t = d / seg.len
            return {
              x: seg.x + seg.dx * d,
              y: seg.y + seg.dy * d,
              angle: Math.atan2(seg.dy, seg.dx),
            }
          } else {
            const arcFrac = d / seg.len
            const a = seg.startAngle + (Math.PI / 2) * arcFrac * seg.dir
            return {
              x: seg.cx + Math.cos(a) * r,
              y: seg.cy + Math.sin(a) * r,
              angle: a + Math.PI / 2 * seg.dir,
            }
          }
        }
        d -= seg.len
      }
      // fallback
      return { x: x0 + r, y: y0, angle: 0 }
    }

    // ── Spawn particles from head ─────────────────────────────────────────────
    function spawnParticle(hx: number, hy: number) {
      if (particles.length > 60) return
      particles.push({
        x: hx + (Math.random() - 0.5) * 6,
        y: hy + (Math.random() - 0.5) * 6,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        life: 1,
        maxLife: 0.4 + Math.random() * 0.6,
        size: 1 + Math.random() * 2,
      })
    }

    // ── DRAW ─────────────────────────────────────────────────────────────────
    function draw(now: number) {
      const dt = Math.min(now - lastTime, 32) // clamp to avoid spike on tab refocus
      lastTime = now

      tPerim = (tPerim + SPEED * dt) % 1

      ctx.clearRect(0, 0, width * dpr, height * dpr)
      // Reset to scaled coords
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      // Build segment positions with Z-depth (sine wave)
      const segs: Segment[] = []
      for (let i = 0; i < SEGMENTS; i++) {
        const f = tPerim - i * SEGMENT_GAP
        const pos = perimeterToPos(f)
        // Z oscillates: positive = in front of box, negative = behind
        const zPhase = (f * Math.PI * 4) + tPerim * Math.PI * 2
        const z = Math.sin(zPhase)
        segs.push({ x: pos.x, y: pos.y + z * AMPLITUDE * 0.4, z })
      }

      const headPos = perimeterToPos(tPerim)

      // ── 1. Draw particles ──────────────────────────────────────────────────
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life -= dt / (p.maxLife * 1000)
        if (p.life <= 0) {
          particles.splice(i, 1)
          continue
        }
        const alpha = p.life * 0.6
        const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2)
        g.addColorStop(0, `rgba(74,222,128,${alpha})`)
        g.addColorStop(1, `rgba(74,222,128,0)`)
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()
      }

      // ── 2. Draw BEHIND segments (z < 0) ──────────────────────────────────
      for (let i = SEGMENTS - 1; i >= 0; i--) {
        const seg = segs[i]
        if (seg.z >= 0) continue
        const t = 1 - i / SEGMENTS
        const r = TAIL_RADIUS + t * (HEAD_RADIUS - TAIL_RADIUS)
        const depth = (1 + seg.z) * 0.5   // 0 (fully behind) → 0.5 (at equator)
        const alpha = 0.15 + depth * 0.25

        // Segment body
        const g = ctx.createRadialGradient(seg.x, seg.y, 0, seg.x, seg.y, r)
        g.addColorStop(0, `rgba(52,211,153,${alpha})`)
        g.addColorStop(0.6, `rgba(16,185,129,${alpha * 0.7})`)
        g.addColorStop(1, `rgba(6,78,59,0)`)
        ctx.beginPath()
        ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Connect to next behind-segment with line
        if (i < SEGMENTS - 1 && segs[i + 1].z < 0) {
          const ns = segs[i + 1]
          ctx.beginPath()
          ctx.moveTo(seg.x, seg.y)
          ctx.lineTo(ns.x, ns.y)
          ctx.strokeStyle = `rgba(52,211,153,${alpha * 0.6})`
          ctx.lineWidth = r * 1.4
          ctx.lineCap = "round"
          ctx.stroke()
        }
      }

      // ── 3. Draw FRONT segments (z >= 0) ──────────────────────────────────
      for (let i = SEGMENTS - 1; i >= 0; i--) {
        const seg = segs[i]
        if (seg.z < 0) continue
        const t = 1 - i / SEGMENTS
        const r = TAIL_RADIUS + t * (HEAD_RADIUS - TAIL_RADIUS)
        const depth = 0.5 + (seg.z * 0.5)  // 0.5 (equator) → 1 (fully front)
        const alpha = 0.35 + depth * 0.65

        // Glossy segment
        const g = ctx.createRadialGradient(
          seg.x - r * 0.3, seg.y - r * 0.3, 0,
          seg.x, seg.y, r * 1.4
        )
        g.addColorStop(0, `rgba(187,247,208,${alpha})`)          // highlight
        g.addColorStop(0.35, `rgba(74,222,128,${alpha * 0.9})`)   // bright green
        g.addColorStop(0.7, `rgba(16,185,129,${alpha * 0.7})`)
        g.addColorStop(1, `rgba(6,78,59,0)`)
        ctx.beginPath()
        ctx.arc(seg.x, seg.y, r, 0, Math.PI * 2)
        ctx.fillStyle = g
        ctx.fill()

        // Connect to next front segment
        if (i < SEGMENTS - 1 && segs[i + 1].z >= 0) {
          const ns = segs[i + 1]
          const lineAlpha = alpha * 0.75
          const lg = ctx.createLinearGradient(seg.x, seg.y, ns.x, ns.y)
          lg.addColorStop(0, `rgba(74,222,128,${lineAlpha})`)
          lg.addColorStop(1, `rgba(52,211,153,${lineAlpha * 0.7})`)
          ctx.beginPath()
          ctx.moveTo(seg.x, seg.y)
          ctx.lineTo(ns.x, ns.y)
          ctx.strokeStyle = lg
          ctx.lineWidth = r * 1.5
          ctx.lineCap = "round"
          ctx.stroke()
        }
      }

      // ── 4. Head (always on top) ────────────────────────────────────────────
      const { x: hx, y: hy, angle } = headPos
      const headZ = segs[0]?.z ?? 1
      const hDepth = 0.55 + headZ * 0.45

      // Outer glow aura
      const aura = ctx.createRadialGradient(hx, hy, 0, hx, hy, HEAD_RADIUS * 4)
      aura.addColorStop(0, `rgba(74,222,128,${0.3 * hDepth})`)
      aura.addColorStop(1, "rgba(74,222,128,0)")
      ctx.beginPath()
      ctx.arc(hx, hy, HEAD_RADIUS * 4, 0, Math.PI * 2)
      ctx.fillStyle = aura
      ctx.fill()

      // Head body (glossy sphere)
      const hg = ctx.createRadialGradient(
        hx - HEAD_RADIUS * 0.3, hy - HEAD_RADIUS * 0.3, 0,
        hx, hy, HEAD_RADIUS * 1.5
      )
      hg.addColorStop(0, "rgba(240,253,244,0.95)")          // white highlight
      hg.addColorStop(0.25, "rgba(134,239,172,0.95)")
      hg.addColorStop(0.55, "rgba(34,197,94,0.9)")
      hg.addColorStop(0.85, "rgba(21,128,61,0.85)")
      hg.addColorStop(1, "rgba(6,78,59,0.2)")
      ctx.beginPath()
      ctx.arc(hx, hy, HEAD_RADIUS, 0, Math.PI * 2)
      ctx.fillStyle = hg
      ctx.fill()

      // Eyes
      const eyeAngle1 = angle - 0.55
      const eyeAngle2 = angle + 0.55
      const eyeDist = HEAD_RADIUS * 0.52
      for (const eAngle of [eyeAngle1, eyeAngle2]) {
        const ex = hx + Math.cos(eAngle) * eyeDist
        const ey = hy + Math.sin(eAngle) * eyeDist
        // White sclera
        ctx.beginPath()
        ctx.arc(ex, ey, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.95)"
        ctx.fill()
        // Pupil
        ctx.beginPath()
        ctx.arc(ex + Math.cos(angle) * 0.6, ey + Math.sin(angle) * 0.6, 1.2, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(0,40,20,0.95)"
        ctx.fill()
      }

      // Tongue flicker
      const tonguePhase = Math.sin(now * 0.006) > 0.7
      if (tonguePhase) {
        const tx = hx + Math.cos(angle) * (HEAD_RADIUS + 4)
        const ty = hy + Math.sin(angle) * (HEAD_RADIUS + 4)
        ctx.beginPath()
        ctx.moveTo(hx + Math.cos(angle) * HEAD_RADIUS, hy + Math.sin(angle) * HEAD_RADIUS)
        ctx.lineTo(tx, ty)
        ctx.strokeStyle = "rgba(248,113,113,0.9)"
        ctx.lineWidth = 1.5
        ctx.lineCap = "round"
        ctx.stroke()
        // Fork
        for (const forkDir of [-0.35, 0.35]) {
          ctx.beginPath()
          ctx.moveTo(tx, ty)
          ctx.lineTo(tx + Math.cos(angle + forkDir) * 4, ty + Math.sin(angle + forkDir) * 4)
          ctx.strokeStyle = "rgba(248,113,113,0.7)"
          ctx.lineWidth = 1
          ctx.stroke()
        }
      }

      // Spawn particle occasionally
      if (Math.random() < 0.12) spawnParticle(hx, hy)

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
      style={{
        position: "absolute",
        inset: 0,
        width: `${width}px`,
        height: `${height}px`,
        pointerEvents: "none",
        zIndex: 10,
      }}
    />
  )
}

export default memo(function Snake3D({
  width = 420,
  height = 160,
}: {
  width?: number
  height?: number
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: `-${20}px`,
        width: width + 40,
        height: height + 40,
        top: -20,
        left: -20,
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      <SnakeCanvas width={width + 40} height={height + 40} />
    </div>
  )
})
