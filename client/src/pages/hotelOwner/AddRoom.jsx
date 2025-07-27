import React, { useState } from 'react'
import Title from '../../components/Title'
import { assets } from '../../assets/assets'

const AddRoom = () => {

    const [images,setImages] = useState({
        1:null,
        2:null,
        3:null,
        4:null,
    })
 
    const [input,setInput] = useState({
        roomType: '',
        pricePerNight : 0,
        amenities : {
            'Free Wifi': false,
            'Free Break': false,
            'Room Service': false,
            'Mountain View': false,
            'Pool Access': false,
        }
    })


  return (
    <form >
      <Title  align='left'  title='Add Room' font='outfit' subTitle='Fill in the details carefully and accurate room details, pricing, and amenities, to enhance the user booking experience' />
      <p className='text-gray-800 mt-10 mb-2'>Images</p>
 <div className='flex gap-4 my-4'>
  {Object.keys(images).map((key) => (
    <label
      htmlFor={`roomImage${key}`}
      key={key}
      className='w-28 h-28 border-2 border-dashed border-gray-300 rounded-md overflow-hidden bg-gray-50 hover:border-blue-400 cursor-pointer transition'
    >
      <img
        src={images[key] ? URL.createObjectURL(images[key]) : assets.uploadArea}
        alt={`room-preview-${key}`}
        className='w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity'
      />
      <input
        type='file'
        accept='image/*'
        id={`roomImage${key}`}
        hidden
        onChange={(e) => setImages({ ...images, [key]: e.target.files[0] })}
      />
    </label>
  ))}
</div>

   <div className='w-full flex gap-6 mt-4'>
    <div className='flex-1 max-w-46'>
        <p className='text-gray-800 mt-4'>Room Type</p>
        <select value={input.roomType} onChange={e=>setInput({...input,roomType:e.target.value})} className='border opacity-70 border-gray-400 mt-1 rounded p-2 w-full'>
            <option value="">Select Room Type</option>
            <option value="Single Bed">Single Bed</option>
            <option value="Double Bed">Double Bed</option>
            <option value="Luxury Room">Luxury Room</option>
            <option value="Family Suite">Family Suite</option>
        </select>
    </div>

    <div className='mt-4 text-gray-800'>
        <p>Price <span className='text-xs'>/night</span> </p>
        <input  type="number" className='border border-gray-400 mt-1 rounded p-2 w-24' value={input.pricePerNight} onChange={e=>setInput({...input,pricePerNight:e.target.value})} />
    </div>

   </div>

   <p className='text-gray-800 mt-4'>Amenities</p>
   <div className='flex flex-col flex-wrap mt-2 text-gray-400 max-w-sm'>
    {Object.keys(input.amenities).map((amenity,index)=>(
        <div key={index}>
            <input type="checkbox" id={`amenities${index+1}`} checked={input.amenities[amenity]} onChange={()=>setInput({...input,amenities:{...input.amenities,[amenity] : !input.amenities[amenity]}})} />
            <label htmlFor={`amenities${index+1}`}>{amenity}</label>
        </div>
    ))}
   </div>

   <button className='bg-primary text-white px-8 py-2 rounded mt-8  cursor-pointer '>Add Room</button>

    </form>
  )
}

export default AddRoom
