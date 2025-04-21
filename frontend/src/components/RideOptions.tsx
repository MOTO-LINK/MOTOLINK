import { Button } from '@mui/material'
import React from 'react'
import Buttons from './Button'
import serv from "../assets/images/f49ebaa0a18647afea816ec5f84a8c65.png"
import toktok from "../assets/images/toktok.png"
import scooter from "../assets/images/scooter.png"
const RideOptions = () => {
  return (
    <>
     <div className="text-white mt-14 mb-12">
        <div className="">
          <h1 className='text-3xl font-semibold'>Ride options and more</h1>
        </div>
        <div className="flex justify-center gap-10 my-6">

            <div className="bg-graydark800 w-[24rem] p-6 flex gap-5 items-center rounded-lg shadow-md border border-graydark700">
              <div className="flex-shrink-0">
                <img  src={serv} className='w-[100px] h-[100px] rounded-lg object-cover border-2 border-gray-600' alt="Delivery Service"  />
              </div>

              <div className="flex flex-col space-y-3 ml-2">
                <h1 className='text-lg font-medium text-textWhite'>Delivery Services</h1>    
                <p className='text-textgray400 text-sm'>Safe, fast rides across town with MotoLink's professional drivers.</p>
                <div className="mt-1">
                  <Buttons value="details"  className="w-36 h-10 text-white font-medium text-sm rounded-lg transition-colors duration-200" />
                </div>
              </div>
            </div>
            <div className="bg-graydark800 w-[24rem] p-6 flex gap-5 items-center rounded-lg shadow-md border border-graydark700">
              <div className="flex-shrink-0">
                <img  src={toktok} className='w-[100px] h-[100px] rounded-lg object-cover border-2 border-gray-600' alt="Delivery Service"  />
              </div>

              <div className="flex flex-col space-y-3 ml-2">
                <h1 className='text-lg font-medium text-textWhite'>Toktok Rides</h1>    
                <p className='text-textgray400 text-sm'>Fast, affordable rides at your fingertips with TokTok.</p>
                <div className="mt-1">
                  <Buttons value="details"  className="w-36 h-10 text-white font-medium text-sm rounded-lg transition-colors duration-200" />
                </div>
              </div>
            </div>
            <div className="bg-graydark800 w-[24rem] p-6 flex gap-5 items-center rounded-lg shadow-md border border-graydark700">
              <div className="flex-shrink-0 bg-bgwhite rounded-lg">
                <img  src={scooter} className='w-[100px] h-[100px] rounded-lg object-cover border-2 border-gray-600' alt="Delivery Service"  />
              </div>

              <div className="flex flex-col space-y-3 ml-2">
                <h1 className='text-lg font-medium text-textWhite'>Scooter Rides</h1>    
                <p className='text-textgray400 text-sm'> Quick and affordable scooter rides around the city.</p>
                <div className="mt-1">
                  <Buttons value="details"  className="w-36 h-10 text-white font-medium text-sm rounded-lg transition-colors duration-200" />
                </div>
              </div>
            </div>
            
        </div>
     </div>
    </>
  )
}

export default RideOptions