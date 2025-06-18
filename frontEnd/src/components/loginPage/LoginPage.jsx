import React from 'react'
import LoginForm from '@/components/ui/login-form'
import Logo from '../logo'
import { Typewriter } from 'react-simple-typewriter'

const LoginPage = () => {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      
      <div className="bg-gray-100 relative hidden lg:flex lg:flex-col justify-center items-center">

            <div className=" w-full flex justify-center  text-black  text-5xl">
                    <h1 className='py-1 mr-3 w-auto text-black font-semibold'>
                    Split Bills 
                    </h1>
                    <h1 className='py-1 w-auto text-emerald-600 font-semibold '>
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
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 ">
          <a href="/" className="flex items-center gap-2 font-medium">
            
             <Logo className="h-10" />
            
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