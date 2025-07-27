import React from 'react'
import { assets, facilityIcons, roomsDummyData } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import StartRating from '../components/StartRating';


const CheckBox = ({label,selected = false, onChange = () => {}}) => {
   return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 test-sm'>
      <input type="checkbox" checked = {selected} onChange={(e) =>onChange(e.target.checked,label)} />
      <span className='font-light select-none'>{label}</span>  
    </label>
   )
}

const RadioButton = ({label,selected = false, onChange = () => {}}) => {
   return (
    <label className='flex gap-3 items-center cursor-pointer mt-2 test-sm'>
      <input type="radio" name='sortOption' checked = {selected} onChange={(e) =>onChange(label)} />
      <span className='font-light select-none'>{label}</span>  
    </label>
   )
}

const AllRooms = () => {
    const navigate = useNavigate();
    const roomTypes = [
       "Single Bed",
       "Double Bed",
       "Luxury Room",
       "Family Suite"
    ];
    const PriceRanges = [
        '0 to 500',
        '500 to 1000',
        '1000 to 2000',
        '2000 to 3000',
    ];
    const sortOptions = [
        "Price Low to High",
        "Price High to Low",
        "Newest First",
    ];
  return (
    <>
      
      <div className='flex flex-row items-start justify-between md:pt-35 md:px-16   '>
      <div>
         <div className='flex flex-col items-start text-left'>
           <h1 className='font-playfair text-4xl md:text-[40px]'>Hotel Rooms</h1>
           <p className='text-sm md:text-base text-gray-500/90 mt-2 max-w-174'>Take advantage of our limited-time offers and special packages to enhance your stay and create unforgettable memories.</p>  
         </div>

       {roomsDummyData.map((room)=>(
        <div key={room._id} className='flex md:flex-row items-start py-10 gap-6 border-b border-gray-400 last:pb-30 last:border-0'>
            <img onClick={()=>{navigate(`/rooms/${room._id}`);scrollTo(0,0)}} src={room.images[0]} alt="" title='View Room Details' className='max-h-65 md:w-1/2 rounded-xl shadow-lg object-cover cursor-pointer' />
            <div className='md:w-1/2 flex flex-col gap-2'>
               <p  className='text-gray-500'>{room.hotel.city}</p>
               <p onClick={()=>{navigate(`/rooms/${room._id}`);scrollTo(0,0)}} className='text-gray-800 text-3xl font-playfair cursor-pointer'>{room.hotel.name}</p>
               <div className='flex items-center'>
                 <StartRating/>
                 <p className='ml-2'>200+ reviews</p>
                </div> 
                <div className='flex items-cente gap-1 text-gray-600 mt-2 tet-sm'>
                    <img src={assets.locationIcon}  alt="" />
                    <span>{room.hotel.address}</span>
                </div>
                <div className='flex flex-wrap items-center mt-3 mb-6 gap-4'>
                    {room.amenities.map((item,index)=>(
                        <div className='flex items-center gap-2 px-3 py-2 rounded-lg bg-[#F5F5FF]/70' key={index}>
                            <img src={facilityIcons[item]} alt="" className='w-5 h-5'/>
                            <p className='text-xs'>{item}</p>
                        </div>
                    ))}
                </div>
                <p className='text-xl font-medium text-gray-700'>${room.pricePerNight} /night</p>
            </div>
        </div>
       ))}

      </div>
      {/*Filters*/}
      <div className='bg-white w-80 border border-gray-300 text-gray-600 max-lg:mb-8 lg:mt-16  '>
        <div className='flex flex-row items-center justify-between px-5 py-2.5'>
            <p className='text-base font-medium text-gray-900'>FILTERS</p>
            <div className='text-xs cursor-pointer'>
                
                <span >CLEAR</span>
            </div>
        </div>
        <div>
          <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Popular filters</p>
              {roomTypes.map((room,index)=>(
                <CheckBox key={index} label={room} />
              ))}
          </div>
          <div className='px-5 pt-5'>
              <p className='font-medium text-gray-800 pb-2'>Price Range</p>
              {PriceRanges.map((range,index)=>(
                <CheckBox key={index} label={range} />
              ))}
          </div>
          <div className='px-5 pt-5 pb-5'>
            <p className='font-medium text-gray-800 pb-2'>Sort By</p>
            {sortOptions.map((option,index)=>(
                 <CheckBox key={index} label={option} />
            ))}
          </div>
        </div>
      </div>
      
    </div>

    <div className='flex justify-center my-8 w-full'>
      <button
        
        className='bg-blue-500 py-2 px-4 rounded-md text-white cursor-pointer hover:bg-blue-600 transition'
      >
        Show More
      </button>
    </div>
    
    </>
    
    
  )
}

export default AllRooms
