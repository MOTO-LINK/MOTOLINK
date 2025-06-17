import ScrollToTopButton from '../../Components/HomeDashboard/ScrollToTopButton'
import BookYourRide from '../../Components/HomeDashboard/BookYourRide'
import DownloadSection from '../../Components/HomeDashboard/DownloadSection'
import GetReady from '../../Components/HomeDashboard/GetReady'
import HowItWorksMasterpiece from '../../Components/HomeDashboard/HowItWorksMasterpiece'
import MapComponent from '../../Components/HomeDashboard/MapComponent'
import ResponsiveAppBar from '../../Components/HomeDashboard/ResponsiveAppBar'
import OrderSection from '../../Components/HomeDashboard/OrderSection'
import RideOptions from '../../Components/HomeDashboard/RideOptions'
import React, { useState } from 'react'
import GalacticFooter from '@/Dashboard/Components/HomeDashboard/GalacticFooter'
const DEFAULT_FROM: [number, number] = [30.0444, 31.2357];
const DEFAULT_TO: [number, number] = [30.033333, 31.233334];
const Home = () => {
   const [fromCoords, setFromCoords] = useState<[number, number]>(DEFAULT_FROM);
        const [toCoords, setToCoords] = useState<[number, number]>(DEFAULT_TO);
  return (
    <> 
    <ResponsiveAppBar />
    <ScrollToTopButton />
    <div className='w-[80%] m-auto'>
      <div className="flex items-start gap-20 mt-16 ">
          <div className="mt-10">
              <GetReady setFromCoords={setFromCoords} setToCoords={setToCoords}/>  
          </div>
          <div className="w-[940px] h-[580px] mr-5">
                <MapComponent from={fromCoords} to={toCoords} />
           </div>
      </div>
      
      <RideOptions/>
      <HowItWorksMasterpiece/>
      <BookYourRide/>
      <DownloadSection/>
      <OrderSection/>
    </div>
      <GalacticFooter/>
    </>
  )
}

export default Home