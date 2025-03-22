import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import Sidebar from '../components/SideBarHomeRider'
import BookingSideBar from '../components/BookingSidebar'
import MapComponent from '../components/Map'

const Booking = () => {
  return (
    <div className="">
      <ResponsiveAppBar/>
      <div className="flex items-start justify-between min-h-screen bg-gray-900">
          <BookingSideBar />
          <MapComponent />
      </div>
    </div>
  )
}

export default Booking