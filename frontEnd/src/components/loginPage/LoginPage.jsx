import React from 'react'
import LoginForm from '@/components/ui/login-form'
import Logo from '../logo'
import { Typewriter } from 'react-simple-typewriter'
import RiveSplitAnim from '../riveSplitAnim'
import Aos from 'aos'
import 'aos/dist/aos.css'
import { useEffect } from 'react'

const LoginPage = () => {

  useEffect(() => {
    Aos.init({ once: false, duration: 800, offset: -100 })
  }, [])

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      
      <div className="bg-gray-100 relative hidden lg:flex lg:flex-col justify-center items-center">

            <div className=" w-full flex h-full text-black  text-5xl flex-col items-center justify-center">
                    <div className='flex' data-aos="fade-down"><h1 className='py-1 mr-3 w-auto text-black font-semibold '>
                    Split Bills 
                    </h1>
                    <h1 className='py-1 w-auto font-semibold bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent'>
                    <Typewriter
                        words={[' Smartly', ' Easily','Quickly']}
                        loop={true}
                        cursor
                        cursorStyle='|'
                        typeSpeed={70}
                        deleteSpeed={50}
                        delaySpeed={2000}
                    />
                    </h1></div>
                    <RiveSplitAnim height={window.innerHeight*4/6} width="1000px" />
            </div>
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 ">
          <a href="/" className="flex items-center gap-2 font-medium">
            
             <Logo height="100px" width="200px" />
            
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage