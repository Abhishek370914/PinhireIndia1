"use client"

import { useRef, useState, useEffect, useMemo, useCallback, memo, Suspense } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { RoundedBox, MeshTransmissionMaterial, Float, Trail, Sphere, CatmullRomLine } from "@react-three/drei"
import * as THREE from "three"
import { motion, AnimatePresence } from "framer-motion"
import { useRealtimeVisitors } from "@/hooks/useRealtimeVisitors"

// ─── Digit Roller ───────────────────────────────────────────────────────────
// Each digit of the count rolls up independently like a slot machine
function DigitRoller({ digit, delay = 0 }: { digit: number; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const targetY = useRef(-digit * 0.65)
  const currentY = useRef(-digit * 0.65)

  useEffect(() => {
    targetY.current = -digit * 0.65
  }, [digit])

  useFrame((_, delta) => {
    if (!meshRef.current) return
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, delta * 8)
    meshRef.current.position.y = currentY.current
  })

  return (
    <group ref={meshRef}>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
        <mesh key={n} position={[0, n * 0.65, 0]} renderOrder={2}>
          <planeGeometry args={[0.5, 0.6]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
      ))}
    </group>
  )
}

// ─── Neon Glass Box ──────────────────────────────────────────────────────────
function GlassBox({ pulseSignal }: { pulseSignal: number }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glowRef = useRef<THREE.Mesh>(null)
  const pulseRef = useRef(0)

  useEffect(() => {
    if (pulseSignal > 0) pulseRef.current = 1
  }, [pulseSignal])

  useFrame((_, delta) => {
    if (!meshRef.current || !glowRef.current) return

    // Slow gentle float
    meshRef.current.rotation.y += delta * 0.08
    meshRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.04

    // Pulse decay on new visitor
    pulseRef.current = Math.max(0, pulseRef.current - delta * 1.5)
    const scale = 1 + pulseRef.current * 0.06
    meshRef.current.scale.setScalar(scale)

    // Glow intensity
    const mat = glowRef.current.material as THREE.MeshBasicMaterial
    mat.opacity = 0.08 + pulseRef.current * 0.15 + Math.sin(Date.now() * 0.0015) * 0.02
  })

  return (
    <group>
      {/* Outer glow sphere */}
      <mesh ref={glowRef} renderOrder={0}>
        <sphereGeometry args={[2.2, 32, 32]} />
        <meshBasicMaterial color="#00ff88" transparent opacity={0.08} side={THREE.BackSide} />
      </mesh>

      {/* Main glass box */}
      <RoundedBox ref={meshRef} args={[3.6, 1.8, 0.8]} radius={0.12} smoothness={6} renderOrder={1}>
        <MeshTransmissionMaterial
          backside
          samples={4}
          thickness={0.3}
          roughness={0.05}
          transmission={0.92}
          ior={1.5}
          chromaticAberration={0.04}
          anisotropy={0.1}
          color="#001a0d"
          attenuationColor="#00ff88"
          attenuationDistance={0.5}
          temporalDistortion={0.1}
          distortion={0.2}
          distortionScale={0.3}
        />
      </RoundedBox>

      {/* Neon border frame */}
      {[
        [-1.8, 0.9, 0.41], [1.8, 0.9, 0.41], [-1.8, -0.9, 0.41], [1.8, -0.9, 0.41],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]}>
          <sphereGeometry args={[0.04, 8, 8]} />
          <meshBasicMaterial color="#00ff88" />
        </mesh>
      ))}

      {/* Edge lines */}
      <lineSegments renderOrder={3}>
        <edgesGeometry args={[new THREE.BoxGeometry(3.62, 1.82, 0.82)]} />
        <lineBasicMaterial color="#00ff88" transparent opacity={0.35} />
      </lineSegments>
    </group>
  )
}

// ─── 3D Snake ────────────────────────────────────────────────────────────────
// Orbits the glass box on a CatmullRom elliptical path
const ORBIT_POINTS = Array.from({ length: 64 }, (_, i) => {
  const t = (i / 64) * Math.PI * 2
  const rx = 2.6  // ellipse x radius
  const ry = 1.4  // ellipse y radius
  const rz = 0.6  // slight depth oscillation
  return new THREE.Vector3(
    Math.cos(t) * rx,
    Math.sin(t * 2) * 0.4,  // figure-8 y weave
    Math.sin(t) * rz + Math.cos(t) * ry * 0.25
  )
})

const CURVE = new THREE.CatmullRomCurve3(ORBIT_POINTS, true, "centripetal", 0.5)

function Snake3DOrbit({ pulseSignal }: { pulseSignal: number }) {
  const headRef = useRef<THREE.Mesh>(null)
  const tongueRef = useRef<THREE.Mesh>(null)
  const tRef = useRef(0)
  const speedRef = useRef(0.028)
  const targetSpeed = useRef(0.028)
  const tongueTimer = useRef(0)
  const tonguePose = useRef(0)

  // Snake body segments
  const BODY_SEGS = 24
  const bodyRefs = useRef<THREE.Mesh[]>([])

  const segPositions = useRef<THREE.Vector3[]>(
    Array.from({ length: BODY_SEGS + 1 }, () => new THREE.Vector3())
  )

  useEffect(() => {
    if (pulseSignal > 0) {
      targetSpeed.current = 0.09  // sudden speed burst
    }
  }, [pulseSignal])

  useFrame((_, delta) => {
    // Speed lerp (back to normal after pulse)
    speedRef.current = THREE.MathUtils.lerp(speedRef.current, targetSpeed.current, delta * 4)
    targetSpeed.current = THREE.MathUtils.lerp(targetSpeed.current, 0.028, delta * 1.5)

    tRef.current = (tRef.current + speedRef.current * delta) % 1

    // Head position
    const headPos = CURVE.getPoint(tRef.current)
    const tangent = CURVE.getTangent(tRef.current)
    if (headRef.current) {
      headRef.current.position.copy(headPos)
      // Orient head along tangent
      const up = new THREE.Vector3(0, 1, 0)
      const quat = new THREE.Quaternion().setFromRotationMatrix(
        new THREE.Matrix4().lookAt(headPos, headPos.clone().add(tangent), up)
      )
      headRef.current.quaternion.slerp(quat, 0.2)
    }

    // Body segments follow head with lag (indices 1…BODY_SEGS)
    segPositions.current[0] = headPos.clone()
    for (let i = 1; i <= BODY_SEGS; i++) {
      const tSeg = ((tRef.current - i * 0.018) % 1 + 1) % 1
      segPositions.current[i] = CURVE.getPoint(tSeg)
    }

    bodyRefs.current.forEach((mesh, i) => {
      if (!mesh) return
      mesh.position.copy(segPositions.current[i + 1])
      const t = 1 - (i + 1) / BODY_SEGS
      const r = THREE.MathUtils.lerp(0.038, 0.11, t)
      mesh.scale.setScalar(r / 0.11)
    })

    // Tongue flicker
    tongueTimer.current += delta
    if (tongueTimer.current > 1.8) {
      tongueTimer.current = 0
      tonguePose.current = 1
    }
    if (tonguePose.current > 0) {
      tonguePose.current = Math.max(0, tonguePose.current - delta * 3)
    }
    if (tongueRef.current) {
      tongueRef.current.visible = tonguePose.current > 0.1
      tongueRef.current.scale.x = tonguePose.current
    }
  })

  return (
    <group>
      {/* Body segments */}
      {Array.from({ length: BODY_SEGS }).map((_, i) => {
        const t = 1 - (i + 1) / BODY_SEGS
        const color = new THREE.Color().setHSL(0.38 - t * 0.08, 0.9, 0.35 + t * 0.25)
        return (
          <mesh key={i} ref={(el) => { if (el) bodyRefs.current[i] = el }}>
            <sphereGeometry args={[0.11, 10, 10]} />
            <meshStandardMaterial
              color={color}
              roughness={0.2}
              metalness={0.5}
              emissive={color}
              emissiveIntensity={0.4 * t}
            />
          </mesh>
        )
      })}

      {/* Head */}
      <mesh ref={headRef}>
        <sphereGeometry args={[0.16, 16, 16]} />
        <meshStandardMaterial
          color="#00ff88"
          roughness={0.1}
          metalness={0.6}
          emissive="#00ff88"
          emissiveIntensity={0.8}
        />
        {/* Eyes */}
        {[-0.07, 0.07].map((x, i) => (
          <mesh key={i} position={[x, 0.07, 0.12]}>
            <sphereGeometry args={[0.035, 8, 8]} />
            <meshBasicMaterial color="white" />
          </mesh>
        ))}
        {/* Pupils */}
        {[-0.07, 0.07].map((x, i) => (
          <mesh key={`p${i}`} position={[x, 0.07, 0.15]}>
            <sphereGeometry args={[0.018, 6, 6]} />
            <meshBasicMaterial color="#001a0a" />
          </mesh>
        ))}

        {/* Tongue */}
        <mesh ref={tongueRef} position={[0, -0.04, 0.18]}>
          <boxGeometry args={[0.006, 0.006, 0.1]} />
          <meshBasicMaterial color="#ff4466" />
        </mesh>
      </mesh>
    </group>
  )
}

// ─── Reflective Ground ───────────────────────────────────────────────────────
function Ground() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.6, 0]} receiveShadow>
      <planeGeometry args={[14, 14, 1, 1]} />
      <meshStandardMaterial
        color="#000a05"
        metalness={0.85}
        roughness={0.15}
        envMapIntensity={0.5}
      />
    </mesh>
  )
}

// ─── Floating particles ──────────────────────────────────────────────────────
function Particles({ count = 80 }) {
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 12
      pos[i * 3 + 1] = (Math.random() - 0.5) * 6
      pos[i * 3 + 2] = (Math.random() - 0.5) * 8
    }
    return pos
  }, [count])

  const pointsRef = useRef<THREE.Points>(null)

  useFrame((state) => {
    if (!pointsRef.current) return
    pointsRef.current.rotation.y = state.clock.elapsedTime * 0.02
    pointsRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.022} color="#00ff88" transparent opacity={0.5} sizeAttenuation />
    </points>
  )
}

// ─── Camera Controller ───────────────────────────────────────────────────────
function CameraController({ mousePos }: { mousePos: React.MutableRefObject<{ x: number; y: number }> }) {
  const { camera } = useThree()
  const angle = useRef(0)
  const targetAngle = useRef(0)

  useFrame((_, delta) => {
    // Slow cinematic orbit
    targetAngle.current += delta * 0.18
    angle.current = THREE.MathUtils.lerp(angle.current, targetAngle.current, 0.02)

    const radius = 6.5
    const mx = mousePos.current.x * 0.6  // parallax
    const my = mousePos.current.y * 0.35

    const tx = Math.cos(angle.current) * radius + mx
    const tz = Math.sin(angle.current) * radius
    const ty = 2.0 - my

    camera.position.lerp(new THREE.Vector3(tx, ty, tz), delta * 1.5)
    camera.lookAt(0, 0, 0)
  })
  return null
}

// ─── Scene ───────────────────────────────────────────────────────────────────
function Scene({ count, pulseSignal, mousePos }: {
  count: number
  pulseSignal: number
  mousePos: React.MutableRefObject<{ x: number; y: number }>
}) {
  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.15} />
      <pointLight position={[0, 4, 2]} intensity={3} color="#00ff88" castShadow />
      <pointLight position={[-4, 0, -2]} intensity={1.5} color="#0088ff" />
      <pointLight position={[4, -1, 1]} intensity={1.2} color="#ff0088" />
      <spotLight position={[0, 8, 0]} intensity={2} angle={0.4} penumbra={0.8} castShadow color="#ffffff" />

      <CameraController mousePos={mousePos} />
      <Ground />
      <Particles />

      <Float speed={1.2} rotationIntensity={0.06} floatIntensity={0.15}>
        <GlassBox pulseSignal={pulseSignal} />
        <Snake3DOrbit pulseSignal={pulseSignal} />
      </Float>
    </>
  )
}

// ─── HTML Counter Overlay (rendered over canvas) ─────────────────────────────
// Uses HTML/CSS for crisp text on top of the 3D canvas
function CounterOverlay({ count, isLive, pulseSignal }: {
  count: number
  isLive: boolean
  pulseSignal: number
}) {
  const digits = count.toLocaleString("en-IN").split("")

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 10,
      }}
    >
      {/* LIVE badge */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <motion.div
          animate={{ opacity: [1, 0.2, 1], scale: [1, 1.5, 1] }}
          transition={{ duration: 1.2, repeat: Infinity }}
          style={{
            width: 9, height: 9, borderRadius: "50%",
            background: isLive ? "#00ff88" : "#666",
            boxShadow: isLive ? "0 0 10px #00ff88, 0 0 25px #00ff8855" : "none",
          }}
        />
        <span style={{
          fontSize: 11, fontWeight: 800, letterSpacing: "0.25em",
          color: isLive ? "#00ff88" : "#555",
          textTransform: "uppercase", fontFamily: "monospace",
          textShadow: isLive ? "0 0 10px #00ff88" : "none",
        }}>
          {isLive ? "Live Visitors" : "Connecting…"}
        </span>
      </div>

      {/* Main counter */}
      <div style={{ display: "flex", gap: 2, alignItems: "flex-end" }}>
        <AnimatePresence mode="popLayout">
          {digits.map((d, i) => (
            <motion.span
              key={`${i}-${d}`}
              initial={{ y: -30, opacity: 0, scale: 0.7 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0 }}
              transition={{ type: "spring", stiffness: 400, damping: 22, delay: i * 0.04 }}
              style={{
                display: "inline-block",
                fontSize: d === "," ? 36 : 64,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing: "-0.02em",
                color: "#ffffff",
                fontFamily: "'SF Pro Display', system-ui, sans-serif",
                textShadow: `0 0 20px rgba(0,255,136,${pulseSignal > 0 ? 0.9 : 0.4}), 0 0 50px rgba(0,255,136,0.2)`,
                filter: pulseSignal > 0 ? "brightness(1.4)" : "brightness(1)",
              }}
            >
              {d}
            </motion.span>
          ))}
        </AnimatePresence>
      </div>

      <p style={{
        marginTop: 10, fontSize: 15, fontWeight: 500,
        color: "rgba(200,230,215,0.75)", letterSpacing: "0.06em",
        fontFamily: "system-ui", textAlign: "center",
      }}>
        people exploring jobs right now
      </p>
    </div>
  )
}

// ─── Pulse Ring ───────────────────────────────────────────────────────────────
function PulseRing({ trigger }: { trigger: number }) {
  return (
    <AnimatePresence>
      {trigger > 0 && (
        <motion.div
          key={trigger}
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 2.5, opacity: 0 }}
          exit={{}}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: "20%",
            borderRadius: "50%",
            border: "2px solid #00ff88",
            boxShadow: "0 0 30px #00ff8899",
            zIndex: 5,
            pointerEvents: "none",
          }}
        />
      )}
    </AnimatePresence>
  )
}

// ─── Main Export ─────────────────────────────────────────────────────────────
export default memo(function VisitorCounter3D() {
  const { count, isLive } = useRealtimeVisitors()
  const prevCount = useRef(count)
  const [pulseSignal, setPulseSignal] = useState(0)
  const mousePos = useRef({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  // Detect count increases and fire pulse
  useEffect(() => {
    if (count > prevCount.current) {
      setPulseSignal(Date.now())
    }
    prevCount.current = count
  }, [count])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = containerRef.current?.getBoundingClientRect()
    if (!rect) return
    mousePos.current = {
      x: ((e.clientX - rect.left) / rect.width - 0.5) * 2,
      y: ((e.clientY - rect.top) / rect.height - 0.5) * 2,
    }
  }, [])

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        width: "100%",
        maxWidth: 560,
        height: 340,
        borderRadius: 24,
        overflow: "hidden",
        background: "radial-gradient(ellipse at 50% 40%, #001409 0%, #000a05 50%, #000300 100%)",
        boxShadow: "0 0 0 1px rgba(0,255,136,0.12), 0 32px 80px rgba(0,0,0,0.8), 0 0 60px rgba(0,255,136,0.06)",
        cursor: "default",
      }}
    >
      {/* 3D Canvas */}
      <Canvas
        shadows
        camera={{ position: [0, 2, 6.5], fov: 48, near: 0.1, far: 100 }}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.1,
        }}
        dpr={[1, 1.5]}  // balance quality vs performance
        style={{ position: "absolute", inset: 0 }}
      >
        <Suspense fallback={null}>
          <Scene count={count} pulseSignal={pulseSignal} mousePos={mousePos} />
        </Suspense>
      </Canvas>

      {/* HTML overlay for crisp counter text */}
      <CounterOverlay count={count} isLive={isLive} pulseSignal={pulseSignal > 0 ? 1 : 0} />

      {/* Pulse ring on visitor join */}
      <PulseRing trigger={pulseSignal} />

      {/* Scanline overlay for cyberpunk vibe */}
      <div
        style={{
          position: "absolute", inset: 0, pointerEvents: "none", zIndex: 20,
          backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,136,0.015) 2px, rgba(0,255,136,0.015) 4px)",
        }}
      />

      {/* Corner decorations */}
      {[
        { top: 12, left: 12 },
        { top: 12, right: 12 },
        { bottom: 12, left: 12 },
        { bottom: 12, right: 12 },
      ].map((style, i) => (
        <div key={i} style={{
          position: "absolute", ...style,
          width: 16, height: 16, pointerEvents: "none", zIndex: 15,
          borderTop: i < 2 ? "2px solid rgba(0,255,136,0.5)" : "none",
          borderBottom: i >= 2 ? "2px solid rgba(0,255,136,0.5)" : "none",
          borderLeft: i % 2 === 0 ? "2px solid rgba(0,255,136,0.5)" : "none",
          borderRight: i % 2 === 1 ? "2px solid rgba(0,255,136,0.5)" : "none",
        }} />
      ))}
    </div>
  )
})
