import GetReady from '@/components/GetReady'
import MapComponent from '@/components/Map'
import ResponsiveAppBar from '@/components/Navbar'
import RideOptions from '@/components/RideOptions'
import React from 'react'

const Home = () => {
  return (
    <>
     <ResponsiveAppBar/>
    <div className='w-[80%] m-auto'>
      <div className="flex items-start gap-20 mt-16 ">
          <div className="mt-10">
              <GetReady/>  
          </div>
          <div className="w-[40rem] h-[40rem]">
              <MapComponent from="Cairo" to="Giza" className="w-[100%] h-[100%]" />
          </div>
      </div>
      <div className="">
        <RideOptions/>
      </div>

    </div>
    </>
  )
}

export default Home