import React from 'react'
import HeroSection from '../landing/HeroSection'
import Navbar from '../components/Navbar'
import About from '../landing/About'
import Stories from '../landing/Stories'
import TimelineSection from '../landing/TimelineSection'
import ContactSection from '../landing/ContactSection'

const App = () => {
  return (
    <div className="bg-night-950">
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