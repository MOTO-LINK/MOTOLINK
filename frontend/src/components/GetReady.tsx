import React from 'react'
import tailwindConfig from '../../tailwind.config'
import { CustomTextField } from './SideBarHomeRider';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@mui/material';
import Buttons from './Button';


const schema=z.object({
    from: z.string().min(1, { message: "From is required" }),
    to: z.string().min(1, { message: "To is required" }),
})
type FormData = z.infer<typeof schema>;

const GetReady = () => {
      const colors= tailwindConfig.theme.extend.colors;
      const {control,formState: { errors },} = useForm<FormData>({resolver: zodResolver(schema)});
      const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDDTnpX_GjM81nqZ2VGCSA3-dUCYbY2pNo",
        libraries:["places"],
      });
      if (!isLoaded) return <div>Loading Maps...</div>;
      if (loadError) return <div>Error loading maps</div>;


  return (
    <>
     <div className="w-[30rem] mb-20">
        <div className="">
            <h1 className='text-textWhite text-7xl font-bold '>Get ready to request your first ride</h1>
            <p className='text-textWhite text-base mt-10'>Discover how easy and convenient Uber makes it. Request a consultation now or schedule one for later directly from your browser.</p>
        </div>
        <div className="flex flex-col gap-7 mt-10">
            <CustomTextField
                name="from"
                label="From"
                defaultValue="El Sheikh Zayed"
                control={control}
                errors={errors}
                icon={<LocationOnIcon style={{ color: "#D7B634", marginLeft: -15, marginRight: -20 }} />}
                isLoaded={isLoaded} 
            />
            <CustomTextField  
                name="to"
                label="to"
                defaultValue="6 October"
                control={control}
                isLoaded={isLoaded} 
                errors={errors} icon={
                    <svg style={{ color: "#D7B634", marginLeft: -15, marginRight: -20 }} width="20" height="20" viewBox="0 0 20 20"  fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.16667 19.1665V17.4998C7.43056 17.3054 5.94097 16.5866 4.69792 15.3436C3.45486 14.1005 2.73611 12.6109 2.54167 10.8748H0.875V9.20817H2.54167C2.73611 7.47206 3.45486 5.98248 4.69792 4.73942C5.94097 3.49637 7.43056 2.77762 9.16667 2.58317V0.916504H10.8333V2.58317C12.5694 2.77762 14.059 3.49637 15.3021 4.73942C16.5451 5.98248 17.2639 7.47206 17.4583 9.20817H19.125V10.8748H17.4583C17.2639 12.6109 16.5451 14.1005 15.3021 15.3436C14.059 16.5866 12.5694 17.3054 10.8333 17.4998V19.1665H9.16667ZM10 15.8748C11.6111 15.8748 12.9861 15.3054 14.125 14.1665C15.2639 13.0276 15.8333 11.6526 15.8333 10.0415C15.8333 8.43039 15.2639 7.05539 14.125 5.9165C12.9861 4.77762 11.6111 4.20817 10 4.20817C8.38889 4.20817 7.01389 4.77762 5.875 5.9165C4.73611 7.05539 4.16667 8.43039 4.16667 10.0415C4.16667 11.6526 4.73611 13.0276 5.875 14.1665C7.01389 15.3054 8.38889 15.8748 10 15.8748Z" fill="#FFCC03"/>
                    </svg> }
            />
        </div>
        <div className="mt-4">
            <a href="/HomeRider"><Buttons value='Check Price' className='w-60' /></a>
        </div>
     </div>
    
    </>
  )
}

export default GetReady