import React, { useRef } from 'react'
import { BaublesBackground } from '../components/baubles-background'
import { ArrowBigRight } from 'lucide-react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const HeroSection = () => {
  const sectionRef = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: '#about',
          start: 'top bottom',
          end: 'top top',
          scrub: true,
        },
      })

      tl.to(sectionRef.current, {
        scale: 1,
        transformOrigin: 'center top',
        borderRadius: 1,
        ease: 'none',
      }).to('.hero-dim', { opacity: 0.35, ease: 'none'}, 0)
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
      <BaublesBackground eventSource={sectionRef} />
      <div className="hero-dim pointer-events-none absolute inset-0 z-[5] opacity-1" />

      <div className="pointer-events-none relative z-50 flex h-full flex-col items-center justify-center px-6 text-center">
        
        <img src="/public/Logo/logo-2.png" alt="heroLogo" className='max-h-[60vh] w-[min(85vw,650px)]' />

        <p className='mt-6 max-w-2xl text-base font-semibold leading-relaxed text-night-900/80 md:text-lg'>
          <span className='text-xl text-sky-600'>iClub</span> is the student community of the Information & Communication Technology at Uva Wellassa University of Sri Lanka.
          We bring every batch together to learn, build, and grow through workshops, projects, and hackathons.
        </p>

        <div className='pointer-events-auto mt-8 flex flex-wrap items-center justify-center gap-4'>
          <a href="#contact" className='group flex h-12 items-center gap-2 rounded-full bg-night-900 px-7 font-medium text-white shadow-lg shadow-night-900/20 transition-all duration-300 hover:scale-105 hover:bg-night-800'>
            Register
            <ArrowBigRight size={18} className='transition-transform duration-300 group-hover:translate-x-1' />
          </a>
          <a href="#timeline" className='flex h-12 items-center rounded-full border border-night-900/20 bg-white/40 px-7 font-medium text-night-900 backdrop-blur-xl transition-all duration-300 hover:bg-white/70'>
            Explore
          </a>
        </div>

      </div>
    </section>
  )
}

export default HeroSection