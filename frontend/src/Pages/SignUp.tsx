"use client"
import { motion } from "framer-motion";
import { useState } from "react";
import { FaCar, FaWheelchair } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignUp() {
  const [selectedRole, setSelectedRole] = useState<"Driver" | "Rider" | null>(
    null
  );

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md  border-2 border-[#CEB13F] shadow-[#C0A94D] bg-[#00000023] p-6 rounded-2xl shadow-lg text-white"
      >
        <div className="text-center mb-6">
          <h2 className="text-xl font-semibold">Sign up</h2>
          <p className="text-gray-400 mt-2">
            Welcome to <span className="text-yellow-500">Motolink</span>
          </p>
          <p className="text-gray-400 text-sm">
            Choose your role: Driver or Rider
          </p>
          <div className="w-full h-1 bg-gray-700 mt-4">
            <div className="w-1/3 h-full bg-yellow-500" />
          </div>
        </div>

        <div className="flex justify-center space-x-4 my-6">
          <button
            className={`flex flex-col items-center p-4 border rounded-lg w-24 ${
              selectedRole === "Driver"
                ? "border-yellow-500"
                : "border-gray-500"
            }`}
            onClick={() => setSelectedRole("Driver")}
          >
            <FaCar className="text-yellow-500 text-2xl" />
            <span className="mt-2">Driver</span>
          </button>
          <button
            className={`flex flex-col items-center p-4 border rounded-lg w-24 ${
              selectedRole === "Rider" ? "border-yellow-500" : "border-gray-500"
            }`}
            onClick={() => setSelectedRole("Rider")}
          >
            <FaWheelchair className="text-yellow-500 text-2xl" />
            <span className="mt-2">Rider</span>
          </button>
        </div>
        <Link to={"/SignUpRider1"}>
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md mt-4"
        >
          Next
        </motion.button>
        </Link>  

        <div className="text-center text-gray-400 mt-4">
          Already have an account?{" "}
          <a
            href="/login"
            className="text-yellow-500 cursor-pointer hover:underline"
          >
            Login
          </a>
        </div>
      </motion.div>
    </div>
  );
}