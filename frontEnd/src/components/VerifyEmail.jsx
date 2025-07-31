import React, { use, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useState } from 'react'
import axios from 'axios'

const VerifyEmail = () => {


    // This component will handle the verification of email links
    // It will check the authToken from the URL and verify the user's email
    // If the authToken is valid, it will update the user's isVerified status in the database
    // If the authToken is invalid or expired, it will show an error message    
    // After successful verification, it will redirect the user to the on boarding page

    const Navigation= useNavigate()
    
    const [errorMessage, setErrorMessage] = useState("Verifying your email...")

    const handleVerifyEmail = async () => {
        const urlParams = new URLSearchParams(window.location.search);
        const authToken = urlParams.get('authToken');
        console.log("Auth Token from URL:", authToken)
        if (!authToken) {
            setErrorMessage("Invalid or expired link");
            return
        }
        try {
            const response = await axios.post('/api/auth/verifyEmailLinkForRegister', { authToken }, { withCredentials: true });
            console.log("Response from server:", response.data);
            if (response.data.error) {
                setErrorMessage(response.data.error);
            } else {
                setErrorMessage("Email verified successfully! Redirecting to login in 2 secconds...");
                localStorage.setItem('userDetails', JSON.stringify(response.data.user))
                setTimeout(() => {
                    Navigation('/onboarding');
                }, 2000);
            }
        } catch (error) {
            console.error("Error during email verification:", error);
            setErrorMessage("Invalid or expired link");
        }

    }

    useEffect(() => {
        handleVerifyEmail()
    }, [])

  return (
    <>
        <div className='text-3xl mt-5 mx-10 text-center'>{errorMessage}</div>
                {(errorMessage === "Invalid or expired link")?(
                    <div className='flex justify-center items-center mt-10'>
                             <button onClick={() => Navigation('/login')} className='bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700'>
                                    Go to Login
                             </button>   
                    </div>
                ):("")}
                
    </>
  )
}

export default VerifyEmail