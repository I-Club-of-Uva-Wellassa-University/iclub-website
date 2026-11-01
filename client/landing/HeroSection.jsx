import React, { useEffect, useRef, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Hero3D from '../components/Hero3d'
import SplashCursor from '@/components/SplashCursor'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const BLOBS = [
  {pos: '-left-[12%] -top-[18%] h-[58vmax] w-[58vmax]', color: 'rgba(63,128,232,0.42)', depth: 70},
  {pos: '-right-[14%] top-[8%] h-[52vmax] w-[52vmax]', color: 'rgba(34,170,214,0.48)', depth: 110},
  {pos: 'left-[18%] -bottom-[28%] h-[56vmax] w-[56vmax]', color: 'rgba(137,203,219,0.8)', depth: 50},
  {pos: 'right-[22%] -bottom-[14%] h-[34vmax] w-[34vmax]', color: 'rgba(44,52,130,0.2)', depth: 90},
]

const GLYPHS = '!<>-_\\/[]{}=+*^?#01'

const scramble = (el, p) => {
  const final = el.dataset.final
  const n = Math.floor(p * final.length)
  el.textContent =
    final.slice(0, n) +
    [...final.slice(n)]
      .map((c) => (c === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]))
      .join('')
}

const HeroSection = () => {
  const sectionRef = useRef(null)
  const blockRef = useRef(null)
  const [revealed, setRevealed] = useState(false)
  const [covered, setCovered] = useState(false)
  const [canInk] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: hover) and (pointer: fine)').matches,
  )
  const inkPlayed = useRef(false)

  useEffect(() => {
    const st = ScrollTrigger.create({
      start: () => window.innerHeight * 1.05,
      end: 'max',
      onToggle: (self) => setCovered(self.isActive), 
    })
    return () => st.kill()
  }, [])

  const showInk = canInk && revealed && !covered
  const playInkIntro = !inkPlayed.current
  useEffect(() => {
    if (showInk) inkPlayed.current = true
  }, [showInk])

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {

      const section = sectionRef.current

      gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      })
      .to(section, {
        scale: 1,
        transformOrigin: 'center top',
        borderRadius: 1,
        ease: 'none'
      })
      .to('.hero-dim', {
        opacity: 0.35,
        ease: 'none'
      }, 0)

      const drifts = gsap.utils.toArray('.aurora-drift').map((el) => 
        gsap.to(el, {
          x: gsap.utils.random(-90, 90),
          y: gsap.utils.random(-70, 70),
          scale: gsap.utils.random(0.9, 1.15),
          duration: gsap.utils.random(12, 20),
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        }),
      )
      
      ScrollTrigger.create({
        start: () => window.innerHeight * 1.05,
        end: 'max',
        onToggle: (self) => drifts.forEach((t) => (self.isActive ? t.pause() : t.resume())),
      })

      const parallax = gsap.utils.toArray('.aurora-par').map((el) => ({
        x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3' }),
        y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3' }),
        d: parseFloat(el.dataset.depth),
      }))
      const onMove = (e) => {
        const r = section.getBoundingClientRect()
        const nx = (e.clientX - r.left) / r.width - 0.5
        const ny = (e.clientY - r.top) / r.height - 0.5
        parallax.forEach(({ x, y, d }) => {
          x(-nx * d)
          y(-ny * d)
        })
      }
      section.addEventListener('pointermove', onMove)

      const magnetCleanups = window.matchMedia('(hover: hover)').matches
        ? gsap.utils.toArray('.magnet').map((el) => {
          const mx = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'power3' })
          const my = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'power3' })
          const move = (e) => {
            const r = el.getBoundingClientRect()
            mx((e.clientX - (r.left + r.width / 2)) * 0.35)
            my((e.clientY - (r.top + r.height / 2)) * 0.35)
          }
          const leave = () => {
            mx(0)
            my(0)
          }
          el.addEventListener('pointermove', move)
          el.addEventListener('pointerleave', leave)
          return () => {
            el.removeEventListener('pointermove', move)
            el.removeEventListener('pointerleave', leave)
          }
        })
      : []

      const decodeEls = gsap.utils.toArray('.decode')
      decodeEls.forEach((el) => scramble(el, 0))
      const startDecode = () => decodeEls.forEach((el, i) => {
        const o = {p : 0}
        gsap.to(o, {
          p: 1,
          duration: 1.4,
          delay: i * 0.25,
          ease: 'power1.in',
          onUpdate: () => scramble(el, o.p),
          onComplete: () => (el.textContent = el.dataset.final),
        })
      })

      const intro = gsap.timeline({ paused: true })
      intro 
        .from('.hero-bg', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0)
        .from('.hero-3d', { opacity: 0, duration: 1.6, ease: 'power2.out' }, 0.15)
        //.from('.hero-badge', { y: 20, opacity: 0, duration: 0.7, ease: 'power3.out' }, 0)
        .from('.hero-line', { yPercent: 110, duration: 1.1, stagger: 0.14, ease: 'power4.out' }, 0)
        .call(startDecode, null, 0.01)
        .call(() => setRevealed(true), null, 0.01)
        .from('.hero-sub', { y: 24, opacity: 0, duration: 0.9, ease: 'power3.out' }, 0.5)
        .fromTo('.hero-cta', { y: 24, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }, 0.7)

      const play = () => intro.play()
      if (window.__iclubLoaded) play()
      else window.addEventListener('loader:exit', play, { once: true })

      return () => {
        window.removeEventListener('loader:exit', play)
        section.removeEventListener('pointermove', onMove)
        magnetCleanups.forEach((fn) => fn())
      }

    })
      return () => mm.revert()
    },
    { scope: sectionRef }
  )

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="sticky top-0 z-0 h-screen w-full overflow-hidden bg-gradient-to-b from-[#eaeef6] to-[#98D5EE]"
    >
      
      <div className='hero-bg pointer-events-none absolute inset-0 z-0 overflow-hidden'>
        {BLOBS.map((b, i) => (
          <div key={i} className={`aurora-par absolute ${b.pos}`} data-depth={b.depth}>
            <div className='aurora-drift h-full w-full rounded-full will-change-transform' style={{ background: `radial-gradient(circle at 50% 50%, ${b.color}, transparent 68%)` }} />
          </div>
        ))}
      </div>

      <div className='pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_at_center,rgba(234,238,246,0.7)_0%,transparent_65%)]' />
      <div className='hero-dim pointer-events-none absolute inset-0 z-[5] opacity-1' />

      <Hero3D contentRef={blockRef} />

      {showInk && (
        <SplashCursor
          contained
          theme="light"
          rainbow={false}
          colors={['#1C82ED', '#5FD4F0', '#1B1E4C']}
          colorSpeed={0.5}
          intensity={1}
          size={0.8}
          force={0.8}
          swirl={3}
          trail={1.2}
          shading={0.6}
          quality="medium"
          intro={playInkIntro}
          zIndex={10}
        />
      )}

      <div className='pointer-events-none relative z-20 flex h-full flex-col items-center justify-center px-6 text-center'>

        <div ref={blockRef} className='flex flex-col items-center'>
          <h1 className='text-[clamp(2.85rem,6.4vw,5rem)] font-extrabold leading-[1.05] tracking-tight md:text-[clamp(1.6rem,5.6vw,5rem)]'>
            <span className='block overflow-hidden pb-2'>
              <span className='hero-line block whitespace-nowrap'>
                <span className='relative inline-block text-sky-950'>
                  <span className='invisible'>Bridging generations,</span>
                  <span className='decode absolute inset-0' data-final='Bridging generations,'>Bridging generations,</span>
                </span>
              </span>
            </span>

            <span className='block overflow-hidden pb-3'>
              <span className='hero-line block whitespace-nowrap'>
                <span className='relative inline-block'>
                  <span className='invisible'>empowering innovation.</span>
                  <span className='decode absolute inset-0 bg-gradient-to-r from-sky-700 via-sky-500 to-sky-700 bg-clip-text text-transparent' data-final="empowering innovation.">
                    empowering innovation.
                  </span>
                </span>
              </span>
            </span>
          </h1>

          <p className='hero-sub mt-5 max-w-2xl text-base font-medium leading-relaxed text-night-900/80 md:mt-6 md:text-lg'>
            iClub is the student community of Information & Communication Technology. We bring every
            batch together to learn, build, and grow through workshops, projects, and hackathons.
          </p>

          <div className='pointer-events-auto mt-7 flex flex-wrap items-center justify-center gap-4 md:mt-9'>
            <div className='magnet -m-3 p-3'>
              <a href="#contact" className='hero-cta group flex h-12 items-center gap-2 rounded-full bg-night-900 px-7 font-medium text-white shadow-lg shadow-night-900/20 transition-[background-color,border-color,box-shadow,scale] duration-300 hover:scale-105 hover:bg-night-800'>
                Register
                <ArrowRight size={18} className='transition-transform duration-300 group-hover:translate-x-1' />
              </a>
            </div>
            <div className='magnet -m-3 -3'>
              <a href="#stories" className='hero-cta flex h-12 items-center rounded-full border border-night-900/20 bg-white/50 px-7 font-medium text-night-900 backdrop-blur-xl transition-[background-color,border-color,box-shadow,scale] duration-300 hover:scale-105 hover:bg-white/80'>
                Explore
              </a>
            </div>
          </div>
        </div>

      </div>

    </section>
  )
}

export default HeroSection