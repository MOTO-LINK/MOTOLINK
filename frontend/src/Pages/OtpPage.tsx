"use client"
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";

export default function OtpPage() {
  const { register, handleSubmit } = useForm();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);

  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      // Move to next input if not the last one and value is entered
      if (value && index >= 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const onSubmit = () => {
    console.log("OTP Entered:", otp.join(""));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4 ">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 rounded-2xl shadow-sm text-white border-2 border-[#CEB13F] shadow-[#C0A94D] bg-[#00000023]"
      >
        <button className="text-white text-xl mb-4">
          <FaArrowLeft />
        </button>
        <h2 className="text-xl font-semibold text-center">Sign up</h2>
        <p className="text-gray-400 text-center">
          Welcome to <span className="text-yellow-500">Motolink</span>
        </p>

        <div className="w-full bg-gray-700 h-1 my-4">
          <div className="bg-yellow-500 h-full w-2/3"></div>
        </div>

        <p className="text-center text-gray-400 my-4">
          Send the code that was sent to the number{" "}
          <span className="text-yellow-500">015**68</span>
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 "
        >
          {/* Aligning Inputs Left to Right */}
          <div className="flex justify-center space-x-4">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                type="text"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold border border-yellow-500 bg-gray-800 rounded-md focus:outline-none"
              />
            ))}
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md"
          >
            Continue
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}