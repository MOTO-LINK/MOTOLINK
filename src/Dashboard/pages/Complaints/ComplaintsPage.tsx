import { Button } from '@/components/ui/button'
import React, { useRef, useState } from 'react'
import flag from "../../../assets/images/flag.png"
import { CirclePlus, LockKeyhole, MapPin, MapPinned, Pencil, Phone, Plus } from 'lucide-react'
import pic1 from "../../../assets/images/woman.png"

import {Dialog,DialogContent,DialogDescription,DialogFooter,DialogHeader,DialogTitle,DialogTrigger,} from "@/components/ui/dialog"
import { FiCamera } from 'react-icons/fi'
import { Input } from '@/components/ui/input'
import { Link } from 'react-router-dom'
const ComplaintsPage = () => {

  return (
    <>
      <div className='relative h-[90%] '>
      <div className="mt-10">
        <a href="/dashboard/ComplaintsPage/ComplaintsSecondPage">
          <Button variant="link" className='decoration-0 decoration-white   '>
            <img src={flag} alt="" className='w-12' />
            <span className='text-xl font-[qbold]'>Arab Republic of Egypt</span>
          </Button>
        </a>
        <p className='w-[95%] h-[1.5px] bg-[#E5E5E5] ml-5 mt-2'></p>    
      </div>
     
     </div>
    </>
  )
}

export default ComplaintsPage