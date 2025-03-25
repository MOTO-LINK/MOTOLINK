import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import MapComponent from '../components/Map'
import SideBarHomeDriver from '../components/SideBarHomeDriver'
const HomeDriver = () => {
  return (
    <div className="">
          <ResponsiveAppBar/>
          <div className="flex items-start justify-between min-h-screen bg-gray-900">
              <SideBarHomeDriver />
              <MapComponent />
          </div>
        </div>
  )
}

export default HomeDriver