import React, { useRef, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { Image, useTexture } from '@react-three/drei'
import { ChevronDown } from 'lucide-react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, useGSAP)
// on phones, don't recalculate everything every time the address bar slides in/out
ScrollTrigger.config({ ignoreMobileResize: true })

const COUNT = 23
const RADIUS = 4
const PHOTOS = 23
const INTRO = 1
const START = 0.6 

const FIT_WIDTH = 11 
const BIG_MAX = 2.3
const BIG_W = 2.4 
const BIG_BASE_Y = 1.6 
const BIG_HALF_H = 1.65 
const RING_DROP = 1.73
const PHOTO_FOOT = 0.05

// no "stuck hover" on touch screens
const CAN_HOVER = typeof window !== 'undefined' && window.matchMedia('(hover: hover)').matches

const images = Array.from({ length: COUNT }, (_, i) => `/stories/${(i % PHOTOS) + 1}.jpg`)

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
          onPointerOver={CAN_HOVER ? (e) => (e.stopPropagation(), setHovered(true)) : undefined}
          onPointerOut={CAN_HOVER ? () => setHovered(false) : undefined}
        />
      </group>
    </group>
  )
}

function Scene({ sectionRef, zoneRef, onActive, ui, portal }) {
  const ring = useRef()
  const layout = useRef()
  const bigGroup = useRef()
  const bigs = useRef([])
  const active = useRef(0)

  useFrame(({ camera, size }, dt) => {
    const aspect = size.width / size.height
    const worldH = 2 * camera.position.length() * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2))

    
    const zoneEl = zoneRef.current
    const zTop = zoneEl ? zoneEl.offsetTop : 0 
    const zH = zoneEl ? Math.max(zoneEl.offsetHeight, 120) : size.height
    const zoneFrac = zH / size.height
    const full = zoneFrac > 0.98 

    const pScreen = THREE.MathUtils.clamp((1.1 - aspect) / 0.55, 0, 1)
    const widthFit = (aspect * worldH) / FIT_WIDTH

    const bFill = THREE.MathUtils.clamp(
      ((zoneFrac * worldH) / Math.min(1, widthFit) - (RING_DROP - PHOTO_FOOT)) / 3.3,
      1,
      BIG_MAX,
    )
    const bigS = full ? 1 + pScreen * (bFill - 1) : bFill
    const blend = full ? pScreen : 1

    
    const compH = RING_DROP - PHOTO_FOOT + 3.3 * bigS
    const fit = Math.min(1, widthFit, (0.94 * zoneFrac * worldH) / compH)

    
    const compCenter = (-RING_DROP + (3.3 * bigS - PHOTO_FOOT)) / 2
    const dyPx = zTop + zH / 2 - size.height / 2
    const worldPerPx = worldH / (size.height * fit)
    const yZone = -dyPx * worldPerPx - compCenter

    layout.current.position.y = -0.7 + blend * (yZone + 0.7)
    bigGroup.current.scale.setScalar(bigS)
    bigGroup.current.position.y = BIG_BASE_Y + (bigS - 1) * BIG_HALF_H

    const z = portal.current.s * fit
    if (Math.abs(camera.zoom - z) > 0.0005) {
      camera.zoom = z
      camera.updateProjectionMatrix()
    }

    const el = sectionRef.current
    if (!el) return

    const r = el.getBoundingClientRect()
    const intro = window.innerHeight * INTRO
    const total = r.height - window.innerHeight - intro
    const progress = THREE.MathUtils.clamp((-r.top - intro) / total, 0, 1)

    const drift = aspect < 1 ? 10 : 30
    if (ui.left.current) ui.left.current.style.transform = `translateX(${-progress * drift}px)`
    if (ui.right.current) ui.right.current.style.transform = `translateX(${progress * drift}px)`
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
    <group ref={layout}>
      <group ref={ring}>
        {images.map((url, i) => (
          <Card key={i} url={url} angle={(i / COUNT) * Math.PI * 2} />
        ))}
      </group>

      <group ref={bigGroup}>
        {images.map((url, i) => (
          <group key={i} ref={(g) => (bigs.current[i] = g)} visible={i === 0}>
            <Image url={url} scale={[BIG_W, 1.6]} radius={0.08} transparent />
          </group>
        ))}
      </group>
    </group>
  )
}

const Stories = () => {
  const sectionRef = useRef(null)
  const zoneRef = useRef(null)
  const portal = useRef({ s: 1 }) // zoom of the 3D view, tweened by the timeline below
  const [current, setCurrent] = useState(0)
  const ui = { left: useRef(null), right: useRef(null), bar: useRef(null) }
  const pad = (n) => String(n).padStart(2, '0')

  useGSAP(
    () => {
      const mm = gsap.matchMedia()
      const inset = ((1 - START) / 2) * 100

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const tl = gsap.timeline({
          defaults: { ease: 'power2.inOut', duration: 1 },
          scrollTrigger: {
            trigger: sectionRef.current,
            start: 'top top',
            end: () => `+=${window.innerHeight * INTRO}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })

        tl.fromTo(
          '.portal-clip',
          { clipPath: `inset(${inset}% ${inset}% ${inset}% ${inset}% round 32px)` },
          { clipPath: 'inset(0% 0% 0% 0% round 0px)' },
          0,
        )
          .fromTo('.stories-overlay', { scale: START }, { scale: 1 }, 0)
          .fromTo(portal.current, { s: START }, { s: 1 }, 0)
          .fromTo(
            '.portal-ring',
            { top: `${inset}%`, right: `${inset}%`, bottom: `${inset}%`, left: `${inset}%`, borderRadius: 32 },
            { top: '0%', right: '0%', bottom: '0%', left: '0%', borderRadius: 0 },
            0,
          )
          .to('.portal-ring', { opacity: 0, duration: 0.25, ease: 'none' }, 0.75)
          .to('.portal-caption', { opacity: 0, y: 30, duration: 0.35, ease: 'power1.out' }, 0)
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        gsap.set('.portal-ring, .portal-caption', { display: 'none' })
      })

      return () => mm.revert()
    },
    { scope: sectionRef },
  )

  return (
    <section
      ref={sectionRef}
      id="stories"
      // 400vh for the ring + 100vh (INTRO) for the portal opening
      className="relative z-10 h-[500vh] bg-gradient-to-b from-[#E1F2FA] to-[#98D5EE]"
    >
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-sky-950">
    
        <div className="portal-caption pointer-events-none absolute inset-x-0 bottom-[11%] z-0 flex flex-col items-center text-center md:bottom-[3%]">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-aqua-400">Chapter 02</p>
          <h2 className="mt-2 text-[clamp(1.75rem,4vw,3rem)] font-extrabold leading-none text-white">
            Our <span className="text-aqua-400">Stories</span>
          </h2>
          <ChevronDown size={20} className="mt-2 hidden animate-bounce text-night-400 md:block" />
        </div>

        <div className="portal-clip absolute inset-0 z-10 bg-gradient-to-b from-[#E1F2FA] to-[#98D5EE]">
          <div className="stories-overlay pointer-events-none absolute inset-0 will-change-transform">
            <div className="absolute left-1/2 top-1/2 h-[65vh] w-[65vh] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/60 blur-3xl" />
          </div>

          <div className="absolute inset-0">
            <Canvas
              camera={{ position: [0, 3.5, 13.5], fov: 35 }}
              dpr={[1, 1.5]}
              style={{ touchAction: 'pan-y' }}
            >
              <Scene sectionRef={sectionRef} zoneRef={zoneRef} onActive={setCurrent} ui={ui} portal={portal} />
            </Canvas>
          </div>

          <div className="stories-overlay pointer-events-none absolute inset-0 flex flex-col will-change-transform lg:block">
            {/* header */}
            <div className="relative z-10 shrink-0 lg:contents">
              <div className="mt-4 flex flex-col items-start gap-1 px-6 md:px-10 lg:absolute lg:inset-x-0 lg:top-44 lg:z-10 lg:mt-0 lg:flex-row lg:justify-between lg:px-10 [@media(max-height:520px)]:hidden">
                <h2
                  ref={ui.left}
                  className="text-[clamp(2.25rem,10vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight text-sky-950 will-change-transform md:text-[clamp(2.5rem,7vw,6.5rem)]"
                >
                  Mo<span className="text-sky-700">ments</span>
                </h2>
                <h2
                  ref={ui.right}
                  className="text-[clamp(2.25rem,10vw,6.5rem)] font-extrabold leading-[0.9] tracking-tight will-change-transform md:text-[clamp(2.5rem,7vw,6.5rem)] lg:text-right"
                >
                  <span className="mr-[0.25em] text-transparent [-webkit-text-stroke:2px_#0A3C55] lg:mr-0 lg:block">
                    from
                  </span>
                  <span className="bg-gradient-to-r from-sky-700 to-sky-500 bg-clip-text text-transparent lg:block">
                    iClub
                  </span>
                </h2>
              </div>
            </div>

            <div ref={zoneRef} className="min-h-0 flex-1 lg:absolute lg:inset-0" />

            {/* footer (raised on phones so the browser toolbar can't cover it) */}
            <div className="relative z-10 shrink-0 px-6 pb-24 md:px-10 lg:absolute lg:inset-x-0 lg:bottom-8 lg:pb-0">
              <div className="mx-auto flex max-w-5xl items-end justify-between gap-6">
                <p className="text-4xl font-bold tabular-nums text-sky-950 md:text-6xl">
                  {pad(current + 1)}
                  <span className="text-lg text-sky-700 md:text-xl"> / {pad(COUNT)}</span>
                </p>

                <div className="flex flex-col items-center text-sky-900">
                  <span className="text-[10px] uppercase tracking-[0.25em] md:text-xs">Scroll</span>
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
        </div>

        <div className="portal-ring pointer-events-none absolute inset-0 z-20 border border-white/20 shadow-[0_0_120px_rgba(137,203,219,0.25)]" />
      </div>
    </section>
  )
}

export default Stories