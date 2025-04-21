import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Button, TextField, Radio, FormControlLabel, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Avatar, InputAdornment } from "@mui/material";
import "tailwindcss/tailwind.css";
import tailwindConfig from "../../tailwind.config";
import ResponsiveAppBar from "../components/Navbar";
import { FaCamera } from "react-icons/fa";
import { CameraAlt, Visibility, VisibilityOff } from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import { log } from "console";

const schema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.enum(["Male", "Female"]),
  name: z.string().min(1, "Name is required"),
  role: z.string().min(1, "Role is required"),
  avatar: z.string().url("Invalid avatar URL"),
  phoneNumber:z.string().min(1,"Phone number is required").max(10,"phone Number is must be less than 10 characters"),
  password:z.string().min(10,"Password is must be greater than 10 characters").max(30,"Password is must be less than 30 characters"),
  Position:z.string().min(10,"Position is required"),
});


export default function PersonalDetails() {
  const colors=tailwindConfig.theme.extend.colors;
    
  const {register,reset,handleSubmit,formState: { errors },} = useForm({ resolver: zodResolver(schema),defaultValues: {
      firstName: "Mohamed ",
      name: "Mohamed",
      lastName:"Ahmed",
      role: "Rider",
      avatar: "https://randomuser.me/api/portraits/men/10.jpg",
      phoneNumber:"1002480268",
      password:"1245asd85f",
      Position:"Egypt Elsharqea"
    }
   });
  
  const [gender, setGender] = useState("Male");
  const [openDialog, setOpenDialog] = useState(false);
  const [user, setUser] = useState({ firstName: "Mohamed",name:"mohamed",lastName:"Ahmed",password:"1245asd85f", phoneNumber:"1002480268", role: "Rider",Position:"Egypt Elsharqea", avatar: "https://randomuser.me/api/portraits/men/10.jpg",});
  const [showPassword, setShowPassword] = useState(false);
  const [isedit,setisedit]=useState(false);

  const handleEdit=()=>{
    if (isedit) {
      handleSubmit((data) => {
        console.log(data);
        setisedit(false);
      })();
    } else {
      setisedit(true);
    }
  }

  const handleClickShowPassword=()=>{
    setShowPassword(!showPassword);
  }

  const onSubmit = (data: any) => {
    console.log(data);
  };
 
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event: ProgressEvent<FileReader>) => {
        setUser(prev => ({
          ...prev,
          avatar: event.target!.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  };
 
  const Navigate=useNavigate();
  const SignOut=()=>{
    setOpenDialog(false);
    Navigate("/");
  }

  return (
    <>
    <ResponsiveAppBar/>
    <motion.div className="flex justify-center items-start mt-20 mb-32 min-h-screen  px-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <motion.div className="w-full max-w-7xl  p-10 rounded-3xl shadow-xl shadow-gold-1 border-2 border-gold-1" initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.6 }}>
        <motion.h2  className="text-textWhite text-3xl font-bold text-center mb-6" initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}>
           Personal Details
        </motion.h2>
        {/*image of Profile  */}
        <div className="flex items-center justify-between">
          <div className=" relative flex items-end justify-start  mb-10">
              <Avatar  src={user.avatar}  sx={{ width: 125,height: 125, border: `4px solid ${colors.btn}` }} />
              <IconButton component="label" sx={{position:"absolute",left:0,display:"flex",backgroundColor: colors.btn,'&:hover': { backgroundColor: colors.btn }}}>
                  <CameraAlt sx={{ color: colors.textWhite }} />
                  <input  type="file" hidden  accept="image/*" onChange={handleImageUpload} />
              </IconButton>
          </div>
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="">
                <Button type="button" variant="contained" onClick={handleEdit}  sx={{ backgroundColor: colors.bluee,px:4,py:1,fontSize:16,textTransform:"capitalize", "&:hover": { backgroundColor: colors.bluelight }}}>
                    {isedit?"save":"edit"}
                </Button>
                {isedit && (
                  <Button sx={{ backgroundColor: colors.red,color:colors.textWhite,ml:2,px:4,py:1,fontSize:16,textTransform:"capitalize", "&:hover": { backgroundColor: colors.redlight }}} onClick={() => {reset(); setisedit(false);}}>
                    Cancel
                  </Button>
                )}
          </motion.div> 
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/*Name*/}
              <div className=" flex gap-3">
                  {/* first Name */}
                  <TextField fullWidth label="First Name" variant="outlined" {...register("firstName")} disabled={!isedit} error={!!errors.firstName} 
                    helperText={errors.firstName?.message} InputLabelProps={{ style: { color: "#fff" } }}
                    sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px",
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",},
                          "&:hover fieldset": { borderColor: colors["gold-1"] },
                          "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                        },
                        "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                        '.Mui-disabled.Mui-disabled': { color:"white !important" },
                        input: { color: colors.textWhite,textIndent: "10px" },
                        label: { color: colors.textgray},
                      }}
                  />
                  {/* last Name */}
                  <TextField fullWidth label="Last Name" variant="outlined"  {...register("lastName")} disabled={!isedit} error={!!errors.lastName} 
                      helperText={errors.lastName?.message} InputLabelProps={{ style: { color: "#fff" } }}
                      sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", 
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px"},
                            "&:hover fieldset": { borderColor: colors["gold-1"] },
                            "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                          },
                          "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                          input: { color: colors.textWhite,textIndent: "10px" },
                          label: { color: colors.textgray},}}
                  />
              </div>

              <div className="flex gap-3">
                  {/* phone Number */}
                  <TextField fullWidth label="Phone Number" variant="outlined"  {...register("phoneNumber")} disabled={!isedit} error={!!errors.phoneNumber} 
                    helperText={errors.phoneNumber?.message} InputLabelProps={{ style: { color: "#fff" } }}
                    sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", 
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",},
                          "&:hover fieldset": { borderColor: colors["gold-1"] },
                          "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                        },
                        "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                        input: { color: colors.textWhite,textIndent: "10px" },
                        label: { color: colors.textgray},}}
                  />

                  {/* password */}
                  <TextField fullWidth type={showPassword ? "text" : "password"}  label="password" variant="outlined"  {...register("password")} disabled={!isedit} error={!!errors.password} 
                    helperText={errors.password?.message} InputLabelProps={{ style: { color: "#fff" } }}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPassword}
                            edge="end"
                            sx={{ color: colors.textWhite,mr:1 }}
                          >
                            {showPassword ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      style: { color: colors.textWhite }
                    }}
                    sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", 
                        "& .MuiOutlinedInput-root": {
                          "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",},
                          "&:hover fieldset": { borderColor: colors["gold-1"] },
                          "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                        },
                        "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                        input: { color: colors.textWhite,textIndent: "10px" },
                        label: { color: colors.textgray},}}
                  />
              </div>
           
              {/* position */}
              <TextField fullWidth label="Position" variant="outlined"  {...register("Position")} disabled={!isedit} error={!!errors.Position} 
                  helperText={errors.Position?.message} InputLabelProps={{ style: { color: "#fff" } }}
                  sx={{ backgroundColor:colors.bg,color:colors.textWhite, borderRadius: "20px", width: "590px",
                      "& .MuiOutlinedInput-root": {
                        "& fieldset": { borderColor: colors["gold-1"],borderRadius: "40px",width: "590px",},
                        "&:hover fieldset": { borderColor: colors["gold-1"] },
                        "&.Mui-focused fieldset": { borderColor: colors["gold-1"] },
                      },
                      "& .MuiInputBase-input::placeholder": { color: colors.textWhite },
                      input: { color: colors.textWhite,textIndent: "10px" },
                      label: { color: colors.textgray},}}
                />
              {/*gender  */}
              <motion.div 
                className="flex gap-6 text-textWhite justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}>
                <FormControlLabel 
                  control={<Radio sx={{ '&.Mui-checked': { color: colors["gold-1"] } }} checked={gender === "Male"} {...register("gender")} disabled={!isedit}  onChange={() => setGender("Male")} />} 
                  label="Male" 
                  sx={{backgroundColor:colors["radio"],display:"flex",alignItems:"center",borderRadius:"4px",pr:2,justifyContent:"center"}}
                />
                <FormControlLabel 
                  control={<Radio sx={{ '&.Mui-checked': { color: colors["gold-1"]  } }} checked={gender === "Female"} {...register("gender")} disabled={!isedit}  onChange={() => setGender("Female")} />} 
                  label="Female"
                  sx={{backgroundColor:colors["radio"],display:"flex",alignItems:"center",borderRadius:"4px",pr:2,justifyContent:"center"}}
                />
              </motion.div>
              
              {/* Sign Out */}
              <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }} className="flex justify-center mt-10">
                <Button type="button" variant="contained"  sx={{ backgroundColor: colors.red,px:4,py:1,fontSize:16,textTransform:"capitalize", "&:hover": { backgroundColor: colors.redlight }}}  onClick={() => setOpenDialog(true)}>
                    Sign Out 
                </Button>
              </motion.div>
        </form>
      </motion.div>
          <Dialog open={openDialog} onClose={() => setOpenDialog(false)} sx={{ backdropFilter: "blur(4px)",}}>
            <DialogTitle sx={{fontWeight:700,backgroundColor:colors["btn"]}}>Confirm Deletion</DialogTitle>
            <DialogContent sx={{fontWeight:700,backgroundColor:colors["btn"]}}>
              <DialogContentText sx={{color:colors.textWhite}}>
                Are you sure you want to go out of the WebSite
              </DialogContentText>
            </DialogContent>
            <DialogActions sx={{fontWeight:700,backgroundColor:colors["btn"]}}>
              <Button onClick={() => setOpenDialog(false)} sx={{fontWeight:500,backgroundColor:colors["textgray"],color:colors.textWhite,px:2,py:1}} >Cancel</Button>
              <Button onClick={SignOut} sx={{fontWeight:500,backgroundColor:colors["red"],color:colors.textWhite,px:2,py:1}}>Sign Out</Button>
            </DialogActions>
          </Dialog>
    </motion.div>
    </>
  );
}
