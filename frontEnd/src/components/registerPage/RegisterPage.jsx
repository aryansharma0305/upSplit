import React from 'react'
import RegisterForm from '@/components/ui/register-form'
import Logo from '../logo'
import { Typewriter } from 'react-simple-typewriter'
import RiveSplitAnim from '../riveSplitAnim'
import { useEffect } from 'react'
import AOS from 'aos'
import 'aos/dist/aos.css'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '@/firebase'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import axios from 'axios'



const RegisterPage = () => {
  useEffect(() => {
    AOS.init({ once: false, duration: 800, offset: -100 })
  }, [])


  const Navigate = useNavigate()
  
    const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, provider)
      const user = result.user
      const token = await user.getIdToken()
      
      try{
          const response = await axios.post(`api/auth/verifyLoginWithGoogle`, {token},{withCredentials: true})
          console.log("Response from server:", response.data)
          toast.success("Google Sign-In successful!")
          localStorage.setItem('userDetails', JSON.stringify(response.data.user))
          Navigate(response.data.redirect)
      }
      catch(error) {
          toast.error("Error during server communication!")
          console.error("Error during server communication:", error.message)
          return
      }
  
    } catch (error) {
  
       toast.error("Something Went Wrong!")
      console.error("Google Sign-In error:", error.message)
    }
  }




  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      
      <div className="bg-gray-100 relative hidden lg:flex lg:flex-col justify-center items-center">

             <div className=" w-full flex h-full text-black  text-5xl flex-col items-center justify-center" >
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
                    <RiveSplitAnim height={window.innerHeight*4/6} width="1000px" data-aos="fade-right"/>
            </div>
      </div>



      <div className="flex flex-col gap-4 p-6 md:p-10   overflow-y-auto h-screen">
        <div className="flex justify-center gap-2 ">
          <a href="/" className="flex items-center gap-2 font-medium">
            
             <Logo height="100px" width="200px"  />
            
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <RegisterForm />
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage