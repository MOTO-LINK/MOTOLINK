import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import MapComponent from '../components/Map'
import SideBarHomeDriver from '../components/SideBarHomeDriver'
import SideBarTrackOrder from './SideBarTrackOrder'
const TrackOrder = () => {
  return (
    <div className="">
          <div className="flex items-start justify-between min-h-screen ">
              <SideBarTrackOrder />
              <div className="w-[940px] h-[580px] mr-5">
                  <MapComponent from="Cairo" to="Giza" className="w-[100%] h-[100%]" />
              </div>
          </div>
        </div>
  )
}

export default TrackOrder