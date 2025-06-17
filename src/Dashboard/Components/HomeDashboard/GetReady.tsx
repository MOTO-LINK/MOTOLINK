import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useLoadScript } from '@react-google-maps/api';
import { Button } from '@mui/material';
import { MdOutlineLocationSearching } from "react-icons/md";
import { CommonTextField } from '../CommonTextField';
import { Input } from "@/components/ui/input";
import Buttons from './Buttons';


const schema=z.object({
    from: z.string().min(1, { message: "From is required" }),
    to: z.string().min(1, { message: "To is required" }),
})
type FormData = z.infer<typeof schema>;
type Prop = {
  setFromCoords: (coords: [number, number]) => void;
  setToCoords: (coords: [number, number]) => void;
};
const GetReady: React.FC<Prop>  = ({setFromCoords,setToCoords}) => {

      const { control, formState: { errors } } = useForm<FormData>({
        resolver: zodResolver(schema),
        defaultValues: {
          from: "El Sheikh Zayed",
          to: "6 October"
        }
      });
      const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: "AIzaSyDDTnpX_GjM81nqZ2VGCSA3-dUCYbY2pNo",
        libraries:["places"],
      });

        const [fromCoords, setLocalFromCoords] = useState<[number, number]>([30.0444, 31.2357]);
        const [toCoords, setLocalToCoords] = useState<[number, number]>([30.033333, 31.233334]);
      
         const handleSearch = async (type: "from" | "to", value: string) => {
            if (!value) return;
            const res = await fetch(
              `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(value)}`
            );
            const data = await res.json();
            if (data && data.length > 0) {
              const coords: [number, number] = [parseFloat(data[0].lat), parseFloat(data[0].lon)];
              if (type === "from") setFromCoords(coords);
              else setToCoords(coords);
              // Optionally update local state as well if needed:
              if (type === "from") setLocalFromCoords(coords);
              else setLocalToCoords(coords);
            }
          };

      if (!isLoaded) return <div>Loading Maps...</div>;
      if (loadError) return <div>Error loading maps</div>;


  return (
    <>
     <div className="w-[30rem] mb-20">
        <div className="">
            <h1 className='text-text text-7xl font-bold '>Get ready to request your first ride</h1>
            <p className='text-text text-base mt-10'>Discover how easy and convenient Uber makes it. Request a consultation now or schedule one for later directly from your browser.</p>
        </div>
        <div className="flex flex-col gap-7 mt-10">
          <div>
            <label className="block text-white text-base mb-2 font-semibold" htmlFor="from">From</label>
            <Input
              id="from"
              className="bg-transparent border border-[#BEB58F50] rounded-lg text-text py-3 px-4 focus:border-[#BEB58F] focus:ring-0 placeholder:text-gray-400"
              placeholder="From"
              defaultValue="El Sheikh Zayed"
              onBlur={e => handleSearch("from", e.target.value)}
            />
            {errors.from && <span className="text-red-500 text-xs">{errors.from.message}</span>}
          </div>
          <div>
            <label className="block text-white text-base mb-2 font-semibold" htmlFor="to">To</label>
            <div className="relative">
              <Input
                id="to"
                className="bg-transparent border border-[#BEB58F50] rounded-lg text-text py-3 px-4 pr-12 focus:border-[#BEB58F] focus:ring-0 placeholder:text-gray-400"
                placeholder="To"
                defaultValue="6 October"
                onBlur={e => handleSearch("to", e.target.value)}
              />
              <MdOutlineLocationSearching className="absolute right-3 top-1/2 -translate-y-1/2 text-gold-1 text-2xl pointer-events-none" />
            </div>
            {errors.to && <span className="text-red-500 text-xs">{errors.to.message}</span>}
          </div>
        </div>
        <div className="mt-4">
            <a href="/HomeRider"><Buttons value='Check Price' className='w-60' /></a>
        </div>
     </div>
    
    </>
  )
}

export default GetReady