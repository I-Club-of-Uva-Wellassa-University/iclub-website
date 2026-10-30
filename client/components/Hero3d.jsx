import React, { useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Environment, Lightformer, RoundedBox } from '@react-three/drei'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// brand colours
const BLUE = '#1C82ED'
const NAVY = '#1B1E4C'
const AQUA = '#5FD4F0'
const SILVER = '#e6eef7'

const MARK_PX = [
  [453.4, 460.2], [349.9, 460.0], [324.6, 492.6], [323.3, 460.5], [285.1, 498.4], [347.9, 499.4],
  [293.1, 575.4], [369.6, 575.6], [392.8, 543.5], [360.5, 542.9], [391.2, 499.1], [425.6, 498.6],
]

const WIDE = [
  { id: 'mark', kind: 'mark', fx:  0.34,  fy: -0.28, sw: 0.17,  depth: 1.6, amp: 0.016, speed: 0.55, phase: 0.0, tilt: [0.12, -0.35, 0.06], sway: [0.1, 0.38],  spin: 0,   follow: 1 },
  { id: 'cap',  kind: 'cap',  fx: -0.365, fy: -0.2,  sw: 0.14,  depth: 1.2, amp: 0.02,  speed: 0.5,  phase: 1.7, tilt: [0.5, 0.25, 0.08],   sway: [0.08, 0.3],  spin: 0,   follow: 0.7 },
  { id: 'code', kind: 'code', fx: -0.285, fy:  0.29, sw: 0.115, depth: 2.2, amp: 0.02,  speed: 0.7,  phase: 3.1, tilt: [0.05, -0.25, 0.05], sway: [0.06, 0.3],  spin: 0,   follow: 0.8 },
  { id: 'bulb', kind: 'bulb', fx:  0.275, fy:  0.3,  sw: 0.065, depth: 2.8, amp: 0.024, speed: 0.8,  phase: 0.9, tilt: [0, 0.2, 0.1],       sway: [0.05, 0.25], spin: 0,   follow: 0.5 },
  { id: 'chip', kind: 'chip', fx: -0.16,  fy: -0.345, sw: 0.075, depth: 2.0, amp: 0.02,  speed: 0.6,  phase: 2.4, tilt: [1.0, 0.45, 0.15],   sway: [0.12, 0.2],  spin: 0.2, follow: 0.5 },
]

const PORTRAIT = [
  { id: 'mark', kind: 'mark', fx:  0.26, fy:  0.3,  sw: 0.34, depth: 1.4, amp: 0.012, speed: 0.55, phase: 0.0, tilt: [0.1, -0.3, 0.05],  sway: [0.08, 0.3],  spin: 0,   follow: 1 },
  { id: 'code', kind: 'code', fx: -0.27, fy:  0.33, sw: 0.24, depth: 2.2, amp: 0.016, speed: 0.7,  phase: 3.1, tilt: [0.05, -0.25, 0.05], sway: [0.06, 0.3],  spin: 0,   follow: 0.8 },
  { id: 'cap',  kind: 'cap',  fx: -0.22, fy: -0.33, sw: 0.3,  depth: 1.2, amp: 0.014, speed: 0.5,  phase: 1.7, tilt: [0.5, 0.25, 0.08],   sway: [0.08, 0.3],  spin: 0,   follow: 0.7 },
  { id: 'chip', kind: 'chip', fx:  0.3,  fy: -0.33, sw: 0.16, depth: 2.0, amp: 0.014, speed: 0.6,  phase: 2.4, tilt: [1.0, 0.45, 0.15],   sway: [0.12, 0.2],  spin: 0.2, follow: 0.5 },
]

// ── geometry ────────────────────────────────────────────────────────────────
const extrude = (pts, depth = 0.18) => {
  const geo = new THREE.ExtrudeGeometry(new THREE.Shape(pts.map(([x, y]) => new THREE.Vector2(x, y))), {
    depth,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.025,
    bevelSegments: 5,
    curveSegments: 1,
  })
  geo.translate(0, 0, -depth / 2)
  return geo
}

// the logo mark as a bevelled 3D solid, 1 unit wide
function useMarkGeometry() {
  return useMemo(() => {
    const xs = MARK_PX.map((p) => p[0])
    const ys = MARK_PX.map((p) => p[1])
    const W = Math.max(...xs) - Math.min(...xs)
    const cx = (Math.max(...xs) + Math.min(...xs)) / 2
    const cy = (Math.max(...ys) + Math.min(...ys)) / 2
    const shape = new THREE.Shape(MARK_PX.map(([x, y]) => new THREE.Vector2((x - cx) / W, -(y - cy) / W)))
    const geo = new THREE.ExtrudeGeometry(shape, {
      depth: 0.16,
      bevelEnabled: true,
      bevelThickness: 0.035,
      bevelSize: 0.03,
      bevelSegments: 6,
      curveSegments: 1,
    })
    geo.translate(0, 0, -0.08)
    return geo
  }, [])
}

// "<", "/" and ">" as solid shapes
function useCodeGeometries() {
  return useMemo(() => {
    const right = [[-0.3, 0.5], [-0.05, 0.5], [0.3, 0], [-0.05, -0.5], [-0.3, -0.5], [0.05, 0]]
    const left = right.map(([x, y]) => [-x, y]).reverse()
    const slash = [[-0.2, -0.5], [-0.06, -0.5], [0.2, 0.5], [0.06, 0.5]]
    return { left: extrude(left), right: extrude(right), slash: extrude(slash) }
  }, [])
}

// ── materials ───────────────────────────────────────────────────────────────
const Glossy = ({ color, metalness = 0.2, roughness = 0.2, env = 1.15, ...rest }) => (
  <meshPhysicalMaterial
    color={color}
    metalness={metalness}
    roughness={roughness}
    clearcoat={1}
    clearcoatRoughness={0.08}
    envMapIntensity={env}
    {...rest}
  />
)

// ── objects (each one is about 1 unit wide) ─────────────────────────────────
function Code() {
  const g = useCodeGeometries()
  return (
    <group scale={0.543}>
      <mesh geometry={g.left} position={[-0.62, 0, 0]}>
        <Glossy color={BLUE} />
      </mesh>
      <mesh geometry={g.slash}>
        <Glossy color={AQUA} roughness={0.18} />
      </mesh>
      <mesh geometry={g.right} position={[0.62, 0, 0]}>
        <Glossy color={BLUE} />
      </mesh>
    </group>
  )
}

function Cap() {
  return (
    <group scale={0.7}>
      {/* the flat board */}
      <RoundedBox args={[1, 0.07, 1]} radius={0.025} smoothness={4} position={[0, 0.1, 0]} rotation={[0, Math.PI / 4, 0]}>
        <Glossy color={NAVY} metalness={0.25} env={1.2} />
      </RoundedBox>
      {/* the cap under it */}
      <mesh position={[0, -0.12, 0]}>
        <cylinderGeometry args={[0.3, 0.26, 0.36, 48]} />
        <Glossy color={NAVY} metalness={0.25} env={1.2} />
      </mesh>
      {/* button, cord and tassel */}
      <mesh position={[0, 0.16, 0]}>
        <sphereGeometry args={[0.05, 24, 24]} />
        <Glossy color={AQUA} />
      </mesh>
      <mesh position={[0.35, 0.14, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.012, 0.012, 0.7, 12]} />
        <Glossy color={AQUA} />
      </mesh>
      <mesh position={[0.707, -0.04, 0]}>
        <cylinderGeometry args={[0.022, 0.022, 0.3, 12]} />
        <Glossy color={AQUA} />
      </mesh>
      <mesh position={[0.707, -0.26, 0]}>
        <coneGeometry args={[0.06, 0.14, 16]} />
        <Glossy color={AQUA} />
      </mesh>
    </group>
  )
}

function Chip() {
  const { pinGeo, pinMat } = useMemo(
    () => ({
      pinGeo: new THREE.BoxGeometry(0.05, 0.035, 0.13),
      pinMat: new THREE.MeshPhysicalMaterial({ color: SILVER, metalness: 1, roughness: 0.2 }),
    }),
    [],
  )
  const pins = []
  for (let i = 0; i < 6; i++) {
    const o = -0.3 + i * 0.12
    pins.push([o, 0.47, 0, 0], [o, -0.47, 0, 0], [0.47, o, 0, Math.PI / 2], [-0.47, o, 0, Math.PI / 2])
  }
  return (
    <group scale={0.9}>
      <RoundedBox args={[0.8, 0.12, 0.8]} radius={0.04} smoothness={4}>
        <Glossy color={NAVY} metalness={0.3} env={1.2} />
      </RoundedBox>
      <RoundedBox args={[0.42, 0.03, 0.42]} radius={0.02} smoothness={4} position={[0, 0.075, 0]}>
        <Glossy color={AQUA} metalness={0.4} roughness={0.25} />
      </RoundedBox>
      <mesh position={[-0.3, 0.07, -0.3]}>
        <cylinderGeometry args={[0.03, 0.03, 0.02, 16]} />
        <meshPhysicalMaterial color={SILVER} metalness={1} roughness={0.2} />
      </mesh>
      {pins.map(([a, b, , rot], i) => (
        // pins on the top/bottom edges run along x, pins on the left/right edges along z
        <mesh
          key={i}
          geometry={pinGeo}
          material={pinMat}
          position={rot === 0 ? [a, 0, b] : [a, 0, b]}
          rotation={[0, rot, 0]}
        />
      ))}
    </group>
  )
}

function Bulb() {
  const filament = useMemo(
    () => new THREE.MeshStandardMaterial({ color: AQUA, emissive: AQUA, emissiveIntensity: 2 }),
    [],
  )
  // the filament pulses softly, like an idea
  useFrame((state) => {
    filament.emissiveIntensity = 1.8 + Math.sin(state.clock.elapsedTime * 1.6) * 0.5
  })
  return (
    <group scale={0.77}>
      {/* glass */}
      <mesh position={[0, 0.1, 0]}>
        <sphereGeometry args={[0.42, 48, 48]} />
        <meshPhysicalMaterial color="#e8f6ff" transparent opacity={0.38} roughness={0.04} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={1.6} depthWrite={false} />
      </mesh>
      <mesh position={[0, -0.3, 0]}>
        <cylinderGeometry args={[0.26, 0.17, 0.3, 40]} />
        <meshPhysicalMaterial color="#e8f6ff" transparent opacity={0.38} roughness={0.04} clearcoat={1} clearcoatRoughness={0.03} envMapIntensity={1.6} depthWrite={false} />
      </mesh>
      {/* filament */}
      <mesh material={filament} position={[0, 0.12, 0]}>
        <torusGeometry args={[0.1, 0.014, 16, 48]} />
      </mesh>
      <mesh material={filament} position={[-0.07, -0.04, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
      </mesh>
      <mesh material={filament} position={[0.07, -0.04, 0]}>
        <cylinderGeometry args={[0.01, 0.01, 0.3, 8]} />
      </mesh>
      {/* metal screw base */}
      {[-0.5, -0.585, -0.67].map((y, i) => (
        <mesh key={y} position={[0, y, 0]}>
          <cylinderGeometry args={[i === 1 ? 0.155 : 0.17, i === 1 ? 0.155 : 0.17, 0.07, 32]} />
          <meshPhysicalMaterial color={SILVER} metalness={1} roughness={0.22} envMapIntensity={1.2} />
        </mesh>
      ))}
      <mesh position={[0, -0.75, 0]}>
        <sphereGeometry args={[0.075, 24, 24]} />
        <Glossy color={NAVY} />
      </mesh>
    </group>
  )
}

function Shape({ kind, markGeo }) {
  switch (kind) {
    case 'mark':
      return (
        <mesh geometry={markGeo}>
          <Glossy color={BLUE} />
        </mesh>
      )
    case 'code':
      return <Code />
    case 'cap':
      return <Cap />
    case 'chip':
      return <Chip />
    case 'bulb':
      return <Bulb />
    default:
      return null
  }
}

// ── movement ────────────────────────────────────────────────────────────────
function Item({ it, vw, vh, mouse, reduce, children }) {
  const g = useRef()
  const m = useRef({ x: 0, y: 0 })
  const x0 = it.fx * vw
  const y0 = it.fy * vh

  useFrame((state, dt) => {
    if (reduce || !g.current) return
    const t = state.clock.elapsedTime
    m.current.x = THREE.MathUtils.damp(m.current.x, mouse.current.x, 2.5, dt)
    m.current.y = THREE.MathUtils.damp(m.current.y, mouse.current.y, 2.5, dt)

    g.current.position.x = x0 - m.current.x * it.depth * vw * 0.012
    g.current.position.y =
      y0 + Math.sin(t * it.speed + it.phase) * it.amp * vh - m.current.y * it.depth * vh * 0.012
    g.current.rotation.set(
      it.tilt[0] + Math.sin(t * 0.5 + it.phase) * it.sway[0] - m.current.y * it.follow * 0.45,
      it.tilt[1] + Math.sin(t * 0.4 + it.phase * 1.3) * it.sway[1] + it.spin * t + m.current.x * it.follow * 0.6,
      it.tilt[2],
    )
  })

  return (
    <group ref={g} position={[x0, y0, 0]} rotation={it.tilt} scale={it.sw * vw}>
      {children}
    </group>
  )
}

function Scene({ mouse, reduce }) {
  const viewport = useThree((s) => s.viewport)
  const markGeo = useMarkGeometry()
  const items = viewport.aspect < 0.9 ? PORTRAIT : WIDE

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 6, 6]} intensity={1.2} />

      {/* a small procedural "photo studio": soft boxes that the glossy objects reflect */}
      <Environment resolution={256} frames={1}>
        <color attach="background" args={['#a9c3d8']} />
        <Lightformer form="rect" intensity={3.2} color="#ffffff" position={[0, 7, 5]} scale={[16, 5, 1]} />
        <Lightformer form="rect" intensity={2.2} color="#e3f4ff" position={[-9, 1, 3]} scale={[8, 7, 1]} />
        <Lightformer form="rect" intensity={2.6} color="#bfeaf7" position={[9, -1, 3]} scale={[8, 7, 1]} />
        <Lightformer form="ring" intensity={1.8} color={AQUA} position={[0, -5, 5]} scale={7} />
      </Environment>

      {items.map((it) => (
        <Item key={it.id} it={it} vw={viewport.width} vh={viewport.height} mouse={mouse} reduce={reduce}>
          <Shape kind={it.kind} markGeo={markGeo} />
        </Item>
      ))}
    </>
  )
}

const Hero3D = () => {
  const mouse = useRef({ x: 0, y: 0 })
  const [paused, setPaused] = useState(false)
  const reduce = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    [],
  )

  useEffect(() => {
    const onMove = (e) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -((e.clientY / window.innerHeight) * 2 - 1)
    }
    window.addEventListener('pointermove', onMove, { passive: true })

    // stop rendering once the About section fully covers the hero
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 1.05,
      end: 'max',
      onToggle: (self) => setPaused(self.isActive),
    })

    return () => {
      window.removeEventListener('pointermove', onMove)
      st.kill()
    }
  }, [])

  return (
    <div className="hero-3d pointer-events-none absolute inset-0 z-[2]" aria-hidden="true">
      <Canvas
        flat
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, 10], fov: 35 }}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        frameloop={paused ? 'never' : reduce ? 'demand' : 'always'}
        style={{ pointerEvents: 'none' }}
      >
        <Scene mouse={mouse} reduce={reduce} />
      </Canvas>
    </div>
  )
}

export default Hero3D