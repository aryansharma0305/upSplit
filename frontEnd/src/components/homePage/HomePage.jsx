import React from 'react'
import HomePageBar from './HomePageBar'
import HomePageTopSection from './HomePageTopSection'
import HomePageFeatures from './HomePageFeatures'
import HowItWorks from './HomePageHowItWorks'
import HomePageFooter from './HomePageFooter'
import AboutDeveloper from './HomePageAboutDeveloper'

const HomePage = () => {
  return (
    <>
        <HomePageBar />
      <HomePageTopSection />
      <HomePageFeatures />
      <HowItWorks />
      <AboutDeveloper />
      <HomePageFooter />

    </>
  )
}

export default HomePage