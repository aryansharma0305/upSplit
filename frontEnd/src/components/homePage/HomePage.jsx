import React from 'react'
import HomePageBar from './HomePageBar'
import HomePageTopSection from './HomePageTopSection'
import HomePageFeatures from './HomePageFeatures'
import HowItWorks from './HomePageHowItWorks'
import HomePageFooter from './HomePageFooter'
import AboutDeveloper from './HomePageAboutDeveloper'
import Lenis from 'lenis'
import { useEffect } from 'react'
import { ReactLenis } from 'lenis/react'
import { useLenis } from 'lenis/react'



const HomePage = () => {
  //  const lenis = useLenis((lenis) => {
  //   console.log(lenis)
  // })
  
  return (
    <div>

    <ReactLenis root/>
        <HomePageBar />
      <HomePageTopSection />
      <HomePageFeatures />
      <HowItWorks />
      <AboutDeveloper />
      <HomePageFooter />

    </div>
  )
}

export default HomePage