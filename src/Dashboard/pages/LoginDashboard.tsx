"use client"
import { motion } from "framer-motion";
import { FaGoogle, FaApple } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { FaFacebook } from "react-icons/fa6";
import { PhoneNumberField } from "../Components/PhoneNumberField";
import { PasswordField } from "../components/PasswordField";
import { FormLayout } from "../components/FormLayout";
const schema = z.object({
  phoneNumber: z.string().min(10, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

interface FormData {
  phoneNumber: string;
  password: string;
}

export default function LoginDashboard() {
  const navigate = useNavigate();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const [loading, setLoading] = useState(false);

  const onSubmit = (data: FormData) => {
    setLoading(true);
    setTimeout(() => {
      console.log(data);
      setLoading(false);
      navigate('/');
    }, 1000);
  };

  return (
    <FormLayout showProgressBar={false} progressBars={3} onSubmit={handleSubmit(onSubmit)}>
      {/* Login Form */}
      <div className="grid grid-rows-2 gap-8 mb-8">
        <PhoneNumberField name="phoneNumber" control={control} />
        <PasswordField name="password" control={control} label="Password" placeholder="Enter your password" />
      </div>

      {/* Forgot Password Link */}
      <div className="text-right mb-8">
        <Link to="/dashboard/RestartPassword" className="text-gold-1 hover:text-gold-2 text-sm transition-colors duration-300">
          Forgot password?
        </Link>
      </div>
    
     <Link to="/dashboard" className="text-gold-1 hover:text-gold-2 text-sm transition-colors duration-300"> 
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#D7B634", paddingY: 1.5, borderRadius: 3, fontSize: 23, fontWeight: 600, marginBottom: 5, textTransform: "capitalize", color: "black", width: "100%", '&:hover': { backgroundColor: "#C4A52F" } }}>
          Login
        </Button>
     </Link>


    </FormLayout>
  );
}