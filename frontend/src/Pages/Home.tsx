import ScrollToTopButton from '@/components/Animation/ScrollToTopButton'
import BookYourRide from '@/components/BookYourRide'
import DownloadSection from '@/components/DownloadSection'
import GalacticFooter from '@/components/Footer'
import GetReady from '@/components/GetReady'
import HowItWorksMasterpiece from '@/components/HowitWork/HowItWorks'
import MapComponent from '@/components/Map'
import ResponsiveAppBar from '@/components/Navbar'
import OrderSection from '@/components/OrderSection'
import RideOptions from '@/components/RideOptions/RideOptions'
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
      
      <RideOptions/>
      <HowItWorksMasterpiece/>
      <BookYourRide/>
      <DownloadSection/>
      <OrderSection/>
   
    </div>
      <GalacticFooter/>
      <ScrollToTopButton/>
    </>
  )
}

export default Home