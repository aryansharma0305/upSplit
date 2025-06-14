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

export const HomePageBar = () => {
  return (
    <>
    
    <div className="w-full h-15 fixed top-0 left-0 z-10 flex items-center bg-white justify-between px-6 shadow-md">
      <Logo className='h-12 text-emerald-600'/>
        
      <div className='sm:block hidden font-semibold'> 
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


      <div className=" font-bold flex gap-3">
      <Button > <a href="/login">Login</a></Button> 
      <Button><a href="/register">Register</a></Button> 
     </div>
    
    </div>
    <div className="div w-full h-15 text-end px-10">

    </div>
    </>
  )
}
export default HomePageBar;