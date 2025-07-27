import React from 'react'
import { assets, cities } from '../assets/assets'

const Hero = () => {
  return (
    <div className='flex flex-col items-start justify-center px-6 md:px-16 lg:px-32 text-white bg-[url("/src/assets/heroImage.png")] bg-no-repeat bg-cover bg-center h-screen'>
      <p className='bg-[#49B9FF]/50 px-3.5 py-1 rounded-full mt-20'>The Ultimate Hotel Experience</p>
      <h1 className='font-playfair text-2xl md:text-5xl font-bold max-w-xl mt-4'>Discover Your Perfect Gateway Destination</h1>
      <p className='max-w-130 mt-2 text-sm md:text-base'>Unparalled luxury and comfort await at the world's most exclusive hotels and resorts.Start your journey today.</p>
      <form className='bg-white text-gray-500 rounded-lg px-6 py-4 flex flex-col md:flex-row max-md:items-start gap-4 max-md:mx-auto mt-8'>
        <div>
            <div className='flex items-center gap-2'>
              <img src={assets.calenderIcon} className='h-4' alt="" />
              <label htmlFor='destinationInput'>Destination</label>
            </div>
            <input list="destinations" id='destinationInput' type="text" className='rounded border border-gray-300 px-3 py-1.5 mt-1.5 text-sm outline-none' placeholder='Type here' required />
            <datalist id='destinations'>
                {cities.map((city,index)=>(
                    <option value={city} key={index}></option>
                ))}
            </datalist>
        </div>
 
        <div>
           <div className='flex items-center gap-2'>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="checkIn" >checkIn</label>
            </div> 
            <input id="checkIn" type='date' className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none ' />
        </div>       

        <div>
            <div className='flex items-center gap-2 '>
            <img src={assets.calenderIcon} alt="" className='h-4' />
            <label htmlFor="checkOut" >checkOut</label>
            </div>
            <input id="checkOut" type='date' className='rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none ' />
            
        </div>

        <div className='flex md:flex-col max-md:gap-2 max-md:items-center '>
            <label htmlFor="guests">Guests</label>
            <input min={1} max={4} id="guests" type='number' className=" rounded border border-gray-200 px-3 py-1.5 mt-1.5 text-sm outline-none  max-w-16" placeholder="0"  />

        </div>
 
        <button className='flex items-center justify-center gap-1 rounded-md bg-black py-1.5 px-4 text-white'>
             <img src={assets.searchIcon} className='h-7' alt="search" />
                <span>Search</span>

        </button>
 
      </form>
    </div>
  )
}

export default Hero



