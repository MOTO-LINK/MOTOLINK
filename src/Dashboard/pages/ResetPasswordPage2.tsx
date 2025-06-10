"use client"
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { FaArrowLeft } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import axiosInstance from "@/api/axiosInstance";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

export default function RestartPasswordPage2() {
  const { handleSubmit } = useForm();
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<Array<HTMLInputElement | null>>([]);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" as "error" | "success" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (index: number, value: string) => {
    if (!isNaN(Number(value)) && value.length <= 1) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

      if (value && index < otp.length - 1) {
        inputRefs.current[index + 1]?.focus();
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

  const onSubmit = async () => {
    setError("");
    if (otp.some((digit) => digit === "")) {
      setError("Please enter the full 6-digit code.");
      return;
    }
    setLoading(true);
    try {
      const code = otp.join("");
      await axiosInstance.post("/auth/reset-password", { code });
      setLoading(false);
      setSnackbar({ open: true, message: "Code verified successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/dashboard/RestartPasswordPage3");
      }, 1000);
    } catch (err: any) {
      setLoading(false);
      setSnackbar({ open: true, message: err.response?.data?.message || "Invalid code", severity: "error" });
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen px-4 ">
      <motion.div initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[38rem] bg-bg m-auto mt-5 mb-20 rounded-xl border border-gold-1 text-white pt-14 pb-2 px-7 shadow-md shadow-gold-1 hover:scale-105 duration-500"      >
        <h2 className="text-3xl text-center mb-5">Reset Password</h2>
        <h1 className="text-center underline underline-offset-4 text-base text-gray-300">Enter Pin to confirm</h1>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col items-center space-y-6 mt-10 mb-5"
        >
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
          {error && <span className="text-red-500 text-xs">{error}</span>}
          <div className="flex items-center justify-center mt-4">
            <p className="text-sm text-gray-400">Didn't receive the code?</p>
            <Link to="/dashboard/RestartPassword" className="text-gold-1 hover:text-gold-2 text-sm transition-colors duration-300 ml-2">
              Resend
            </Link>
          </div>
          <Button
            type="submit"
            variant="contained"
            sx={{
              backgroundColor: "#D7B634",
              paddingX: 18,
              paddingY: 1.5,
              borderRadius: 3,
              fontSize: 23,
              fontWeight: 600,
              marginBottom: 5,
              textTransform: "capitalize",
              color: "black",
              width: "100%",
              '&:hover': { backgroundColor: "#C4A52F" }
            }}
            disabled={loading}
          >
            {loading ? "Verifying..." : "Okay"}
          </Button>
        </form>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <MuiAlert elevation={6} variant="filled" severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
            {snackbar.message}
          </MuiAlert>
        </Snackbar>
      </motion.div>
    </div>
  );
}