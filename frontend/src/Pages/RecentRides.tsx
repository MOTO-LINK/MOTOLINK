import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Avatar } from "@mui/material";
import { Star } from "lucide-react";
import { z } from "zod";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";

const rideSchema = z.object({
  tripFare: z.number().min(0),
  tollsFees: z.number().min(0),
});

type RideData = z.infer<typeof rideSchema>;

const RecentRides = () => {
  const rideData: RideData = { tripFare: 15, tollsFees: 5 };
  const validation = rideSchema.safeParse(rideData);
  if (!validation.success) return <div>Invalid Data</div>;
   const colors=tailwindConfig.theme.extend.colors;
  return (
    <>
    <ResponsiveAppBar/>
    <div className="flex justify-center mt-10 min-h-screen  p-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl"
      >
        <div className="bg-bg text-white rounded-2xl shadow-xl shadow-gold-1 border-2 border-gold-1 p-6">
          <div>
            <h1 className="text-center text-textWhite text-3xl font-bold mb-5 mt-3">
              Recent Rides
            </h1>
            <div className="flex items-center gap-4 my-8">
              <img 
              src="data:image/png;base64,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" alt="User" className="w-20 h-20 rounded-full" />
              <div className="flex items-center justify-between w-full">
                <h1 className="text-xl font-bold">Your rated</h1>
                <div className="flex ml-2 text-goldlight">
                  {[...Array(4)].map((_, i) => (
                    <Star key={i} size={20} fill={colors["yello"]} stroke={colors["yello"]} />
                  ))}
                  <Star size={20} fill={colors.textgray} stroke={colors.textgray} />
                </div>
              </div>
            </div>
            <h1 className="font-semibold mt-4 text-2xl">
              Scooter Rides
            </h1>
            <div className="mt-7 mb-7 flex flex-col gap-4">
              <div className="flex justify-between text-gray-400 text-lg">
                <h1>Trip Fare</h1>
                <h1 className="font-semibold">${rideData.tripFare}</h1>
              </div>
              <div className="flex justify-between text-gray-400 text-lg">
                <h1>Subtotal</h1>
                <h1 className="font-semibold">${rideData.tripFare}</h1>
              </div>
              <div className="flex justify-between text-gray-400 text-lg">
                <h1>Tolls, Surcharges, and Fees</h1>
                <h1 className="font-semibold">${rideData.tollsFees}</h1>
              </div>
            </div>
            <div className="border-t border-yello mt-4 mb-3 pt-4 flex justify-between text-xl">
              <h1 className="text-yello font-semibold">Total</h1>
              <h1 className="text-yello font-semibold">
                ${rideData.tripFare + rideData.tollsFees}
              </h1>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
    </>
  );
};

export default RecentRides;
