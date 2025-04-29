import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import Sidebar from '../components/SideBarHomeRider'
import BookingSideBar from '../components/BookingSidebar'
import MapComponent from '../components/Map'

const Booking = () => {
  return (
    <div className="">
      <div className="flex items-start justify-between min-h-screen ">
          <BookingSideBar />
          <div className="w-[940px] h-[580px] mr-5">
              <MapComponent from="Cairo" to="Giza" className="w-[100%] h-[100%]" />
          </div>
      </div>
    </div>
  )
}

export default Booking