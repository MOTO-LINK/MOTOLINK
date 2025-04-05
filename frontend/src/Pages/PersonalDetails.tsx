import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button, TextField, Radio, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]),
});

export default function PersonalDetails() {
  const colors=tailwindConfig.theme.extend.colors;
    
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });
  
  const [gender, setGender] = useState("Male");
  const [openDialog, setOpenDialog] = useState(false);

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <>
    <ResponsiveAppBar/>
    <motion.div 
      className="flex justify-center items-start mt-20 min-h-screen  px-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="w-full max-w-2xl  p-10 rounded-3xl shadow-xl shadow-gold-1 border-2 border-gold-1"
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h2 
          className="text-textWhite text-3xl font-bold text-center mb-6"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Personal Details
        </motion.h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField 
            fullWidth 
            label="First Name" 
            variant="outlined" 
            {...register("firstName")} 
            error={!!errors.firstName} 
            helperText={errors.firstName?.message}
            InputLabelProps={{ style: { color: "#fff" } }}
            sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
                  "&:hover fieldset": { borderColor: colors["gold-1"] },
                  "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                },
                "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                input: { color: colors.textWhite,textIndent: "10px" },
                label: { color: colors.textgray,textIndent: "10px" },}}
          />
          <TextField 
            fullWidth 
            label="Last Name" 
            variant="outlined" 
            {...register("lastName")} 
            error={!!errors.lastName} 
            helperText={errors.lastName?.message}
            InputLabelProps={{ style: { color: "#fff" } }}
            sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
                  "&:hover fieldset": { borderColor: colors["gold-1"] },
                  "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                },
                "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                input: { color: colors.textWhite,textIndent: "10px" },
                label: { color: colors.textgray,textIndent: "10px" },}}
          />
          <TextField 
            fullWidth 
            label="Date of Birth" 
            type="date"
            variant="outlined" 
            value={new Date().toISOString().split("T")[0]}
            {...register("dateOfBirth")} 
            error={!!errors.dateOfBirth} 
            helperText={errors.dateOfBirth?.message}
            InputLabelProps={{ shrink: true, style: { color: "#fff" } }}
            sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "580px",
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "580px",},
                  "&:hover fieldset": { borderColor: colors["gold-1"] },
                  "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                },
                "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                input: { color: colors.textWhite,textIndent: "10px" },
                label: { color: colors.textgray,textIndent: "10px" },}}
          />
          <motion.div 
            className="flex gap-6 text-textWhite justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}>
            <FormControlLabel 
              control={<Radio sx={{ '&.Mui-checked': { color: colors["gold-1"] } }} checked={gender === "Male"} {...register("gender")} value="Male" onChange={() => setGender("Male")} />} 
              label="Male" 
              sx={{backgroundColor:colors["radio"],display:"flex",alignItems:"center",borderRadius:"4px",pr:2,justifyContent:"center"}}
            />
            <FormControlLabel 
              control={<Radio sx={{ '&.Mui-checked': { color: colors["gold-1"]  } }} checked={gender === "Female"} {...register("gender")} value="Female" onChange={() => setGender("Female")} />} 
              label="Female"
              sx={{backgroundColor:colors["radio"],display:"flex",alignItems:"center",borderRadius:"4px",pr:2,justifyContent:"center"}}
            />
          </motion.div>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              type="button" 
              fullWidth 
              variant="contained" 
              sx={{ backgroundColor: colors["btn"], "&:hover": { backgroundColor: colors["gold-1"] } }}
              onClick={() => setOpenDialog(true)}
            >
              Delete Account
            </Button>
          </motion.div>
        </form>
      </motion.div>
      
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{ backdropFilter: "blur(4px)",}}>
        <DialogTitle sx={{fontWeight:700,backgroundColor:colors["btn"]}}>Confirm Deletion</DialogTitle>
        <DialogContent sx={{fontWeight:700,backgroundColor:colors["btn"]}}>
          <DialogContentText sx={{color:colors.textWhite}}>
            Are you sure you want to delete your account? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{fontWeight:700,backgroundColor:colors["btn"]}}>
          <Button onClick={() => setOpenDialog(false)} sx={{fontWeight:500,backgroundColor:colors["textgray"],color:colors.textWhite,px:2,py:1}} >Cancel</Button>
          <Button onClick={() => console.log("Account deleted")} sx={{fontWeight:500,backgroundColor:colors["red"],color:colors.textWhite,px:2,py:1}}>Delete</Button>
        </DialogActions>
      </Dialog>
    </motion.div>
    </>
  );
}
