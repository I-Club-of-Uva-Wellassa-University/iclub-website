import React, { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'
import { ChevronDown } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const C = {
  c: 'text-[#5F7389]',
  k: 'text-[#6FB6FF]',
  v: 'text-[#BFE9F7]',
  n: 'text-white',
  s: 'text-aqua-400',
  p: 'text-night-400',
  f: 'text-[#A5B4FC]',
}

const CODE = [
  { i: 0, t: [['// iClub.js', 'c']] },
  { i: 0, t: [['const ', 'k'], ['iClub', 'v'], [' = {', 'p']] },
  { i: 1, t: [['type', 'n'], [': ', 'p'], ['"department club"', 's'], [',', 'p']] },
  { i: 1, t: [['mission', 'n'], [': [', 'p']] },
  { i: 2, t: [['"innovate through technology"', 's'], [',', 'p']] },
  { i: 2, t: [['"give back to society"', 's'], [',', 'p']] },
  { i: 1, t: [['],', 'p']] },
  { i: 1, t: [['avenues', 'n'], [': {', 'p']] },
  { i: 2, t: [['technology', 'n'], [': [', 'p']] },
  { i: 3, t: [['"workshops"', 's'], [',', 'p']] },
  { i: 3, t: [['"projects"', 's'], [',', 'p']] },
  { i: 3, t: [['"innovation-driven activities"', 's'], [',', 'p']] },
  { i: 2, t: [['],', 'p']] },
  { i: 2, t: [['socialCharity', 'n'], [': [', 'p']] },
  { i: 3, t: [['"meaningful community initiatives"', 's'], [',', 'p']] },
  { i: 2, t: [['],', 'p']] },
  { i: 1, t: [['},', 'p']] },
  { i: 0, t: [['}', 'p']] },
  { i: 0, t: [] },
  { i: 0, t: [['iClub', 'v'], ['.', 'p'], ['run', 'f'], ['()', 'p']] },
]

const LINES = CODE.map((line) => {
  let col = line.i * 2
  const chars = line.t.flatMap(([text, color]) =>
    [...text].map((ch) => ({ ch, color: C[color], col: ++col })),
  )
  return { indent: line.i * 2, chars }
})

const Typed = ({ text, cls }) =>
  [...text].map((ch, i) => (
    <span key={i} className={`ch ${cls}`} data-l="t">
      {ch}
    </span>
  ))

const About = () => {
  const root = useRef(null)
  const codebox = useRef(null)
  const status = useRef(null)
  const rows = useRef([])
  const nums = useRef([])

  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.about-label',
          { y: 20, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.about-label', start: 'top 88%' },
          },
        )
        gsap.from('.about-rule', {
          scaleX: 0,
          transformOrigin: 'left center',
          ease: 'none',
          scrollTrigger: { trigger: '.about-rule', start: 'top 92%', end: 'top 55%', scrub: true },
        })
        gsap.from('.about-line', {
          yPercent: 110,
          duration: 1,
          ease: 'power4.out',
          stagger: 0.12,
          scrollTrigger: { trigger: '.about-heading', start: 'top 80%' },
        })

        gsap.fromTo(
          codebox.current,
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: { trigger: codebox.current, start: 'top 88%' },
          },
        )

        ScrollTrigger.create({
          trigger: '.about-left',
          start: 'top 128px',
          endTrigger: codebox.current,
          end: 'bottom bottom',
          pin: true,
          pinSpacing: false,
        })

        const chars = gsap.utils.toArray('.ch')
        const N = chars.length
        let prevIdx = -1
        let prevLine = -1

        const paint = (p) => {
          const idx = Math.min(N - 1, Math.floor(p * N + 0.0001) - 1)
          if (idx === prevIdx) return
          if (prevIdx >= 0 && chars[prevIdx]) chars[prevIdx].style.boxShadow = ''
          prevIdx = idx

          if (prevLine >= 0 && rows.current[prevLine] && nums.current[prevLine]) {
            rows.current[prevLine].style.background = ''
            nums.current[prevLine].style.color = ''
            prevLine = -1
          }

          if (idx < 0) {
            if (status.current) status.current.textContent = 'Ln 1, Col 1'
            return
          }

          const el = chars[idx]
          if (!el) return
          el.style.boxShadow = '2px 0 0 0 #5FD4F0'
          const l = el.dataset.l
          if (l === 't') {
            if (status.current) status.current.textContent = idx === N - 1 ? 'Done · 0 errors' : 'Running…'
          } else {
            prevLine = Number(l) - 1
            if (rows.current[prevLine]) rows.current[prevLine].style.background = 'rgba(255,255,255,0.05)'
            if (nums.current[prevLine]) nums.current[prevLine].style.color = '#5FD4F0'
            if (status.current) status.current.textContent = `Ln ${l}, Col ${el.dataset.c}`
          }
        }

        gsap.fromTo(
          chars,
          { opacity: 0 },
          {
            opacity: 1,
            ease: 'none',
            duration: 0.02,
            stagger: 0.02,
            scrollTrigger: {
              trigger: codebox.current,
              start: 'top 72%',
              end: 'bottom 55%',
              scrub: 0.4,
              onUpdate: (self) => paint(self.progress),
            },
          },
        )
        paint(0)

        gsap.to('.about-glow', {
          yPercent: -40,
          ease: 'none',
          scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
        })
        return () => chars.forEach((c) => (c.style.boxShadow = ''))
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        if (status.current) status.current.textContent = 'Done · 0 errors'
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section
      ref={root}
      id="about"
      className="relative z-10 overflow-x-clip rounded-t-4xl bg-sky-950 px-6 py-28 md:px-10 md:py-36"
    >
      <div className="about-glow pointer-events-none absolute -right-32 top-1/3 h-[420px] w-[420px] rounded-full bg-aqua-400/15 blur-3xl will-change-transform" />

      <div className="relative mx-auto max-w-6xl">
        <p className="about-label text-sm font-medium uppercase tracking-[0.3em] text-aqua-400">About</p>
        <div className="about-rule mt-4 h-px w-full bg-gradient-to-r from-aqua-400/60 to-transparent" />

        <div className="mt-12 grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start lg:gap-16">
          <div className="about-left">
            <h2 className="about-heading text-5xl font-bold leading-[1.05] text-white md:text-7xl">
              <span className="block overflow-hidden pb-2">
                <span className="about-line block">iClub,</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="about-line block text-aqua-400">compiled.</span>
              </span>
            </h2>
            <p className="mt-8 flex items-center gap-3 text-sm text-night-400">
              <span className="inline-flex items-center gap-1 rounded-md border border-white/15 px-2 py-0.5 font-mono text-xs text-aqua-400">
                scroll <ChevronDown size={12} className="animate-bounce" />
              </span>
              to run it
            </p>
          </div>

          <div
            ref={codebox}
            className="overflow-hidden rounded-2xl border border-white/10 bg-[#06141D] shadow-[0_0_90px_rgba(95,212,240,0.08)]"
          >
            <div className="flex items-center gap-2 border-b border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 rounded-md bg-white/[0.06] px-3 py-1 font-mono text-xs text-white/80">
                iClub.js
              </span>
            </div>

            <div className="overflow-x-auto px-3 py-4 font-mono text-[10.5px] leading-[1.75] sm:px-4 sm:text-[13px] md:text-sm">
              {LINES.map((line, li) => (
                <div key={li} ref={(el) => (rows.current[li] = el)} className="flex rounded-sm">
                  <span
                    ref={(el) => (nums.current[li] = el)}
                    className="w-6 shrink-0 select-none pr-2 text-right text-night-400/50 sm:w-8 sm:pr-3"
                  >
                    {li + 1}
                  </span>
                  <code className="whitespace-pre">
                    <span className="inline-block" style={{ width: `${line.indent}ch` }} />
                    {line.chars.map((o, ci) => (
                      <span key={ci} className={`ch ${o.color}`} data-l={li + 1} data-c={o.col + 1}>
                        {o.ch}
                      </span>
                    ))}
                    {line.chars.length === 0 && '\u00A0'}
                  </code>
                </div>
              ))}
            </div>

            <div className="border-t border-white/10 bg-black/25 px-4 py-4 font-mono text-[10.5px] leading-relaxed sm:text-[13px] md:text-sm">
              <p className="mb-2 text-[10px] uppercase tracking-[0.3em] text-night-400">Terminal</p>
              <p className="whitespace-pre-wrap">
                <Typed text="$ " cls="text-aqua-400" />
                <Typed text="node iClub.js" cls="text-night-400" />
              </p>
              <p className="mt-1 whitespace-pre-wrap">
                <Typed text="Together, we learn, collaborate, and " cls="text-white" />
                <Typed text="create a positive impact." cls="text-aqua-400" />
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/10 bg-aqua-400/10 px-4 py-1.5 font-mono text-[10px] text-aqua-400 sm:text-xs">
              <span ref={status}>Ln 1, Col 1</span>
              <span>JavaScript</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About