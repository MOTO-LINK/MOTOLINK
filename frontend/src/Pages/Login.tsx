"use client"
import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const schema = z.object({
  phone: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface FormData {
  phone: string;
  password: string;
}

export default function Home() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [countryCode, setCountryCode] = useState("+20");

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black px-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 rounded-2xl shadow-lg text-white  border-2 border-[#CEB13F] shadow-[#C0A94D] bg-[#00000023]"
      >
        <div className="text-center mb-6">
          <motion.img
            src="https://s3-alpha-sig.figma.com/img/5cb4/5a42/a67a801b5f201a014d1091885c9d079b?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=kLOLy4CNHRbredUlAORsPvaIxJy~I1z7vkG87i2hkt2-nSVmILs80NYj4u6n4id5SvUrmTlnwceilQwofrit9xYEELq~GeeQZDM6mB-CNHEQETfWP5XUKbjqBENJVeDnJDfaW7fwuYg2k8s3QeDOQG1HFQYJZSjq6g3Qzcl2y45wGvwCbjQ3YrcX12Iq1slWThxl~YoLJLSejD6dO1OhRf15J1mywTYFNk6Ks21W0W4kWMzFEW2uLWcLW6PymvkkP641rm5Tp6~oZpBzdefu-DpyXz7rkseAtng-nyQNgaFjbtRdQpAnBkQAVeVwJowo8iYigt19sdGZISj4IhEJAQ__"
            alt="Motolink"
            className="mx-auto w-24"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          />
          <h2 className="text-xl font-semibold mt-4">Login</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="text-gray-400 text-sm">Phone Number</label>
            <div className="flex bg-gray-800 rounded-md p-2">
              <input
                type="text"
                placeholder="Phone Number"
                {...register("phone")}
                className="w-full bg-gray-800 border-none text-white px-2 focus:outline-none"
              />
              <select
                value={countryCode}
                onChange={(e) => setCountryCode(e.target.value)}
                className="bg-gray-700 text-white px-2 rounded-l-md focus:outline-none"
              >
                <option value="+20">+20</option>
                <option value="+1">+1</option>
                <option value="+44">+44</option>
              </select>
            </div>
            {errors.phone && (
              <p className="text-red-500 text-sm">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="text-gray-400 text-sm">Password</label>
            <div className="relative bg-gray-800 rounded-md p-2">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                className="w-full bg-gray-800 border-none text-white px-2 pr-10 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && (
              <p className="text-red-500 text-sm">{errors.password.message}</p>
            )}
          </div>

          <div className="text-right text-yellow-500 text-sm cursor-pointer hover:underline">
            Forgot password?
          </div>

          <motion.button
            whileTap={{ scale: 0.9 }}
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold py-2 rounded-md"
          >
            {loading ? "Loading..." : "Next"}
          </motion.button>
        </form>

        <div className="text-center text-gray-400 my-4">or</div>

        <div className="flex justify-center space-x-6">
          <motion.div whileHover={{ scale: 1.1 }}>
            <FaGoogle className="text-white text-2xl cursor-pointer" />
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }}>
            <FaApple className="text-white text-2xl cursor-pointer" />
          </motion.div>
        </div>

        <div className="text-center text-gray-400 mt-4">
          Don't have an account?{" "}
          <span className="text-yellow-500 cursor-pointer hover:underline">
            Sign in
          </span>
        </div>
      </motion.div>
    </div>
  );
}