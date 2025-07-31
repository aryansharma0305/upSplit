import React from 'react'
import { useEffect } from 'react'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const LogoutPage = () => {
  
    const navigate = useNavigate();

    const [logoutStatus, setLogoutStatus] = useState("Logging Out...");

    useEffect(() => {  
 
        axios.get('/api/auth/logout')
        .then((response) => {
            console.log("Logout successful:", response.data);
            localStorage.removeItem('userDetails');
            navigate('/');
            
        })
        .catch((error) => {
            console.error("Logout failed:", error);
            setLogoutStatus(error.message || "Logout failed. Please try again.");
        });


        
        
    },[])
    
    return (
    <div>{logoutStatus}</div>
  )
}

export default LogoutPage