import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { z } from 'zod';
import CallIcon from '@mui/icons-material/Call';
import MessageIcon from '@mui/icons-material/Message';
import { colors } from '@mui/material';
import tailwindConfig from '../../tailwind.config';

const DriverSchema = z.object({
  id: z.string().min(4),
  code: z.string().length(3),
  time: z.string().regex(/^\d{2}:\d{2}:\d{2}$/),
  vehicleType: z.string().min(2),
  vehicleColor: z.string().min(3),
  driverName: z.string().min(3),
  rating: z.number().min(0).max(5),
  tripsCompleted: z.number().min(0),
  avatar: z.string().url(),
});

type DriverData = z.infer<typeof DriverSchema>;

const fetchDriverData = async (): Promise<DriverData> => {
  return {
    id: "8545",
    code: "AFS",
    time: "00:07:30",
    vehicleType: "Tuktuk",
    vehicleColor: "black",
    driverName: "Moamed Ahmed",
    rating: 4.9,
    tripsCompleted: 320,
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  };
};

export const TuktukDriverCard = () => {
  const [driverData, setDriverData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDriverData();
        setDriverData(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) return <div className="w-[320px] h-[220px] bg-black rounded-xl p-5 animate-pulse" />;
  if (!driverData) return null;

  const colors=tailwindConfig.theme.extend.colors;

  return (
    <motion.div>
        <div className="px-3">
            <div className="flex justify-between items-center mb-2">
                
                <div className="text-sm font-medium">
                ID: {driverData.id}/{driverData.code}
                </div>
                <div className="text-lg font-bold text-gray-300">
                {driverData.time}
                </div>
            </div>
            <div className="flex justify-start gap-2 my-2 text-beige-3 text-sm font-light">
                <span>{driverData.vehicleType}</span>
                <span>/</span>
                <span className="capitalize">{driverData.vehicleColor}</span>
            </div>
        </div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} whileHover={{ scale: 1.02 }} className="flex items-end gap-4 w-[380px] rounded-xl mt-6 bg-bg px-5 py-4 mb-8 text-white shadow-lg relative overflow-hidden">
            <motion.div
                whileHover={{ scale: 1.05 }}
                className="relative"
            >
                <img 
                src={driverData.avatar}
                alt={driverData.driverName}
                className="w-16 h-16 rounded-full  object-cover border-2 border-yellow-400"
                />
                <motion.div
                className="absolute -inset-1 border-2 border-yellow-400 rounded-full opacity-0"
                animate={{
                    opacity: [0, 0.3, 0],
                    scale: [1, 1.2, 1.4]
                }}
                transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1
                }}
                />
            </motion.div>

            <div className="flex items-center justify-between gap-8">

                <div className="flex flex-col items-center mt-2">
                    <span className="text-base font-bold my-2">{driverData.driverName}</span>
                    <span className="text-yellow-400 text-lg mr-1">★<span className='text-beige-3' >{driverData.rating.toFixed(1)}</span><span className='ml-2 text-beige-3'>/</span><span className="text-gray-400 text-sm ml-2">{driverData.tripsCompleted} Trips</span></span>
                </div>
                <div className="flex gap-3 items-center justify-between cursor-pointer">
                    <div className="bg-bglight w-10 text-center h-10 pt-1 rounded-full">
                         <MessageIcon fontSize='large'  className=' text-gold-1  p-1 ' />
                    </div>
                    <div className="bg-bglight w-10 text-center h-10 pt-1 rounded-full">
                         <CallIcon fontSize='large'  className=' text-gold-1  p-1 ' />
                    </div>
                </div>
            </div>
        </motion.div>
    </motion.div>
  );
};