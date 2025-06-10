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
import { FormLayout } from "../Components/FormLayout";
import axiosInstance from "@/api/axiosInstance";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";

const schema = z.object({
  phoneNumber: z.string().min(10, "Phone number is required"),
});

interface FormData {
  phoneNumber: string;
}

export default function RestartPassword() {
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
      await axiosInstance.post("/auth/forgot-password", {
        phone: data.phoneNumber,
      });
      setLoading(false);
      setSnackbar({ open: true, message: "Code sent successfully!", severity: "success" });
      setTimeout(() => {
        navigate("/dashboard/RestartPasswordPage2");
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to send code", severity: "error" });
    }
  };

  return (
    <FormLayout showProgressBar={false} progressBars={3} onSubmit={handleSubmit(onSubmit)}>
      
      <h1 className="text-center underline underline-offset-4 text-base text-gray-300">Enter the Phone Number</h1>
      
      <div className="grid grid-rows-2 gap-8 mt-8">
        <PhoneNumberField name="phoneNumber" control={control} />
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
        {loading ? "Sending..." : "Okay"}
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