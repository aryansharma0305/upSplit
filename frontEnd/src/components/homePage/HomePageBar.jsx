import React from 'react'
import { Button } from "@/components/ui/button"
import Logo from "../logo.jsx"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,   
    NavigationMenuList,
    NavigationMenuTrigger,
    NavigationMenuViewport,
} from "@/components/ui/navigation-menu"
import { Grid } from "lucide-react"
import { useEffect } from "react";
import AOS from 'aos';
import 'aos/dist/aos.css';

export const HomePageBar = () => {
  useEffect(() => {
    AOS.init({ once: false, duration: 800 });
  }, []);
  return (
    <>
    
    <div className="w-full h-15 fixed top-0 left-0 z-10 flex items-center bg-white justify-between px-6 shadow-md">
      <Logo height="60px" width="150px" />
        
      <div className='sm:block hidden font-semibold' data-aos="fade-down"> 
         <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuLink asChild>
            <a href="#features">Features</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild >
            <a href="#how-it-works">How It Works</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuLink asChild >
            <a href="#about-developer">About Developer</a>
          </NavigationMenuLink>
        </NavigationMenuItem>
        
      </NavigationMenuList>
    </NavigationMenu>
      </div>


      <div className=" font-bold flex gap-3" data-aos="fade-left">
      <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 duration-200 hover:-translate-y-1 font-bold"> <a href="/login">Login</a></Button> 
      <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:bg-gradient-to-r hover:from-emerald-700 hover:to-teal-700 duration-200 hover:-translate-y-1 font-bold"><a href="/register">Register</a></Button> 
     </div>
    
    </div>
    <div className="div w-full h-15 text-end px-10">

    </div>
    </>
  )
}
export default HomePageBar;