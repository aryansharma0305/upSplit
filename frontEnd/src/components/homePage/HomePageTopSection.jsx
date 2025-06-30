import React from 'react'
import { Typewriter } from 'react-simple-typewriter'
import { Button } from '../ui/button'
import { ArrowRight } from 'lucide-react'

const HomePageTopSection = () => {
  return (
    <div className='w-full px-5 pt-5 flex justify-center flex-col items-center '>

      <div className=" w-full flex justify-center mt-20  text-black  sm:text-7xl text-4xl">
        <h1 className='py-1 mr-3 w-auto text-black font-semibold'>
          Split Bills 
        </h1>
        <h1 className='py-1 w-auto  bg-gradient-to-r from-emerald-600 to-teal-600  bg-clip-text text-transparent font-semibold '>
          <Typewriter
            words={[' Smartly', ' Easily','Quickly']}
            loop={true}
            cursor
            cursorStyle='|'
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </h1>
      </div>
      <div className="flex justify-center  text-center mt-10">
        <h1 className='text-black sm:w-1/2  w-3/4'>
        Begin by exploring your dashboard — create your first group, split an expense, or just get familiar. It's simple, fast, and designed to keep things crystal clear from the start.
         </h1>  
      </div>
      <div className="flex justify-center mt-10">
        <Button className="bg-gradient-to-r from-emerald-600 to-teal-600" >
          Get Started  <ArrowRight />
        </Button>
        <Button variant='outline' className='ml-3'>
          <a href="#how-it-works">How It Works</a>
        </Button>
      </div>
    </div>
  )
}

export default HomePageTopSection
