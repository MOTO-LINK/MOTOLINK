import React from "react";
import { motion } from "framer-motion";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaHome, FaLock, FaRoute, FaAccessibleIcon } from "react-icons/fa";
import { MdWork } from "react-icons/md";
import { RiShieldUserFill } from "react-icons/ri";
import "tailwindcss/tailwind.css";
import ResponsiveAppBar from "../components/Navbar";

const user = {
  name: "Mohamed Ahmed",
  phone: "01555405968",
  email: "Mo********@gmail.com",
  avatar: "https://randomuser.me/api/portraits/men/32.jpg",
};

const SettingPage: React.FC = () => {
  return (
    <>
      <ResponsiveAppBar />
      <div className="min-h-screen  text-textWhite p-4 md:px-16 xl:px-48">
        <div className="flex items-center justify-center gap-4 mt-6">
          <h1 className="text-3xl font-semibold text-center">Settings</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mt-8"
        >
          <img
            src={user.avatar}
            alt="user"
            className="w-28 h-28 rounded-full object-cover border-4 border-yello"
          />
          <p className="text-yello mt-2 font-medium">{user.name}</p>
          <p className="text-sm text-textgray">{user.phone}</p>
          <p className="text-sm text-textgray">{user.email}</p>
        </motion.div>

        <div className="mt-10">
          <h2 className="text-lg font-semibold mb-4">Application settings</h2>
          <ul className="space-y-4">
            <SettingItem icon={<FaHome />} label="Add home address" />
            <SettingItem icon={<MdWork />} label="Add work title" />
            <SettingItem icon={<FaLock />} label="Privacy" />
            <SettingItem icon={<FaAccessibleIcon />} label="Special needs feature" />
          </ul>

          <h2 className="text-lg font-semibold mt-8 mb-4">Safety</h2>
          <ul className="space-y-4 mb-16">
            <SettingItem icon={<RiShieldUserFill />} label="Safety Preferences" />
            <SettingItem icon={<FaRoute />} label="Check the progress of the trip" />
          </ul>
        </div>
      </div>
    </>
  );
};

interface SettingItemProps {
  icon: React.ReactNode;
  label: string;
}

const SettingItem: React.FC<SettingItemProps> = ({ icon, label }) => (
  <motion.li
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ duration: 0.4 }}
    className="flex justify-between items-center p-4 rounded-xl bg-bg hover:bg-bglight cursor-pointer shadow-md"
  >
    <div className="flex items-center gap-4">
      <span className="text-yello text-xl">{icon}</span>
      <span className="text-base text-textWhite">{label}</span>
    </div>
    <IoIosArrowForward className="text-textWhite text-xl" />
  </motion.li>
);

export default SettingPage;
