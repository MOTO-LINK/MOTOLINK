import React from "react";
import { motion } from "framer-motion";
import { Button, TextField } from "@mui/material";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";

// Validation Schema
const messageSchema = z.object({
  message: z.string().min(1, "Message is required"),
});

type MessageData = z.infer<typeof messageSchema>;
const SupportMessage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<MessageData>({
    resolver: zodResolver(messageSchema),
  });

  const onSubmit = (data: MessageData) => {
    console.log("Message Sent:", data);
  };
  const colors=tailwindConfig.theme.extend.colors;
  return (
    <>
    <div className="flex flex-col items-center min-h-screen mt-16  p-6 text-textWhite">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-3xl text-white rounded-2xl shadow-xl shadow-gold-1 border-2 border-gold-1 px-10 py-10 mb-16 mt-160"
      >
        <h1 className="text-center text-3xl font-bold mb-10">Support</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="w-full">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="w-full mb-10 "
          >
            <TextField
              {...register("message")}
              multiline
              rows={4}
              variant="outlined"
              placeholder="Write your message*"
              fullWidth
              InputProps={{
                style: {
                  color: colors.textWhite,
                  borderColor: colors.yello,
                  borderRadius:"20px",
                },
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#FBC91A" },
                  "&:hover fieldset": { borderColor: "#F8A777" },
                  "&.Mui-focused fieldset": { borderColor: "#F8A777" },
                },
              }}
              className="bg-transparent border-yellow-500 text-white"
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                background: "linear-gradient(to right, #FBC91A, #F8A777)",
                fontWeight: 600,
                color: "black",
                padding: "10px 20px",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                textTransform: "capitalize",
                fontSize: 18,
                "&:hover": {
                  opacity: 0.9,
                },
              }}
            >
              Send
            </Button>
          </motion.div>
        </form>
      </motion.div>
    </div>
    </>
  );
};

export default SupportMessage;
