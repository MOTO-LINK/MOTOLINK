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
import { PasswordField } from "../Components/PasswordField";
import { FormLayout } from "../Components/FormLayout";
import axiosInstance from "@/api/axiosInstance";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" as "error" | "success" });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", {
        phone: data.phoneNumber,
        password: data.password,
      });
      setLoading(false);
      setSnackbar({ open: true, message: "Login successful!", severity: "success" });
      navigate("/dashboard");
    } catch (error: any) {
      setLoading(false);
      setSnackbar({ open: true, message: error.response?.data?.message || "Login failed", severity: "error" });
    }
  };

  return (
    <FormLayout showProgressBar={false} progressBars={3} onSubmit={handleSubmit(onSubmit)}>
      <div className="grid grid-rows-2 gap-8 mb-2">
        <div>
          <PhoneNumberField name="phoneNumber" control={control} />
        </div>
        <div>
          <PasswordField name="password" control={control} label="Password" placeholder="Enter your password" />
        </div>
      </div>

      <div className="text-right mb-8">
        <Link to="/dashboard/RestartPassword" className="text-gold-1 hover:text-gold-2 text-sm transition-colors duration-300">
          Forgot password?
        </Link>
      </div>
    
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#D7B634",
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
        {loading ? "Logging in..." : "Login"}
      </Button>

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
    </FormLayout>
  );
}