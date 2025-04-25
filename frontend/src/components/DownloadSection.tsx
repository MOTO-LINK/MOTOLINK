import React from "react";
import { motion } from "framer-motion";
import { FaGooglePlay, FaApple } from "react-icons/fa";
import woman from "../assets/images/road2.png";
const data=[
    {
    icon: <FaGooglePlay className="text-xl" />,
    text: "Google Play",
    href: "https://play.google.com/store",
    bg: "bg-black hover:bg-gray-900"
  },
  {
    icon: <FaApple className="text-xl" />,
    text: "App Store",
    href: "https://apple.com/app-store",
    bg: "bg-white text-black hover:bg-gray-100"
  }]
const DownloadSection = () => {
  return (
    <div className="w-full relative overflow-hidden mb-20 rounded-xl border border-textgray px-6 md:px-24 py-24 bg-transparent z-10">

      <div className="absolute inset-0 z-[-1]">
        <div className="w-full h-full bg-gradient-to-r from-bg/80 via-bglight/80 to-bg1/80 animate-pulse opacity-70 blur-2xl" />
      </div>

      <div className="flex flex-col md:flex-row items-center justify-between gap-16 relative z-10">

        <motion.div className="flex flex-col items-start space-y-8 text-textWhite max-w-xl" initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }}>
            <motion.h1 className="text-5xl font-extrabold bg-gradient-to-r from-gold-1 via-textWhite to-gold-1 bg-clip-text text-transparent leading-tight animate-gradient">
                We are always to welcome
            </motion.h1>

            <p className="text-textgray400 text-lg leading-relaxed tracking-wide">
                Greater comfort. Stronger performance. Improved safety. No Compromise.
            </p>

            <div className="flex gap-5 mt-4">
                {data.map(({ icon, text, href, bg }, i) => (
                <motion.a key={i} href={href} target="_blank" rel="google" whileHover={{ scale: 1.08 }}  whileTap={{ scale: 0.95 }}
                    className={`flex items-center gap-2 ${bg} px-5 py-3 rounded-xl font-semibold shadow-xl transition`}>
                    {icon}
                    <span className="text-sm">{text}</span>
                </motion.a>
                ))}
            </div>

        </motion.div>

        <motion.div className="max-w-xl w-full">
          <img src={woman} alt="Ride Illustration" className="w-full rounded-3xl shadow-2xl border border-gray-800"/>
        </motion.div>
      </div>
    </div>
  );
};

export default DownloadSection;
