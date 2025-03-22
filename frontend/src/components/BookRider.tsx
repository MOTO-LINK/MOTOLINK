import React, { useState } from 'react'
import CountrySelector from './SelectLanguage'
import { SelectMenuOption } from '../lib/types';
import { COUNTRIES } from '../lib/countries';
import Button from '@mui/material/Button';
import BikeOnRoad from './Bike';
import { Link } from 'react-router-dom';
const BookRider = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [country, setCountry] = useState<SelectMenuOption["value"]>("US");
  
  return (
    <>
     <div className={"flex flex-col items-end m-2 "}>
      <div className={"w-56 px-5"}>
        <CountrySelector
          id={"country-selector"}
          open={isOpen}
          onToggle={() => setIsOpen(!isOpen)}
          onChange={setCountry}
          selectedValue={COUNTRIES.find((option) => option.value === country)!}
        />
      </div>
     </div>
     <div className="w-[50%] m-auto text-center">
         <BikeOnRoad/>
         <p className='text-white text-5xl font-bold mb-10 -mt-10'>book a ride anywhere anytime!</p>
         <div className="flex gap-2 items-center justify-center mb-10">
            <p className='bg-[#FACC15] w-[23px] h-[9px] rounded-[20px] '></p>
            <p className='bg-[#FFF1C5] w-[9px] h-[9px] rounded-full'></p>
            <p className='bg-[#FFF1C5] w-[9px] h-[9px] rounded-full'></p>
         </div>
         <p className='bg-[#40381C] w-[700px] h-[.5px] rounded-[20px] ml-10 mb-10'></p>
         <Link to={"/"} className="w-[100%] m-auto ml-5 " >
             <Button variant="contained" color={"black"} sx={{backgroundColor:"#D7B634",paddingX:35,paddingY:1.5,borderRadius:3,fontSize:23,fontWeight:700,marginBottom:5,textTransform:"capitalize"}}>Next</Button> 
         </Link>
         <p className='text-xl mb-5 text-white'>Already have an account? <Link to={"/"} className='text-[#D7B634]'>login</Link> </p>
     </div>
    </>
  )
}

export default BookRider


