import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const MIN = 2.2 
const MAX = 8
const CALM_WAIT = 1.5 
const ONCE_PER_SESSION = false

const MARK_PATH =
  'M453.4 460.2 L349.9 460 L324.6 492.6 L323.3 460.5 L285.1 498.4 L347.9 499.4 L293.1 575.4 L369.6 575.6 L392.8 543.5 L360.5 542.9 L391.2 499.1 L425.6 498.6 Z'
const LEN = 672 

const smooth = (a, b, x) => {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)))
  return t * t * (3 - 2 * t)
}

const shouldShow = () => {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (ONCE_PER_SESSION && sessionStorage.getItem('iclub-loaded')) return false
  return true
}

const Loader = () => {
  const [show, setShow] = useState(shouldShow)
  const root = useRef(null)
  const panel = useRef(null)
  const path = useRef(null)
  const bar = useRef(null)
  const glow = useRef(null)

  useEffect(() => {
    
    if (!show) {
      if (!window.__iclubLoaded) {
        window.__iclubLoaded = true
        window.dispatchEvent(new Event('loader:exit'))
      }
      return undefined
    }
    window.__iclubLoaded = false

    const html = document.documentElement
    const prevOverflow = html.style.overflow
    html.style.overflow = 'hidden'
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual'
    window.scrollTo(0, 0)

    const p = path.current

    const task = [
      new Promise((res) =>
        document.readyState === 'complete' ? res() : window.addEventListener('load', res, { once: true }),
      ),
      document.fonts?.ready ?? Promise.resolve(),
      ...Array.from(document.querySelectorAll('nav img')).map((img) =>
        img.decode ? img.decode().catch(() => {}) : Promise.resolve(),
      ),
    ]
    let done = 0
    task.forEach((t) =>
      Promise.resolve(t).then(
        () => (done += 1),
        () => (done += 1),
      ),
    )

    const mountedAt = performance.now()
    let lastTick = mountedAt
    let calm = 0
    let t0 = null
    let shown = 0
    let exiting = false
    let tl = null

    const render = (v) => {
      bar.current.style.transform = `scaleX(${v / 100})`
      p.style.strokeDashoffset = `${LEN * (1 - Math.min(1, v / 80))}`
      p.style.fillOpacity = `${smooth(70, 100, v)}`
      glow.current.style.opacity = `${0.25 + (v / 100) * 0.75}`
    }

    const exit = () => {
      exiting = true
      root.current.style.pointerEvents = 'none'
      const ui = root.current.querySelectorAll('.ld-ui')
      const mark = root.current.querySelector('.ld-mark')

      tl = gsap.timeline({
        onComplete: () => {
          html.style.overflow = prevOverflow
          if (ONCE_PER_SESSION) sessionStorage.setItem('iclub-loaded', '1')
          setShow(false)
          ScrollTrigger.refresh()
          window.dispatchEvent(new Event('loader:done'))
        },
      })

      tl.to(ui, { y: -18, opacity: 0, duration: 0.45, stagger: 0.05, ease: 'power2.in' }, 0)
        .to(mark, { scale: 1.2, opacity: 0, duration: 0.6, ease: 'power2.in' }, 0.1)
        .to(panel.current, { yPercent: -100, duration: 1.1, ease: 'power4.inOut' }, 0.35)
        .call(
          () => {
            window.__iclubLoaded = true
            window.dispatchEvent(new Event('loader:exit'))
          },
          null,
          0.75,
        )
    }

    const tick = () => {
      if (exiting) return
      const now = performance.now()
      const frameMs = now - lastTick
      lastTick = now

      if (t0 === null) {
        calm = frameMs < 34 ? calm + 1 : 0
        const waited = (now - mountedAt) / 1000
        if ((waited > 0.4 && calm >= 8) || waited > CALM_WAIT) t0 = now
        else return
      }

      const elapsed = (now - t0) / 1000
      const finishedWork = done >= task.length || elapsed > MAX
      const real = finishedWork ? 100 : (done / task.length) * 100
      const timeCap = Math.min(100, (elapsed / MIN) * 100)
      const target = Math.min(real, timeCap)

      shown += (target - shown) * Math.min(1, (Math.min(frameMs, 50) / 1000) * 5)
      if (target >= 100 && shown > 99.2) shown = 100
      render(shown)
      if (shown >= 100) exit()
    }

    render(0)
    gsap.ticker.add(tick)

    return () => {
      gsap.ticker.remove(tick)
      tl?.kill()
      html.style.overflow = prevOverflow
    }
  }, [show])

  if (!show) return null

  return (
    <div ref={root} className="fixed inset-0 z-[100]" role="status" aria-label="Loading">

      <div
        ref={panel}
        className="absolute inset-x-0 top-0 h-[calc(100vh+9vw)] overflow-hidden bg-sky-950"
        style={{ borderRadius: '0 0 50% 50% / 0 0 9vw 9vw' }}
      >
        <div className="relative h-screen w-full">

          <div
            ref={glow}
            className="absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: 'radial-gradient(circle, rgba(34,170,214,0.38), transparent 65%)', opacity: 0.25 }}
          />

          <div className="ld-ui absolute inset-x-0 top-0 flex items-center justify-between px-6 pt-8 text-xs font-medium uppercase tracking-[0.5em] md:px-10">
            <span className="text-aqua-400">iClub</span>
            <span className="text-night-400">Loading</span>
          </div>

          <div className="absolute inset-0 flex items-center justify-center">
            <svg viewBox="281 456 177 124" className="ld-mark w-[min(46vw,230px)] overflow-visible" fill="none">
              <path
                ref={path}
                d={MARK_PATH}
                stroke="#5FD4F0"
                strokeWidth="2.2"
                strokeLinejoin="round"
                style={{ fill: '#1C82ED', fillOpacity: 0, strokeDasharray: LEN, strokeDashoffset: LEN }}
              />
            </svg>
          </div>

          <div className="absolute inset-x-0 bottom-0 px-6 pb-8 md:px-10">
            <p className="ld-ui ml-auto max-w-[15rem] text-right text-xs leading-relaxed text-night-400 md:text-sm">
              Bridging generations, empowering innovation.
            </p>
            <div className="ld-ui mt-6 h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                ref={bar}
                className="h-full origin-left rounded-full bg-gradient-to-r from-[#1C82ED] to-[#5FD4F0]"
                style={{ transform: 'scaleX(0)' }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Loader