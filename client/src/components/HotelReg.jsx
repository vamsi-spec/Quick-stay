import React from 'react'
import { assets, cities } from '../assets/assets'

const HotelReg = ({ onClose }) => {
  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70'>
      <form className='flex flex-col md:flex-row bg-white rounded-xl max-w-4xl w-full mx-4'>
        <img src={assets.regImage} className='hidden md:block w-1/2 rounded-l-xl' alt="Hotel Registration" />
        <div className='relative flex flex-col items-center w-full md:w-1/2 p-10'>
          <img src={assets.closeIcon} alt="Close" className='absolute top-4 right-4 h-4 w-4 cursor-pointer' onClick={onClose} />
          <p className='text-2xl font-semibold mt-6'>Register Your Hotel</p>

          <div className='w-full mt-4'>
            <label htmlFor="name" className='font-medium text-gray-500'>Hotel Name</label>
            <input type="text" id='name' placeholder='Type here' className='border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full' required />
          </div>

          <div className='w-full mt-4'>
            <label htmlFor="contact" className='font-medium text-gray-500'>Phone</label>
            <input type="text" id='contact' placeholder='Type here' className='border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full' required />
          </div>

          <div className='w-full mt-4'>
            <label htmlFor="address" className='font-medium text-gray-500'>Address</label>
            <input id='address' type="text" placeholder='Type here' className='border border-gray-300 rounded px-3 py-2.5 mt-1 outline-indigo-500 font-light w-full' required />
          </div>

          <div className='w-full mt-4'>
            <label htmlFor="city" className='font-medium text-gray-600'>City</label>
            <select id="city" className='border border-gray-200 rounded w-full px-3 py-2.5 outline-indigo-500 font-light' required>
              <option value="">Select City</option>
              {cities.map((city) => (
                <option value={city} key={city}>{city}</option>
              ))}
            </select>
          </div>

          <button type="submit" className='bg-indigo-500 hover:bg-indigo-800 transition-all text-white px-6 py-2 mt-6 mr-auto rounded'>
            Register
          </button>
        </div>
      </form>
    </div>
  )
}

export default HotelReg
