import { X, Menu, ArrowUp } from 'lucide-react';
import React, { use, useEffect, useLayoutEffect, useRef, useState } from 'react'

const links = [
    { label: 'About', href: '#about' },
    { label: 'Stories', href: '#stories' },
    { label: 'TimeLine', href: '#timeLine' },
    { label: 'Contact', href: '#contact' },
]

const Navbar = () => {

  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('Home')
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [pill, setPill] = useState({ left: 0, top: 0, width: 0, height: 0, ready: false })
  const itemRefs = useRef({})

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
    }
  }

  useLayoutEffect(movePill, [active])

  useEffect(() => {
    window.addEventListener('resize', movePill)
    return () => window.removeEventListener('resize', movePill)
  }, [active])

  useEffect(() => {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((e) => {
                if (e.isIntersecting) {
                    const match = links.find((l) => l.href === `#${e.target.id}`)
                    if (match) setActive(match.label)
                }
            })
        }, 
        { rootMargin: '-45% 0px -50% 0px' }
    )
    links.forEach((l) => {
        const mv = document.getElementById(l.href.slice(1))
        if (mv) observer.observe(mv)
    })
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    setMounted(true)
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  
  const glass = `border border-white/10 backdrop-blur-xl shadow-lg shadow-black/30 transition-colors duration-300 ${
    scrolled ? 'bg-night-900/85' : 'bg-night-900/50'
  }`

  return (
    <nav className='fixed top-0 left-0 z-50 h-20 w-full'>
        <div className='flex h-full items-center justify-between px-6 md:px-10'>
                
            <a href="#hero" 
            onClick={(e) => {
                e.preventDefault()
                setActive('Home')
                window.scrollTo({ top: 0, behavior: 'smooth' })
            }} 
                className="relative group flex h-12 items-center overflow-hidden rounded-full bg-gradient-to-l from-cyan-300 to-cyan-100 px-6 shadow-lg transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(137,203,219,0.35)]"
            >
                <img src="/Logo/ilogo.png" alt="iClub logo" loading="eager" decoding="sync" className='relative h-auto w-[100px] object-contain transition-transform duration-300 group-hover:scale-105' />
                <span className='pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/70 to-transparent transition-transform duration-700 group-hover:translate-x-full' />
            </a>
            
            <ul className={`relative hidden h-14 items-center gap-4 rounded-4xl px-2 md:flex ${glass}`}>
                <span  
                    className={`absolute rounded-full bg-cyan-200 shadow-md shadow-cyan-200/20 transition-[left,width] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                        pill.ready ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ left: pill.left, top: pill.top, width: pill.width, height: pill.height }}
                />
                {links.map((link) => (
                    <li key={link.label}>
                        <a href={link.href} 
                            ref={(mv) => (itemRefs.current[link.label] = mv)}
                            onClick={() => setActive(link.label)} 
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

            <button onClick={() => setOpen(!open)}
                className={`flex h-12 w-12 items-center justify-center rounded-full text-white md:hidden ${glass}`}
                aria-label='Toggle menu'
            >
                {!open ? <Menu /> : <X />}
            </button>

        </div> 

        <ul
            className={`mx-6 flex flex-col gap-1 rounded-3xl p-3 text-center md:hidden ${glass} transition-all duration-300 ${
                open ? 'translate-y-0 opacity-100' : 'pointer-events-none -translate-y-3 opacity-0'
            }`}
        >
            {links.map((link) => (
                <li key={link.label}>
                    <a href={link.href}
                        onClick={() => { setActive(link.label); setOpen(false) }}
                        className={`block rounded-full px-5 py-2 transition-colors ${
                            active === link.label ? 'bg-cyan-200 font-medium text-ink' : 'text-night-400 hover:text-white'
                        }`}
                    >
                        {link.label}
                    </a>
                </li>
            ))}
        </ul>
    </nav>
  )
}

export default Navbar