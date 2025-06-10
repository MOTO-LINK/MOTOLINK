import { Button } from '@/components/ui/button'
import React, { useRef, useState } from 'react'
import flag from "../../../assets/images/flag.png"
import { CirclePlus, LockKeyhole, MapPin, MapPinned, Pencil, Phone, Plus } from 'lucide-react'
import pic1 from "../../../assets/images/woman.png"

import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { FiCamera } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'

const WorkflowPage = () => {

    const [profileImg, setProfileImg] = useState(pic1)
    const fileInputRef = useRef<HTMLInputElement>(null)
  
    const handleImageClick = () => {
      fileInputRef.current?.click()
    }
  
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        const file = e.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
          if (reader.result) {
            setProfileImg(reader.result as string)
          }
        }
        reader.readAsDataURL(file)
      }
    }

  return (
   <div className='relative h-[90%] '>
      <div className="mt-10">
        <a href="/dashboard/WorkflowPage/WorkFlowsecond">
          <Button variant="link" className='decoration-0 decoration-white   '>
            <img src={flag} alt="" className='w-12' />
            <span className='text-xl font-[qbold]'>Arab Republic of Egypt</span>
          </Button>
        </a>
        <p className='w-[95%] h-[1.5px] bg-[#E5E5E5] ml-5 mt-2'></p>    
      </div>
      <div className="absolute bottom-0 left-10">    
        <Dialog>
          <DialogTrigger asChild>
            <Button className='bg-[#303030] text-white text-lg font-[qbold] rounded-full px-7 py-7 hover:bg-[#303030ef]'>
                <Plus size={36} /> Add a new country
              </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[590px]">
            <DialogHeader>
              <DialogTitle className="text-center">Adding a country</DialogTitle>
            </DialogHeader>
            <div className="">

              <div className="space-y-4 ">
                <div className="relative left-20 flex items-center justify-center w-52 ml-16">
                    <img
                      src={profileImg} 
                      alt="Profile"
                      className="w-32 h-32 rounded-full border object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleImageClick}
                      className="absolute bottom-4 right-7 bg-white shadow-md rounded-full w-8 h-8 flex items-center justify-center border hover:bg-gray-100 transition"
                      style={{ zIndex: 10 }}
                    >
                      <FiCamera className="w-4 h-4 text-gray-700" />
                    </button>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                <div className="">
                    <Input id="country" placeholder='Enter the country name'  className="h-12 rounded-xl" />
                </div>
                <div className="">
                    <Input id="Country-code" placeholder='Country code'  className="h-12 rounded-xl" />
                </div>
                <div className="">
                    <Input id="State-currency" placeholder='State currency'  className="h-12 rounded-xl" />
                </div>
                <div className="">
                    <Input id="delivery-charge" placeholder='Specify the delivery charge'  className="h-12 rounded-xl" />
                </div>
                <div className="">
                    <Input id="price" placeholder='Specify the price per kilo for delivery'  className="h-12 rounded-xl" />
                </div>
                <div className="">
                    <Input id="price-package" placeholder='Set the price for the packaging service'  className="h-12 rounded-xl" />
                </div>
              </div>

            </div>
            <DialogFooter className="relative -left-52 my-5 ">
              <Button type="submit" className='px-10 py-6 font-[qbold] text-xl rounded-full '>Okay</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
   </div>
  )
}

export default WorkflowPage