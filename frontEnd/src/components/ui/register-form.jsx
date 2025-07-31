import { ChevronDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Label } from "@/components/ui/label"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Input } from "./input"
import * as React from "react"
import { useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import { toast } from "sonner"
import axios from "axios"
import { signInWithPopup } from "firebase/auth"
import { auth, provider } from "@/firebase"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

const RegisterForm = ({ className, ...props }) => {
  const [open, setOpen] = React.useState(false)
  const [date, setDate] = React.useState(undefined)
  useEffect(() => {
    AOS.init({ once: false, duration: 800 ,offset: -100})
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
        //local storage
        localStorage.setItem('userDetails', JSON.stringify(response.data.user))
        Navigate(response.data.redirect)
    }
    catch(error) {
        toast.error("Error during server communication!")
        console.error("Error during server communication:", error.message)
        return
    }
    // toast.success("Google Sign-In successful!")

  } catch (error) {

     toast.error("Something Went Wrong!")
    console.error("Google Sign-In error:", error.message)
  }
}


  const handleCreateAccount = async () => {
    const email = document.getElementById("email").value.toLowerCase()
    const name = document.getElementById("name").value
    const password = document.getElementById("password").value
    const password2 = document.getElementById("password2").value
    if (password !== password2) {
      toast.error("Passwords do not match!")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address!")
      return
    }
    if (name.trim() === "") {
      toast.error("Please enter your name!")
      return
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long!")
      return
    }
    try {
      const response = await axios.post('/api/auth/register', { email, name, password }, { withCredentials: true })
      console.log("Response from server:", response.data)
      toast.success("Check your email for verification link!")
      //local storage
      localStorage.setItem('userDetails', JSON.stringify(response.data.user))
    } catch (error) {

      if(error.response && error.response.data.error==="User already exists") {
        console.error("User already exists:", error.response.data)
        toast.error("User already exists with this email!")
        return
      }
      
      console.error("Error during account creation:", error.response)
      toast.error("Error creating account. Please try again.")
    }
  }


  return (
    <form className={cn("flex flex-col gap-6 sm:mt-12 mt-5", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center" data-aos="fade-down">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent ">Make an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details below to create an account.
        </p>
      </div>

      <div className="grid gap-6">

        <div className="grid gap-3" data-aos="fade-up" data-aos-delay="0">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="aryan@example.com" required />
        </div>

        <div className="grid gap-3" data-aos="fade-up" data-aos-delay="50">
          <Label htmlFor="name">Name</Label>
          <Input id="name" type="text" placeholder="Aryan Sharma" required />
        </div>

        
        <div className="grid gap-3" data-aos="fade-up" data-aos-delay="150">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
          </div>
          <Input id="password" type="password" placeholder="********" required />
        </div>

        <div className="grid gap-3" data-aos="fade-up" data-aos-delay="200">
          <div className="flex items-center">
            <Label htmlFor="password2">Re-Enter your password</Label>
          </div>
          <Input id="password2" type="password" placeholder="********" required />
        </div>

        <Button type="button" onClick={handleCreateAccount} className="w-full bg-gradient-to-r from-emerald-600  to-teal-600  hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 text-white hover:-translate-y-1" data-aos="fade-up" data-aos-delay="250">
          Create Account
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t" data-aos="fade-up" data-aos-delay="300">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <Button variant="outline" className="w-full" data-aos="fade-up" data-aos-delay="350"
          onClick={handleGoogleSignIn}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 48 48">
            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path>
            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path>
            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path>
            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
          </svg>
          Login with Google
        </Button>
      </div>

      <div className="text-center text-sm" data-aos="fade-up" data-aos-delay="400">
        <h1>
          Don&apos;t have an account?{" "}
        </h1>
        <a href="/login" className="underline underline-offset-4 bg-gradient-to-r from-emerald-600  to-teal-600 bg-clip-text text-transparent hover:text-emerald-700 font-bold">
          Login
        </a>
      </div>
    </form>
  )
}

export default RegisterForm
