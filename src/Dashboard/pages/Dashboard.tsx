import React from 'react'
import Sidebar from '../Components/SiderComponent/SideBar'
import HeaderBar from '../Components/HeaderBar'
import DashboardSection from '../Components/DashboardSection'
import TopCards from '../Components/TopCards'

const Dashboard = () => {
  return (
    <div className="flex h-screen">

      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <TopCards/>
          <DashboardSection />
        </div>
      </div>
    </div>
  )
}

export default Dashboard