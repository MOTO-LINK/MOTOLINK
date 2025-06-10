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
import { PasswordField } from "../Components/PasswordField";
import { FormLayout } from "../Components/FormLayout";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import axiosInstance from "@/api/axiosInstance";

const schema = z.object({
  newPassword: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string().min(6, "Confirm password is required"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

interface FormData {
  newPassword: string;
  confirmPassword: string;
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
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" as "error" | "success" });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await axiosInstance.post("/auth/reset-password", {
        password: data.newPassword,
      });
      setLoading(false);
      setSnackbar({ open: true, message: "Password changed successfully!", severity: "success" });
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error: any) {
      setLoading(false);
      setSnackbar({ open: true, message: error.response?.data?.message || "Failed to reset password", severity: "error" });
    }
  };

  return (
    <FormLayout showProgressBar={false} title="" progressBars={3} onSubmit={handleSubmit(onSubmit)}>
      <h1 className="text-center underline underline-offset-4 text-base text-gray-300">Enter New Password</h1>
      <div className="grid grid-rows-2 gap-8 mt-8">
        <div>
          <PasswordField<FormData> name="newPassword" control={control} label="New Password" placeholder="Enter new password" />
        </div>
        <div>
          <PasswordField<FormData> name="confirmPassword" control={control} label="Confirm Password" placeholder="Confirm new password" />

        </div>
      </div>
      <Button
        type="submit"
        variant="contained"
        sx={{
          backgroundColor: "#D7B634",
          paddingY: 1.5,
          borderRadius: 3,
          fontSize: 23,
          marginTop: 7,
          fontWeight: 600,
          marginBottom: 5,
          textTransform: "capitalize",
          color: "black",
          width: "100%",
          '&:hover': { backgroundColor: "#C4A52F" }
        }}
        disabled={loading}
      >
        {loading ? "Saving..." : "Okay"}
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