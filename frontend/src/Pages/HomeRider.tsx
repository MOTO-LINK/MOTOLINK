import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import Sidebar from '../components/SideBarHomeRider'
import MapComponent from '../components/Map'

const HomeRider = () => {
  return (
    <div className="">
      <ResponsiveAppBar/>
      <div className="flex items-start justify-between min-h-screen bg-gray-900">
          <Sidebar />
          <MapComponent />
      </div>
    </div>
  )
}

export default HomeRider