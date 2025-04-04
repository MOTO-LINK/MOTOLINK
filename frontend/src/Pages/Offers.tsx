import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent, Typography, Button } from "@mui/material";
import { Tag } from "lucide-react";
import { z } from "zod";
import "tailwindcss/tailwind.css";
import { GiPriceTag } from "react-icons/gi";
import { IoIosArrowForward } from "react-icons/io";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";
const offerSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.string(),
});

type OfferData = z.infer<typeof offerSchema>;

const offers: OfferData[] = [
  {
    title: "Enjoy the best discounts with us",
    description: "There are many journeys waiting for you, prepare for your trip",
    date: "22/8/2025",
  },
  {
    title: "Up to 100% discount on 4 rides up to 100 EGP",
    description: "There are many journeys waiting for you, prepare for your trip",
    date: "20/3/2025",
  },
];
    const colors=tailwindConfig.theme.extend.colors;
const OffersPage = () => {
  return (
    <>
        <ResponsiveAppBar/>
        <div className="flex flex-col items-center min-h-screen  p-6">
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl border-2 border-gold-1 rounded-2xl shadow-xl shadow-gold-1 px-8 py-10"
        >
            <h1  className="text-textWhite text-4xl font-bold text-center mb-4">
            Offers
            </h1>
            <h1 className="text-textgray text-xl text-center mb-7">
            Book now and get the best discounts
            </h1>
            {offers.map((offer, index) => (
            <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.2, duration: 0.5 }}
                className="mb-4"
            >
                <div className=" text-textWhite rounded-xl shadow-sm my-8 py-5 px-7  shadow-gold-1 hover:shadow-gold-1 hover:shadow-md duration-300 transition-all cursor-pointer border border-gold-1">
                <div className="flex justify-between items-center">
                    <div className="flex flex-col gap-2">
                        <h1  className="font-semibold">{offer.title}</h1>
                        <h1  className="text-gray-400 mt-1 w-96">{offer.description}</h1>
                        <h1  className="text-gray-500 mt-2 block">{offer.date}</h1>
                    </div>
                    <div className="flex gap-3 items-center">
                        <GiPriceTag size={30} color={colors["gold-1"]} />
                        <IoIosArrowForward size={20} color={colors.textgray}/>
                    </div>
                </div>
                </div>
            </motion.div>
            ))}
            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-6 w-full"
            >
            <Button
                sx={{
                    backgroundColor: colors["gold-1"],
                    color: colors.text,
                    fontSize:18,
                    fontWeight: "bold",
                    borderRadius: "8px",
                    py:1.5,
                    my:1,
                    "&:hover": {
                        backgroundColor: colors["gold-2"],
                        },
                    "&:active": {
                        backgroundColor: colors["gold-1"],
                        },
                    "&:focus": {
                        outline: "none",
                        boxShadow: `0 0 0 4px ${colors["gold-1"]}`,
                        },
                    }}
                fullWidth
            >
                Book now
            </Button>
            </motion.div>
        </motion.div>
        </div>
    </>
  );
};

export default OffersPage;
