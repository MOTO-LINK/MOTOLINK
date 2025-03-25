import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TextField, IconButton, Button, Box, Typography, Avatar } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { CiClock1 } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import SettingsIcon from '@mui/icons-material/Settings';
import tailwindConfig from "../../tailwind.config";
import GradeIcon from '@mui/icons-material/Grade';

const colors = tailwindConfig.theme.extend.colors;

const schema = z.object({
  from: z.string().min(1, "From is required"),
  to: z.string().min(1, "To is required"),
  travelTime: z.string().min(1, "Travel time is required"),
  fromHere: z.string().min(1, "From here time is required"),
});

type FormData = z.infer<typeof schema>;

interface Driver {
  id: number;
  name: string;
  rating: number;
  trips: number;
  location: string;
  image: string;
}

const DriverInfo: React.FC<{ name: string; joinDate: string; price: string; distance: string; imageUrl: string }> = ({ name, joinDate, price, distance, imageUrl }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ type: "spring", stiffness: 120, damping: 10 }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.95 }}
    className="bg-[#2d2d2d8b] text-white p-4 rounded-lg shadow-lg w-full border-2 border-gold-2 mt-5 mb-10"
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <img src={imageUrl} alt={name} className="w-14 h-14 rounded-full object-cover border-2 border-gold-2" />
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography sx={{ color: "#D7B634", fontSize: "1rem", fontWeight: "bold" }}>{name}</Typography>
          <Typography sx={{ color: "#D7B634", fontSize: "1rem" }}>{price}</Typography>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 2 }}>
          <Typography sx={{ color: "#D7B634", fontSize: "0.9rem" }}>Join: {joinDate}</Typography>
          <Typography sx={{ color: "#D7B634", fontSize: "1rem" }}>{distance}</Typography>
        </Box>
      </Box>
    </Box>
  </motion.div>
);

const TravelInfo: React.FC<{ travelTime: string; fromHere: string; onDecline: () => void; onAccept: () => void }> = ({ travelTime, fromHere, onDecline, onAccept }) => {
  const { control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { travelTime, fromHere },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-white p-4 w-full"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", flexGrow: 1 }}>
          <Controller
            name="travelTime"
            control={control}
            render={({ field }) => (
              <Typography className="text-beige-3" sx={{ fontSize: "1rem", display: "flex", gap: 0.5, alignItems: "center" }}>
                <CiClock1 size={23} className="text-gold-1" />Travel Time: <p className="text-gold-1">{field.value}</p>
              </Typography>
            )}
          />
          <Controller
            name="fromHere"
            control={control}
            render={({ field }) => (
              <Typography className="text-beige-3" sx={{ fontSize: "0.9rem", display: "flex", gap: 0.5, alignItems: "center" }}>
                <IoLocationSharp size={20} className="text-gold-1" />From Here: <p className="text-gold-1">{field.value}</p>
              </Typography>
            )}
          />
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}>
          <Button
            variant="contained"
            onClick={onDecline}
            sx={{
              backgroundColor: "transparent",
              color: colors["gold-1"],
              border: `1px solid ${colors["gold-1"]}`,
              fontSize: "1rem",
              padding: "8px 40px",
              borderRadius: "8px",
              textTransform: "none",
              transition: "all .5s",
              "&:hover": { backgroundColor: colors.btn, color: colors.textWhite, border: `1px solid ${colors["gold-2"]}` },
            }}
          >
            Decline
          </Button>
          <Button
            variant="contained"
            onClick={onAccept}
            sx={{
              backgroundColor: colors["gold-1"],
              color: colors.textWhite,
              border: `1px solid ${colors["gold-1"]}`,
              fontSize: "1rem",
              padding: "8px 40px",
              borderRadius: "8px",
              textTransform: "none",
              transition: "all .5s",
              "&:hover": { backgroundColor: colors["gold-2"], color: colors.textWhite, border: `1px solid ${colors["gold-2"]}` },
            }}
          >
            Accept
          </Button>
        </Box>
      </Box>
    </motion.div>
  );
};

const DriverCard: React.FC<{ driver: Driver }> = ({ driver }) => (
  <motion.div
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className="bg-[#2d2d2d8b] text-white p-4 rounded-lg shadow-lg w-full border-2 border-gold-2 mt-5 mb-5"
  >
    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
      <img src={driver.image} alt={driver.name} className="w-16 h-16 rounded-full object-cover border-2 border-gold-2" />
      <Box sx={{ flexGrow: 1 }}>
        <Typography sx={{ color: colors.textWhite, fontSize: "1.2rem", fontWeight: "bold" }}>{driver.name}</Typography>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 1 }}>
          <GradeIcon sx={{ color: "#D7B634", fontSize: "1rem" }} />
          <Typography sx={{ color: colors.textWhite, fontSize: "1rem" }}>{driver.rating?.toFixed(1)} / {driver.trips} Trips</Typography>
        </Box>
      </Box>
      <div className="bg-text p-2 cursor-pointer rounded-full">
         <SettingsIcon sx={{ color: "#D7B634", fontSize: "2rem" }}/>
      </div>
    </Box>
  </motion.div>
);

const SideBarHomeDriver: React.FC = () => {
  const { control } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { from: "El Sheikh Zayed", to: "6 October", travelTime: "30 min", fromHere: "5 min" },
  });

  const [driver, setDriver] = useState<Driver | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDriver = async () => {
      try {
        const response = await fetch("http://localhost:3001/drivers/4");
        if (!response.ok) throw new Error("Failed to fetch driver data");
        const data: Driver = await response.json();
        setDriver(data);
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchDriver();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!driver) return <div>No driver available</div>;

  return (
    <div className="flex flex-col items-center p-4">
      <motion.div
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100 }}
        className="bg-[#2d2d2d8b] text-white p-6 rounded-lg xl:w-[27rem] shadow-lg w-full max-w-2xl border-2 border-gold-2"
      >
        <DriverInfo
          name="Mostafa Hussein"
          joinDate="13/11/2022"
          price="150 EGP"
          distance="3 km"
          imageUrl="https://s3-alpha-sig.figma.com/img/b14c/bf54/ff0fb897cc99991f0cf19763b43ca9e0?Expires=1743379200&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=iEDFUj4X~ncJyeL~d6UKqTpHsgUvrQTxYro4yCtOKyzRnPRpVfJFOB7s830QYilZEW-Aa9eqxiwXg2cWgQ3kz~BI6DQ4k9TlBqprpBXMtglJGv7tmRFkdSCYKGqVtf5E-MZL6JOs-JzwddEBhk3M6rV66lnUYuIGrqnN4ZtGz-JbUyUEYUBPITapacjN0C~Yb4Ab6h2KK9ui24W05orplIhXLDWaSKD9~-Ur1FSNLF827et1hs66VrC~et2pFEp4Z9yhdldhpGBDWICTS2XDr76WIgbR9JMCO26JgClHgLpTJPn0LzMk3kJlPAvkAoTkonq2bHF3A8CyzV1BfbRb6g__"
        />

        <Controller
          name="from"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              label="From"
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#D7B634", borderRadius: "8px" },
                  "&:hover fieldset": { borderColor: "#D7B634" },
                  "&.Mui-focused fieldset": { borderColor: "#D7B634" },
                  "&.Mui-error fieldset": { borderColor: "#D7B634" },
                },
                "& .MuiInputBase-input": { color: "white", padding: "12px 14px" },
                "& .MuiInputLabel-root": { color: "#D7B634" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#D7B634" },
              }}
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
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#D7B634", borderRadius: "8px" },
                  "&:hover fieldset": { borderColor: "#D7B634" },
                  "&.Mui-focused fieldset": { borderColor: "#D7B634" },
                  "&.Mui-error fieldset": { borderColor: "#D7B634" },
                },
                "& .MuiInputBase-input": { color: "white", padding: "12px 14px",},
                "& .MuiInputLabel-root": { color: "#D7B634" },
                "& .MuiInputLabel-root.Mui-focused": { color: "#D7B634" },
                marginTop:4,
                marginBottom:1
              }}
              InputProps={{
                startAdornment: (
                  <IconButton>
                    <svg style={{ color: "#D7B634", marginLeft: -15, marginRight: -20 }} width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.16667 19.1665V17.4998C7.43056 17.3054 5.94097 16.5866 4.69792 15.3436C3.45486 14.1005 2.73611 12.6109 2.54167 10.8748H0.875V9.20817H2.54167C2.73611 7.47206 3.45486 5.98248 4.69792 4.73942C5.94097 3.49637 7.43056 2.77762 9.16667 2.58317V0.916504H10.8333V2.58317C12.5694 2.77762 14.059 3.49637 15.3021 4.73942C16.5451 5.98248 17.2639 7.47206 17.4583 9.20817H19.125V10.8748H17.4583C17.2639 12.6109 16.5451 14.1005 15.3021 15.3436C14.059 16.5866 12.5694 17.3054 10.8333 17.4998V19.1665H9.16667ZM10 15.8748C11.6111 15.8748 12.9861 15.3054 14.125 14.1665C15.2639 13.0276 15.8333 11.6526 15.8333 10.0415C15.8333 8.43039 15.2639 7.05539 14.125 5.9165C12.9861 4.77762 11.6111 4.20817 10 4.20817C8.38889 4.20817 7.01389 4.77762 5.875 5.9165C4.73611 7.05539 4.16667 8.43039 4.16667 10.0415C4.16667 11.6526 4.73611 13.0276 5.875 14.1665C7.01389 15.3054 8.38889 15.8748 10 15.8748Z" fill="#FFCC03" />
                    </svg>
                  </IconButton>
                ),
              }}
            />
          )}
        />

        <TravelInfo
          travelTime="30 min"
          fromHere="5 min"
          onDecline={() => console.log("Decline clicked")}
          onAccept={() => console.log("Accept clicked")}
        />
      </motion.div>

      <DriverCard driver={driver} />
    </div>
  );
};

export default SideBarHomeDriver;