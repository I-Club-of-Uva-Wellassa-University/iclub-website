import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, useTexture } from '@react-three/drei'
import { ChevronDown } from 'lucide-react'

const COUNT = 23
const RADIUS = 4
const PHOTOS = 23

const images = Array.from({ length: COUNT }, (_, i) => `/stories/${(i % PHOTOS) + 1}.jpg`)

const captions = [
  'Welcome day',
  'Workshop night',
  'Hackathon team',
]
const captionOf = (i) => captions[i] ?? `iClub moment ${i + 1}`

function Card({ url, angle }) {
  const pop = useRef()
  const [hovered, setHovered] = useState(false)

  useFrame((_, dt) => {
    const s = THREE.MathUtils.damp(pop.current.scale.x, hovered ? 1.3 : 1, 6, dt)
    pop.current.scale.set(s, s, s)
  })

  return (
    <group
      position={[Math.sin(angle) * RADIUS, 0, Math.cos(angle) * RADIUS]}
      rotation={[0, angle, 0]}
    >
      <group ref={pop}>
        <Image
          url={url}
          scale={[1.1, 1.5]}
          radius={0.06}
          side={THREE.DoubleSide}
          transparent
          onPointerOver={(e) => (e.stopPropagation(), setHovered(true))}
          onPointerOut={() => setHovered(false)}
        />
      </group>
    </group>
  )
}

function Scene({ sectionRef, onActive, ui }) {
  const ring = useRef()
  const bigs = useRef([])
  const active = useRef(0)

  useFrame((_, dt) => {
    const el = sectionRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    const total = r.height - window.innerHeight
    const progress = THREE.MathUtils.clamp(-r.top / total, 0, 1)

    if (ui.left.current) ui.left.current.style.transform = `translateX(${-progress * 30}px)`
    if (ui.right.current) ui.right.current.style.transform = `translateX(${progress * 30}px)`
    if (ui.bar.current) ui.bar.current.style.transform = `scaleX(${progress})`

    const target = -progress * Math.PI * 2 * ((COUNT - 1) / COUNT)
    ring.current.rotation.y = THREE.MathUtils.damp(ring.current.rotation.y, target, 4, dt)

    const idx =
      ((Math.round((-ring.current.rotation.y / (Math.PI * 2)) * COUNT) % COUNT) + COUNT) % COUNT

    if (idx !== active.current) {
      active.current = idx
      bigs.current.forEach((g, i) => g && (g.visible = i === idx))
      onActive(idx)
    }
  })

  return (
    <group position={[0, -0.7, 0]}>
      <group ref={ring}>
        {images.map((url, i) => (
          <Card key={i} url={url} angle={(i / COUNT) * Math.PI * 2} />
        ))}
      </group>

      <group position={[0, 1.6, 0]}>
        {images.map((url, i) => (
          <group key={i} ref={(g) => (bigs.current[i] = g)} visible={i === 0}>
            <Image url={url} scale={[2.4, 3.3]} radius={0.08} transparent />
          </group>
        ))}
      </group>
    </group>
  )
}

const Stories = () => {
  const sectionRef = useRef(null)
  const [current, setCurrent] = useState(0)
  const ui = { left: useRef(null), right: useRef(null), bar: useRef(null) }
  const pad = (n) => String(n).padStart(2, '0')

  return (
    <section
      ref={sectionRef}
      id="stories"
      className="relative z-10 h-[400vh] bg-gradient-to-b from-[#E1F2FA] to-[#98D5EE]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden">
      
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[65vh] w-[65vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />

        <div className="pointer-events-none absolute left-6 top-28 z-10 md:left-10">
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-950/10 bg-white/50 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.25em] text-sky-900 backdrop-blur-xl">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-sky-500 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-sky-700" />
            </span>
            Stories
          </span>
        </div>

        <div className="pointer-events-none absolute inset-x-0 top-44 z-10 flex items-start justify-between px-6 md:px-10">
          <h2
            ref={ui.left}
            className="text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight text-sky-950 will-change-transform"
          >
            Mo<span className="text-sky-700">ments</span>
          </h2>
          <h2
            ref={ui.right}
            className="text-right text-[clamp(2.5rem,7vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight will-change-transform"
          >
            <span className="block text-transparent [-webkit-text-stroke:2px_#0A3C55]">from</span>
            <span className="block bg-gradient-to-r from-sky-700 to-sky-500 bg-clip-text text-transparent">
              iClub
            </span>
          </h2>
        </div>

        <Canvas camera={{ position: [0, 3.5, 13.5], fov: 35 }} dpr={[1, 1.5]}>
          <Scene sectionRef={sectionRef} onActive={setCurrent} ui={ui} />
        </Canvas>

        <div className="pointer-events-none absolute inset-x-0 bottom-8 z-10 px-6 md:px-10">
          <div className="mx-auto flex max-w-5xl items-end justify-between gap-6">
            <div>
              <p className="text-5xl font-bold tabular-nums text-sky-950 md:text-6xl">
                {pad(current + 1)}
                <span className="text-xl text-sky-700"> / {pad(COUNT)}</span>
              </p>
            </div>

            <div className="flex flex-col items-center text-sky-900">
              <span className="text-xs uppercase tracking-[0.25em]">Scroll</span>
              <ChevronDown size={20} className="animate-bounce" />
            </div>
          </div>

          <div className="mx-auto mt-5 h-[3px] max-w-5xl overflow-hidden rounded-full bg-sky-950/10">
            <div
              ref={ui.bar}
              className="h-full origin-left rounded-full bg-sky-700"
              style={{ transform: 'scaleX(0)' }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Stories