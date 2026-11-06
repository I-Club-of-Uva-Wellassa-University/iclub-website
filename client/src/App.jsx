import React, { useEffect } from 'react'
import Loader from '../components/Loader' 
import Navbar from '../components/Navbar'
import HeroSection from '../landing/HeroSection'
import About from '../landing/About'
import Stories from '../landing/Stories'
import TimelineSection from '../landing/TimelineSection'
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
      <ContactSection />
    </div>
  )
}

export default App