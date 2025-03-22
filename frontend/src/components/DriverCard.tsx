import React from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import { HiDotsVertical } from "react-icons/hi";
const driverSchema = z.object({
  name: z.string(),
  id: z.string(),
  rating: z.number().min(0).max(5),
  trips: z.number(),
  vehicleType: z.string(),
  vehicleColor: z.string(),
  imageUrl: z.string().url(),
});

type Driver = z.infer<typeof driverSchema>;

interface DriverCardProps {
  driver: Driver;
}

const DriverCard: React.FC<DriverCardProps> = ({ driver }) => {
  const { name, id, rating, trips, vehicleType, vehicleColor, imageUrl } = driver;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="py-4 rounded-lg "
    >
      <div className="w-[100%] flex items-center justify-between gap-4 ">
         <div className="">
            <motion.img
            src={imageUrl}
            alt={name}
            className="w-16 h-16 rounded-full"
            whileHover={{ scale: 1.1 }}/>
         </div> 
         <div className="flex flex-col ">
            <h2 className="text-lg font-bold">{name}</h2>
            <span className="text-sm text-gray-600">{trips} Trips</span>
            <span className="text-yellow-500">★ {rating.toFixed(1)}</span>
         </div>
         <div className="flex flex-col gap-3">
            <p className="text-base text-white">ID: {id}</p>
            <p className="text-base text-white">{vehicleType} - {vehicleColor}</p>
         </div>
         <div className="">
              <HiDotsVertical size={25} />
         </div>
      </div>
    </motion.div>
  );
};

export default DriverCard;