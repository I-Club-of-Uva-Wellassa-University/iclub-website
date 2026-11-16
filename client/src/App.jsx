import React, { useEffect } from 'react'
import Loader from '../components/Loader' 
import Navbar from '../components/Navbar'
import HeroSection from '../landing/HeroSection'
import About from '../landing/About'
import Stories from '../landing/Stories'
import TimelineSection from '../landing/TimelineSection'
import Loader from '../components/Loader'
import Team from '../landing/Team'
import ContactSection from '../landing/ContactSection'

const App = () => {
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
    window.scrollTo(0, 0)
  }, [])

  return (
    <div className="bg-night-950">
      <Loader />
      <Navbar />

      <div className="relative">
        <HeroSection />
        <About />
      </div>
      
      <Stories />
      <TimelineSection />
      <Team />
    
      <section
        id="contact"
        className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-[#d8f0fc] to-[#b5e0f7] px-6 py-24 text-[#072a47]"
      >
      
        <div
          className="pointer-events-none absolute top-0 hidden md:block"
          style={{ right: "199px", height: "0px", width: "7px" }}
        >
          <div className="h-full w-full rounded-b-full bg-[#00b4d8] shadow-[0_0_25px_#38bdf8]" />
          <div className="mx-auto -mt-2 h-5 w-5 rounded-full border-4 border-white bg-[#072a47] shadow-[0_0_20px_#00b4d8]" />
        </div>

        <div className="mx-auto mt-16 max-w-4xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/80 px-5 py-1.5 text-xs font-bold tracking-widest text-[#0d436b] shadow-sm">
            <span className="h-2 w-2 rounded-full bg-[#1d70b8]" /> CONTACT US
          </div>
          <h2 className="text-5xl font-black tracking-tight text-[#072a47]">
            Get in Touch with <span className="text-[#2f74a3]">iClub</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium text-[#1e3a5f]">
            Have questions about upcoming events, memberships, or collaborations? Reach out to our team below.
          </p>
        </div>
      </section>
      <ContactSection />
    </div>
  )
}

export default App