import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Hammer, Rocket } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PARA = "iClub is a department club that inspires students to innovate through technology and give back to society. Through our Technology Avenue, members build practical skills via workshops, projects, and innovation-driven activities, while our Social Charity Avenue encourages meaningful community initiatives. Together, we learn, collaborate, and create a positive impact."

const pillars = [
  { icon: BookOpen, title: 'Learn', text: 'Workshops and sessions led by students and seniors.' },
  { icon: Hammer, title: 'Build', text: 'Real projects that turn classroom ideas into products.' },
  { icon: Rocket, title: 'Grow', text: 'Hackathons and events that push every batch further.' },
]

const About = () => {

  const root = useRef(null)

  useGSAP(() => {
    const mm = gsap.matchMedia()

    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-line', {
        yPercent: 110,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.12,
        scrollTrigger: { trigger: '.about-heading', start: 'top 80%' },
      })

      gsap.from('.about-label', {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: '.about-heading', start: 'top 80%' },
      })

      gsap.from('.about-rule', {
        scaleX: 0,
        transformOrigin: 'left center',
        ease: 'none',
        scrollTrigger: { trigger: '.about-rule', start: 'top 92%', end: 'top 55%', scrub: true } 
      })

      gsap.fromTo('.about-word', { opacity: 0.15 }, {
        opacity: 1,
        ease: 'none',
        stagger: 0.1,
        scrollTrigger: { trigger: '.about-text', start: 'top 80%', end: 'bottom 45%', scrub: true },
      })

      gsap.from('.about-card', {
        y: 70,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.15,
        scrollTrigger: { trigger: '.about-cards', start: 'top 85%' },
      })

      gsap.to('.about-glow', {
        yPercent: -40,
        ease: 'none',
        scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })

    })
    return () => mm.revert()
  }, { scope: root },)

  return (
    <section ref={root} id='about' className='relative min-h-screen overflow-hidden bg-sky-950 px-6 py-28 rounded-t-[70px] md:px-10'>

      <div className="about-glow pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-aqua-400/15 blur-3xl" />

      <div />

      <div className='relative mx-auto max-w-5xl'>
        <p className='about-label text-sm font-medium uppercase tracking-[0.3em] text-aqua-400'>About</p>
        <div className='about-ruler mt-4 h-px w-full bg-gradient-to-r from-aqua-400/60 to-transparent' />

        <h2 className='about-heading mt-10 text-4xl font-bold leading-[1.1] text-white md:text-6xl'>
          <span className='block overflow-hidden pb-2'>
            <span className='about-line block'>Bridging Generation</span>
          </span>
          <span className='block overflow-hidden pb-2'>
            <span className='about-line block text-aqua-400'>enpowering generation</span>
          </span>
        </h2>

        <p className='about-text mt-10 max-w-3xl text-xl leading-relaxed text-white md:text-2xl'> 
          {PARA.split(' ').map((word, i) => (
            <span key={i} className='about-word mr-[0.25em] inline-block'>
              {word}
            </span>
          ))}
        </p>

        <div className='about-cards mt-16 grid gap-5 md:grid-cols-3'>
          {pillars.map(({icon: Icon, title, text}) => (
            <div key={title} className='about-card rounded-3xl boder border-white/10 bg-white/5 p-7 backdrop-blur-xl'>
              <span className='flex h-12 w-12 items-center justify-center rounded-2xl bg-aqua-400 text-night-900'>
                <Icon size={22} />
              </span>
              <h3 className='mt-5 text-xl font-semibold text-white'>{title}</h3>
              <p className='mt-2 text-night-400'>{text}</p>
            </div>
          ))}
        </div>

      </div>

    </section>
  )
}

export default About