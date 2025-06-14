import { Button } from '@/components/ui/button'

import flag from "../../../assets/images/flag.png"

const FinancialsPage = () => {

  return (
    <>
      <div className='relative h-[90%] '>
      <div className="mt-10">
        <a href="/dashboard/FinancialsPage/FinancialsSecondPage">
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

export default FinancialsPage