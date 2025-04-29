import React from 'react'
import ResponsiveAppBar from '../components/Navbar'
import Sidebar from '../components/SideBarHomeRider'
import MapComponent from '../components/Map'
import { useForm } from 'react-hook-form'
import RideOptions from '@/components/RideOptions/RideOptions'

const HomeRider = () => {
  const { control, watch } = useForm({
    defaultValues: {
      from: "El Sheikh Zayed",
      to: "6 October",
    },
  });
  const from = watch("from");
  const to = watch("to");
  return (
    <div className="">
      <div className="flex items-start justify-between min-h-screen ">
          <Sidebar />
          <div className="w-[940px] h-[580px] mr-5">
              <MapComponent from="Cairo" to="Giza" className="w-[100%] h-[100%]" />
          </div>
      </div>
    </div>
  )
}

export default HomeRider