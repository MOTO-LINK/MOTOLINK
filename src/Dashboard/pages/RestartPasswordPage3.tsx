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

export default function RestartPasswordPage3() {
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
    <FormLayout showProgressBar={false} title=""  progressBars={3} onSubmit={handleSubmit(onSubmit)}>
        <h1 className="text-center underline underline-offset-4 text-base text-gray-300">Enter Pin to confirm</h1>

      
      {/* Login Form */}
      <div className="grid grid-rows-2 gap-8 mt-8">
          <PasswordField name="password" control={control} label="Password" placeholder="password" />    
          <PasswordField name="password" control={control} label="New Password" placeholder="Enter new password" />    
      </div>
      
      <Link to="/dashboard/LoginDashboard" className="text-gold-1 hover:text-gold-2 text-sm transition-colors duration-300 ">
        <Button type="submit" variant="contained" sx={{ backgroundColor: "#D7B634", paddingY: 1.5, borderRadius: 3, fontSize: 23,marginTop:7, fontWeight: 600, marginBottom: 5, textTransform: "capitalize", color: "black", width: "100%", '&:hover': { backgroundColor: "#C4A52F" } }}>
            Okay
        </Button>
      </Link>

    </FormLayout>
  );
}