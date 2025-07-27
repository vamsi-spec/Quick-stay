import React, { useEffect, useRef } from 'react'
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useClerk, useUser,UserButton } from '@clerk/clerk-react';

const BookIcon = () => (
    <svg className="w-4 h-4 text-gray-700" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" >
    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 19V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v13H7a2 2 0 0 0-2 2Zm0 0a2 2 0 0 0 2 2h12M9 3v14m7 0v4" />
</svg>
)

const Navbar = () => {

     const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Hotels', path: '/rooms' },
        { name: 'Experience', path: '/' },
        { name: 'About', path: '/' },
    ];

    

    const [isScrolled,setIsScrolled] = useState(false);
    const {openSignIn} = useClerk()
    const {user} = useUser()
    const navigate = useNavigate()
    const location = useLocation()
    

    useEffect(()=>{

         if(location.pathname !== '/'){
            setIsScrolled(true);
            return;
         }
         else{
            setIsScrolled(false);
         }
         setIsScrolled(prev => location.pathname !== '/' ? true : prev);

        const handleScroll = () =>{
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll",handleScroll);
        return () => window.removeEventListener("scroll",handleScroll);
    },[location.pathname]);

  return (
   
        
        <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${isScrolled ? "bg-white/80 shadow-md text-gray-700 backdrop-blur-lg py-3 md:py-4" : "py-4 md:py-6"} `}>

        
         <Link to = '/' >
                    <img src={assets.logo} alt="logo" className={`h-9 ${isScrolled && "invert opacity-80"}`} />
        </Link>

        <div className='hidden md:flex items-center gap-8'>
             {navLinks.map((link,i) => (
                <a key={i} href={link.path} className={`group flex flex-col gap-0.5 ${isScrolled ? "text-gray-700" : "text-white"}`}>
                    {link.name}
                    <div className={`${isScrolled ? "bg-gray-700" : "bg-white"} h-0.5 w-0 group-hover:w-full transition-all duration-300`}></div>
                </a>
             ))}
             <button onClick={() =>navigate('/owner')} className={`border px-4 py-1 text-sm font-light rounded-full cursor-pointer ${isScrolled ? 'text-black' : 'text-white'} transition-all `}>
                Dashboard
             </button>
        </div>
 
       <div className='hidden md:flex items-center gap-4'>
        <img src={assets.searchIcon} alt="seacrh"  className={`${isScrolled && 'invert'} h-7 transition-all duration-500`}/>

         {user ? 
         (<UserButton>
            <UserButton.MenuItems>
                <UserButton.Action label='My Bookings' labelIcon={<BookIcon/>} onClick={()=>navigate('/my-bookings')} />
            </UserButton.MenuItems>
         </UserButton>)
        :
        (<button  onClick={openSignIn} className={`px-8 py-2.5 rounded-full ml-4 transition-all duration-500 cursor-pointer ${isScrolled ? "text-white bg-black" : "bg-white text-black"}`}>
                        Login
        </button>)
        }

        

       </div>

        </nav>
      
  )
}

export default Navbar
