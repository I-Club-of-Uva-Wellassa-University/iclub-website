import { lenis } from '../src/components/smoothScroll'
import { X, Menu } from 'lucide-react'
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react'


const links = [
  { label: 'About', href: '#about' },
  { label: 'TimeLine', href: '#timeLine' },
  { label: 'Team', href: '#team'},
  { label: 'Stories', href: '#stories' },
  { label: 'Contact', href: '#contact' },
]

const Navbar = () => {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('Home')
  const [scrolled, setScrolled] = useState(false)
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false })
  const itemRefs = useRef({})
  const isManualScrolling = useRef(false)
  const scrollTimeout = useRef(null)

  const movePill = () => {
    const mv = itemRefs.current[active]
    if (mv) {
      setPill({
        left: mv.offsetLeft,
        top: mv.offsetTop,
        width: mv.offsetWidth,
        height: mv.offsetHeight,
        ready: true,
      })
    } else {
      setPill((prev) => ({ ...prev, ready: false }))
    }
  }

  useLayoutEffect(movePill, [active])

  useEffect(() => {
    window.addEventListener('resize', movePill)
    return () => window.removeEventListener('resize', movePill)
  }, [active])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setScrolled(scrollY > 20)

      if (isManualScrolling.current) return

      if (scrollY < 180) {
        setActive('Home')
        return
      }

      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      if (scrollY + windowHeight >= fullHeight - 80) {
        setActive('Contact')
        return
      }

      const triggerPoint = windowHeight * 0.42
      let currentSection = 'Home'

      for (const link of links) {
        const el = document.getElementById(link.href.slice(1))
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= triggerPoint) {
            currentSection = link.label
          }
        }
      }

      setActive(currentSection)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    if (open) lenis?.stop()
    else lenis?.start()
    return () => {
      document.body.style.overflow = ''
      lenis?.start()
    }
  }, [open])

  const handleNavClick = (e, link) => {
    e.preventDefault()
    setActive(link.label)
    setOpen(false)
  
    const target = document.getElementById(link.href.slice(1))
    if (!target) return
  
    isManualScrolling.current = true
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current)
  
    setTimeout(() => {
      if (lenis) {
        lenis.start()
        lenis.scrollTo(target, { duration: 1.4, force: true })
      } else {
        target.scrollIntoView({ behavior: 'smooth' })
      }
    }, 50)
  
    scrollTimeout.current = setTimeout(() => {
      isManualScrolling.current = false
    }, 1700)
  }

  const glass = 'border border-white/10 bg-night-900/85 backdrop-blur-xl shadow-lg shadow-black/30'

  return (
    <nav className='fixed top-0 left-0 z-50 h-20 w-full'>
      <div className='relative z-50 flex h-full items-center justify-between px-6 md:px-10'>
        <a
          href='#hero'
          onClick={(e) => {
            e.preventDefault()
            setActive('Home')
            if (lenis) lenis.scrollTo(0, { duration: 1.4 })
            else window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className='group relative flex h-12 items-center overflow-hidden rounded-full bg-gradient-to-l from-cyan-300 to-cyan-100 px-6 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(137,203,219,0.35)]'
        >
          <img
            src='/Logo/ilogo.png'
            alt='logo'
            className='relative h-auto w-[100px] object-contain transition-transform duration-300 group-hover:scale-105'
          />
          <span className='pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
        </a>

        <ul className={`relative hidden h-14 items-center gap-4 rounded-4xl px-2 md:flex ${glass}`}>
          <span
            className={`absolute rounded-full bg-cyan-200 shadow-md shadow-cyan-200/20 transition-[left,width,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
              pill.ready ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
          />
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                ref={(mv) => (itemRefs.current[link.label] = mv)}
                onClick={(e) => handleNavClick(e, link)}
                className={`relative z-10 block rounded-full px-5 py-2 text-[14px] transition-colors duration-300 ${
                  active === link.label ? 'font-medium text-ink' : 'text-night-400 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button className='group relative hidden h-12 items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-cyan-100 to-cyan-300 px-7 text-[16px] font-medium text-ink shadow-lg shadow-cyan-300/10 transition-all duration-300 hover:scale-105 hover:shadow-cyan-300/30 md:flex'>
          <span className='absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
          <span className='relative'>Register</span>
        </button>

        <button
          onClick={() => setOpen(!open)}
          className={`flex h-12 w-12 items-center justify-center rounded-full text-white md:hidden ${glass}`}
          aria-label='Toggle menu'
        >
          {!open ? <Menu /> : <X />}
        </button>
      </div>

      <div
        aria-hidden={!open}
        className={`fixed inset-0 z-40 flex flex-col justify-center bg-night-950 px-8 transition-[clip-path] duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] md:hidden ${
          open ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
        style={{
          clipPath: open
            ? 'circle(150% at calc(100% - 48px) 40px)'
            : 'circle(0% at calc(100% - 48px) 40px)',
        }}
      >
        <ul className='flex flex-col gap-2'>
          {links.map((link, i) => (
            <li key={link.label} className='overflow-hidden'>
              <a
                href={link.href}
                tabIndex={open ? 0 : -1}
                onClick={(e) => handleNavClick(e, link)}
                style={{ transitionDelay: open ? `${250 + i * 80}ms` : '0ms' }}
                className={`block font-display text-[18vw] uppercase leading-[0.95] transition-transform duration-[600ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${
                  open ? 'translate-y-0' : 'translate-y-[110%]'
                } ${active === link.label ? 'text-cyan-200' : 'text-white'}`}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href='#contact'
          tabIndex={open ? 0 : -1}
          onClick={(e) => handleNavClick(e, { label: 'Contact', href: '#contact' })}
          style={{ transitionDelay: open ? '700ms' : '0ms' }}
          className={`mt-10 flex h-12 w-fit items-center rounded-full bg-gradient-to-r from-cyan-100 to-cyan-300 px-7 font-medium text-ink transition-all duration-500 ${
            open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
          }`}
        >
          Register
        </a>
      </div>
    </nav>
  )
}

export default Navbar