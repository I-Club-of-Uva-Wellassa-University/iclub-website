import React from 'react'
import HeroSection from '../landing/HeroSection'
import Navbar from '../components/Navbar'
import About from '../landing/About'
import Stories from '../landing/Stories'

const App = () => {
  return (
    <div className="bg-night-950">
      <Navbar />

      <div className="relative">
        <HeroSection />
        <About />
      </div>
      <Stories />
    </div>
  )
}

export default App