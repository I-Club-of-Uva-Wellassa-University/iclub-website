import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowUpRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger, useGSAP)

const LEADERS = [
  { id: 'president', role: 'President', short: 'President', tag: 'Society' },
  { id: 'vp-tech', role: 'Vice President', short: 'VP · Technology', tag: 'Technology & Innovation' },
  { id: 'vp-charity', role: 'Vice President', short: 'VP · Community', tag: 'Community Service & Charity' },
  { id: 'secretary', role: 'Secretary', short: 'Secretary', tag: 'Society' },
  { id: 'senior-treasurer', role: 'Senior Treasurer', short: 'Senior Treasurer', tag: 'Academic staff' },
]

const AVENUE_ROLES = ['Assistant Secretary', 'Treasurer', 'Project Coordinator', 'Editor']
const CORE_ROLES = ['Web Master', 'Chief Editor', 'Media Coordinator']

const TERMS = [
  {
    id: 'new', 
    label: 'Newly appointed',
    period: '2026/2027', 
    blurb: "Every executive is appointed at the Annual General Meeting. Meet the 2026 / 27 team, and the ones who built the way before us.",
    leaders: {
      president: 'Full Name',
      'vp-tech': 'Full Name',
      'vp-charity': 'Full Name',
      secretary: 'Full Name',
      'senior-treasurer': 'Full Name',
    },
    links: {}, 
    tech: ['Full Name', 'Full Name', 'Full Name', 'Full Name'], 
    charity: ['Full Name', 'Full Name', 'Full Name', 'Full Name'],
    core: ['Full Name', 'Full Name', 'Full Name'],
    committee: ['Full Name', 'Full Name', 'Full Name', 'Full Name', 'Full Name', 'Full Name'], 
  },
  {
    id: 'former', 
    label: 'Former team',
    period: '2026',
    blurb: "The 2026 team served before them. They set up the foundations that this year's team now builds on.",
    leaders: {
      president: 'Full Name',
      'vp-tech': 'Full Name',
      'vp-charity': 'Full Name',
      secretary: 'Full Name',
      'senior-treasurer': 'Full Name',
    },
    links: {},
    tech: ['Full Name', 'Full Name', 'Full Name', 'Full Name'],
    charity: ['Full Name', 'Full Name', 'Full Name', 'Full Name'],
    core: ['Full Name', 'Full Name', 'Full Name'],
    committee: ['Full Name', 'Full Name', 'Full Name', 'Full Name', 'Full Name', 'Full Name'],
  },
]

// ─────────────────────────────────────────────────────────────────────────────

const initials = (name) =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()

const Count = ({ to }) => {
  const ref = useRef(null)
  useGSAP(
    () => {
      const el = ref.current
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = to
        return
      }
      const o = { v: 0 }
      gsap.to(o, {
        v: to,
        duration: 1.4,
        ease: 'power2.out',
        onUpdate: () => (el.textContent = Math.round(o.v)),
        scrollTrigger: { trigger: el, start: 'top 92%', once: true },
      })
    },
    { dependencies: [to] },
  )
  return <span ref={ref}>0</span>
}

// one leader: a panel that opens on hover / tap
const Panel = ({ leader, name, link, termId, index, isActive, onActivate }) => {
  const src = `/team/${termId}/${leader.id}.jpg`
  const [failed, setFailed] = useState(false)
  useEffect(() => setFailed(false), [src])

  return (
    <article
      tabIndex={0}
      aria-label={`${leader.role}: ${name}`}
      onClick={onActivate}
      onFocus={onActivate}
      onPointerEnter={(e) => e.pointerType === 'mouse' && onActivate()}
      className={`panel relative min-h-0 min-w-0 cursor-pointer overflow-hidden rounded-3xl border outline-none transition-[flex-grow,border-color] duration-700 ease-[cubic-bezier(0.65,0,0.35,1)] focus-visible:ring-2 focus-visible:ring-aqua-400 ${
        isActive ? 'border-aqua-400/40' : 'border-white/10'
      }`}
      style={{ flexGrow: isActive ? 5 : 1, flexBasis: 0 }}
    >
      {/* fallback when there is no photo yet: brand gradient + initials */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1C82ED] via-[#0F5E83] to-[#1B1E4C]" />
      <span className="absolute inset-0 flex items-center justify-center text-[clamp(6rem,16vw,11rem)] font-extrabold text-white/15">
        {initials(name)}
      </span>

      {!failed && (
        <img
          src={src}
          alt=""
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`absolute inset-0 h-full w-full object-cover object-top transition-[filter,transform] duration-700 ${
            isActive ? 'scale-100 grayscale-0' : 'scale-110 grayscale'
          }`}
        />
      )}

      {/* shading */}
      <div
        className={`pointer-events-none absolute inset-0 bg-night-950 transition-opacity duration-700 ${
          isActive ? 'opacity-0' : 'opacity-70'
        }`}
      />
      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-night-950/90 via-night-950/30 to-transparent transition-opacity duration-700 ${
          isActive ? 'opacity-100' : 'opacity-0'
        }`}
      />

      <span className="absolute left-5 top-5 hidden font-mono text-xs tracking-widest text-white/70 md:block">
        {String(index + 1).padStart(2, '0')}
      </span>

      {/* label while closed (vertical on desktop, one row on phones) */}
      <div
        className={`absolute inset-0 flex items-center gap-3 px-5 transition-opacity duration-500 md:flex-col md:items-center md:justify-end md:gap-4 md:px-0 md:pb-7 ${
          isActive ? 'pointer-events-none opacity-0' : 'opacity-100 delay-300'
        }`}
      >
        <span className="font-mono text-xs text-aqua-400 md:hidden">{String(index + 1).padStart(2, '0')}</span>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-white md:rotate-180 md:text-base md:[writing-mode:vertical-rl]">
          {leader.short}
        </span>
      </div>

      {/* details while open (fixed width, so the text never reflows while the panel grows) */}
      <div
        className={`absolute bottom-6 left-6 w-[calc(100vw-6rem)] transition-all duration-500 md:bottom-8 md:left-8 md:w-80 ${
          isActive ? 'translate-y-0 opacity-100 delay-300' : 'pointer-events-none translate-y-4 opacity-0'
        }`}
      >
        <span className="inline-block rounded-full border border-white/25 bg-white/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white backdrop-blur-md">
          {leader.tag}
        </span>
        <h3 className="mt-3 text-3xl font-bold leading-[1.05] text-white md:text-4xl">{name}</h3>
        <p className="mt-1 text-aqua-400">{leader.role}</p>
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="mt-4 inline-flex items-center gap-1 text-sm text-white/80 transition-colors hover:text-white"
          >
            LinkedIn <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </article>
  )
}

// a row in the list: the whole row fills with aqua on hover
const Row = ({ role, name }) => (
  <li className="group relative overflow-hidden border-b border-white/10">
    <span
      aria-hidden="true"
      className="absolute inset-0 origin-bottom scale-y-0 bg-aqua-400 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] group-hover:scale-y-100"
    />
    <div className="relative flex items-baseline justify-between gap-4 px-1 py-4 transition-[padding] duration-500 group-hover:px-4">
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-night-400 transition-colors duration-300 group-hover:text-sky-950">
        {role}
      </span>
      <span className="text-right text-lg font-semibold text-white transition-colors duration-300 group-hover:text-sky-950">
        {name}
      </span>
    </div>
  </li>
)

const Team = () => {
  const root = useRef(null)
  const busy = useRef(false)
  const prevTerm = useRef(TERMS[0].id)
  const [termId, setTermId] = useState(TERMS[0].id)
  const [active, setActive] = useState(0)

  const term = TERMS.find((t) => t.id === termId)
  const termIndex = TERMS.findIndex((t) => t.id === termId)

  const groups = [
    { title: 'Technology & Innovation', rows: AVENUE_ROLES.map((role, i) => ({ role, name: term.tech[i] })) },
    { title: 'Community Service & Charity', rows: AVENUE_ROLES.map((role, i) => ({ role, name: term.charity[i] })) },
    { title: 'Core team', rows: CORE_ROLES.map((role, i) => ({ role, name: term.core[i] })) },
  ]
  const total = LEADERS.length + groups.reduce((n, g) => n + g.rows.length, 0) + term.committee.length

  // switching teams: fade out, swap the data, fade back in
  const switchTerm = (id) => {
    if (id === termId || busy.current) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTermId(id)
      setActive(0)
      return
    }
    busy.current = true
    gsap.to(root.current.querySelectorAll('.swap-blurb, .swap-panels, .swap-lower'), {
      opacity: 0,
      y: -16,
      duration: 0.35,
      stagger: 0.08,
      ease: 'power2.in',
      onComplete: () => {
        setTermId(id)
        setActive(0)
      },
    })
  }

  useEffect(() => {
    if (prevTerm.current === termId) return undefined
    prevTerm.current = termId
    busy.current = false
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      ScrollTrigger.refresh()
      return undefined
    }
    const tw = gsap.fromTo(
      root.current.querySelectorAll('.swap-blurb, .swap-panels, .swap-lower'),
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        clearProps: 'opacity,transform',
        onComplete: () => ScrollTrigger.refresh(),
      },
    )
    return () => tw.kill()
  }, [termId])

  // entrance animations, driven by scroll
  useGSAP(
    () => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        gsap.fromTo(
          '.t-label',
          { y: 20, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: '.t-label', start: 'top 88%' } },
        )
        gsap.fromTo(
          '.t-line',
          { yPercent: 110 },
          { yPercent: 0, duration: 1, ease: 'power4.out', stagger: 0.12, scrollTrigger: { trigger: '.t-heading', start: 'top 80%' } },
        )
        gsap.fromTo(
          '.t-controls',
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            delay: 0.2,
            ease: 'power3.out',
            scrollTrigger: { trigger: '.t-heading', start: 'top 80%' },
          },
        )

        // the five panels open upwards one after the other
        gsap.fromTo(
          '.panel',
          { clipPath: 'inset(100% 0% 0% 0% round 24px)' },
          {
            clipPath: 'inset(0% 0% 0% 0% round 24px)',
            duration: 1.1,
            ease: 'power4.out',
            stagger: 0.1,
            clearProps: 'clipPath',
            scrollTrigger: { trigger: '.t-panels', start: 'top 82%' },
          },
        )

        // each list block rises in when it arrives
        gsap.utils.toArray('.t-group').forEach((el, i) =>
          gsap.fromTo(
            el,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              delay: (i % 3) * 0.1,
              ease: 'power3.out',
              clearProps: 'opacity,transform',
              scrollTrigger: { trigger: el, start: 'top 88%' },
            },
          ),
        )

        // the outlined word drifts slowly as you scroll
        gsap.fromTo(
          '.t-bg-word',
          { xPercent: -8 },
          {
            xPercent: 8,
            ease: 'none',
            scrollTrigger: { trigger: root.current, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })

      return () => mm.revert()
    },
    { scope: root },
  )

  return (
    <section ref={root} id="team" className="relative z-10 overflow-x-clip bg-night-950 px-6 py-28 md:px-10 md:py-36">
      {/* decoration */}
      <div className="pointer-events-none absolute -left-40 top-1/4 h-[460px] w-[460px] rounded-full bg-aqua-400/10 blur-3xl" />
      <div
        aria-hidden="true"
        className="t-bg-word pointer-events-none absolute md:left-10 top-16 select-none whitespace-nowrap text-[clamp(9rem,30vw,28rem)] font-extrabold leading-none text-transparent [-webkit-text-stroke:1.5px_rgba(95,212,240,0.12)]"
      >
        TEAM
      </div>

      <div className="relative mx-auto max-w-6xl">
        <p className="t-label text-sm font-medium uppercase tracking-[0.3em] text-aqua-400">The team</p>

        {/* heading + controls */}
        <div className="mt-8 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="t-heading text-5xl font-bold leading-[1.05] text-white md:text-7xl">
              <span className="block overflow-hidden pb-2">
                <span className="t-line block">The people</span>
              </span>
              <span className="block overflow-hidden pb-2">
                <span className="t-line block text-aqua-400">behind the club.</span>
              </span>
            </h2>
            <p className="swap-blurb mt-6 min-h-[6.5rem] max-w-md text-night-400">{term.blurb}</p>
          </div>

          <div className="t-controls flex flex-col items-start gap-6 lg:items-end">
            {/* the team switch */}
            <div className="relative inline-grid grid-cols-2 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl">
              <span
                aria-hidden="true"
                className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-aqua-400 transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)]"
                style={{ transform: `translateX(${termIndex * 100}%)` }}
              />
              {TERMS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  aria-pressed={t.id === termId}
                  onClick={() => switchTerm(t.id)}
                  className={`relative z-10 rounded-full px-5 py-2 text-sm font-medium transition-colors duration-300 ${
                    t.id === termId ? 'text-sky-950' : 'text-night-400 hover:text-white'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            <p className="flex items-end gap-3">
              <span className="text-[clamp(3.5rem,8vw,6rem)] font-extrabold leading-none tabular-nums text-transparent [-webkit-text-stroke:1.5px_rgba(95,212,240,0.9)]">
                <Count to={total} />
              </span>
              <span className="pb-2 text-sm leading-tight text-night-400">
                members
                <br />
                {term.period || 'in this team'}
              </span>
            </p>
          </div>
        </div>

        {/* the five leaders */}
        <div className="t-panels swap-panels mt-14 flex h-[40rem] flex-col gap-2 md:h-[36rem] md:flex-row">
          {LEADERS.map((leader, i) => (
            <Panel
              key={leader.id}
              index={i}
              leader={leader}
              name={term.leaders[leader.id]}
              link={term.links[leader.id]}
              termId={termId}
              isActive={active === i}
              onActivate={() => setActive(i)}
            />
          ))}
        </div>

        {/* everyone else */}
        <div className="swap-lower mt-24">
          <p className="text-sm font-medium uppercase tracking-[0.3em] text-aqua-400">Executive committee</p>

          <div className="t-lower mt-6 grid gap-12 md:grid-cols-3">
            {groups.map((g) => (
              <div key={g.title} className="t-group">
                <h4 className="mb-4 text-lg font-semibold text-white">{g.title}</h4>
                <ul className="border-t border-white/10">
                  {g.rows.map((r) => (
                    <Row key={r.role} role={r.role} name={r.name} />
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="t-group mt-16">
            <h4 className="text-lg font-semibold text-white">Committee members</h4>
            <ul className="mt-5 flex flex-wrap gap-2">
              {term.committee.map((name, i) => (
                <li
                  key={`${name}-${i}`}
                  className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-colors duration-300 hover:border-aqua-400 hover:bg-aqua-400 hover:text-sky-950"
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Team