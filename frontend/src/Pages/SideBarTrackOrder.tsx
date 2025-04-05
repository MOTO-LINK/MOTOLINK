import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TextField, IconButton, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { Link } from "react-router-dom";
import { TuktukDriverCard } from "../components/FetchDriverCard";
import { PaymentCard } from "../components/PaymentCard";
import tailwindConfig from "../../tailwind.config";

const schema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  driverName: z.string().min(1, "Driver name is required"),
});

type FormData = z.infer<typeof schema>;

const colors=tailwindConfig.theme.extend.colors;

const textFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "& fieldset": { borderColor: colors["gold-1"], borderRadius: "8px" },
    "&:hover fieldset": { borderColor: colors["gold-1"] },
    "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
  },
  "& .MuiInputBase-input": { color: colors.textWhite, padding: "12px 14px" },
  "& .MuiInputLabel-root": { color: colors["gold-1"] },
  "& .MuiInputLabel-root.Mui-focused": { color: colors["gold-1"] },
};

const SideBarTrackOrder: React.FC = () => {
  const { control, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { from: "El Sheikh Zayed", to: "6 October", driverName: "Back to Home" },
  });

  return (
    <div className="flex justify-center p-4">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#2d2d2d8b] text-white p-6 rounded-lg border-2 border-gold-2 w-full max-w-md 2xl:w-[27rem]"
      >
        <TuktukDriverCard />

        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="From"
              sx={textFieldStyles}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <LocationOnIcon style={{ color: "#D7B634", marginLeft: -15, marginRight: -20 }} />
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <Controller
          name="to"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="To"
              sx={{ ...textFieldStyles, mt: 3, mb: 1 }}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <svg style={{ color: colors["gold-1"], marginLeft: -15, marginRight: -20 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.16667 19.1665V17.4998C7.43056 17.3054 5.94097 16.5866 4.69792 15.3436C3.45486 14.1005 2.73611 12.6109 2.54167 10.8748H0.875V9.20817H2.54167C2.73611 7.47206 3.45486 5.98248 4.69792 4.73942C5.94097 3.49637 7.43056 2.77762 9.16667 2.58317V0.916504H10.8333V2.58317C12.5694 2.77762 14.059 3.49637 15.3021 4.73942C16.5451 5.98248 17.2639 7.47206 17.4583 9.20817H19.125V10.8748H17.4583C17.2639 12.6109 16.5451 14.1005 15.3021 15.3436C14.059 16.5866 12.5694 17.3054 10.8333 17.4998V19.1665H9.16667ZM10 15.8748C11.6111 15.8748 12.9861 15.3054 14.125 14.1665C15.2639 13.0276 15.8333 11.6526 15.8333 10.0415C15.8333 8.43039 15.2639 7.05539 14.125 5.9165C12.9861 4.77762 11.6111 4.20817 10 4.20817C8.38889 4.20817 7.01389 4.77762 5.875 5.9165C4.73611 7.05539 4.16667 8.43039 4.16667 10.0415C4.16667 11.6526 4.73611 13.0276 5.875 14.1665C7.01389 15.3054 8.38889 15.8748 10 15.8748Z" fill="#FFCC03" />
                    </svg>
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <PaymentCard />

        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <form onSubmit={handleSubmit(console.log)}>
            <Controller
              name="driverName"
              control={control}
              render={({ field }) => (
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link to="/HomeRider">
                    <Button
                      type="submit"
                      variant="contained"
                      sx={{
                        backgroundColor: "#D7B634",
                        color: "#2d2d2d",
                        fontSize: "19px",
                        padding: "12px 24px",
                        borderRadius: "8px",
                        textTransform: "none",
                        width: "100%",
                        my: 3,
                        "&:hover": { backgroundColor: "#D7B6344" },
                      }}
                    >
                      {field.value}
                    </Button>
                  </Link>
                </motion.div>
              )}
            />
          </form>
        </motion.div>

        
      </motion.div>
    </div>
  );
};

export default SideBarTrackOrder;