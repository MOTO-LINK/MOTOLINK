import React from 'react'
import { Button } from '@/components/ui/button'
import flag from "../../../../assets/images/8400c6fcea26c39cc2b14830c258b176b73b2482.png" 
import flag1 from "../../../../assets/images/b06d699238ab06893a701538631d148a176360e4.png" 
import { Link } from 'react-router-dom'
import { MoveLeft } from 'lucide-react'
const Representatives = () => {
  return (
    <>
     <div className="relative min-h-[80vh] ">
          <div className="mt-10">
            <a href="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/RepresentativesPage">
              <Button variant="link" className='decoration-0 decoration-white   '>
                <img src={flag} alt="" className='w-10 border border-indigo-50 rounded-xl' />
                <span className='text-xl font-[qbold]'>Representatives</span>
              </Button>
            </a>
            <p className='w-[95%] h-[1.5px] bg-[#E5E5E5] ml-5 mt-2'></p>
                
          </div>
          <div className="mt-5">
            <a href="/dashboard/WorkflowPage/WorkFlowsecond/Representatives/ProhibitedRepresentatives">
              <Button variant="link" className='decoration-0 decoration-white   '>
                <img src={flag1} alt="" className='w-10 border border-indigo-50 rounded-xl' />
                <span className='text-xl font-[qbold]'>Prohibited representatives</span>
              </Button>
            </a>
            <p className='w-[95%] h-[1.5px] bg-[#E5E5E5] ml-5 mt-2'></p>         
          </div>
          <div className="flex justify-start  mt-12 px-8 pb-8">
            <Link to="/dashboard/WorkflowPage/WorkFlowsecond"
              className="flex items-center absolute bottom-0 left-5 gap-2 bg-[#2d2926] text-white px-8 py-3 rounded-full text-base font-medium shadow hover:bg-[#1a1817] transition">
              <MoveLeft />
              Back
            </Link>
          </div>
     </div>
    </>
  )
}

export default Representatives