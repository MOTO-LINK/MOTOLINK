import React, { useState } from 'react';
import { z } from 'zod'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { useForm, Controller, SubmitHandler } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import PhoneNumberInput from '../components/PhoneNumber';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import OutlinedInput from '@mui/material/OutlinedInput';
import IconButton from '@mui/material/IconButton';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from "@mui/material/NativeSelect";
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import QrCodeIcon from '@mui/icons-material/QrCode';

const schema = z.object({
  fullName: z.string().min(3, "Full Name must be at least 3 characters"),
  phoneNumber: z.string().min(10, "Phone Number must be at least 10 digits"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  gender: z.enum(["female", "male"]),
  nationalId: z.string().min(10, "National ID must be at least 10 digits"),
  machineNumber: z.string().min(1, "Machine Number is required"),
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1930).max(2025),
});

type FormData = z.infer<typeof schema>;

const SignDriver1: React.FC = () => {
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema), 
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const handleMouseUpPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const days = Array.from({ length: 31 }, (_, index) => index + 1);
  const months = Array.from({ length: 12 }, (_, index) => index + 1);
  const years = Array.from({ length: 2025 - 1930 + 1 }, (_, index) => 1930 + index);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    console.log("Form Data:", data); 
  };

  return (
    <div className="">
      <div className="w-[29rem] bg-bg m-auto mt-20 mb-20 rounded-xl border border-gold-1 text-white py-3 px-7 shadow-md shadow-gold-1 hover:scale-105 duration-500 ">
        <div className="grid grid-cols-3 items-center mt-5 mb-10">
          <svg width="15" height="26" viewBox="0 0 15 26" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12.5 25.5L0 13L12.5 0.5L14.7188 2.71875L4.4375 13L14.7188 23.2812L12.5 25.5Z" fill="#DFDFDF" />
          </svg>
          <p className='text-center text-2xl '>Sign up</p>
        </div>
        <div className="grid grid-rows-2 gap-2 mb-3">
          <h1 className='text-3xl font-[isemibold]'>Welcome to <span className='text-gold-1'>Motolink</span></h1>
          <h1 className='text-beige-3 text-lg'>Choose your role : Driver or Rider</h1>
        </div>
        <div className="w-[98%] mt-5 mb-8 grid grid-cols-3 items-center justify-center ">
          <p className='w-[128px] h-2 bg-gold-1 rounded-full'></p>
          <p className='w-[128px] h-2 bg-gold-1 rounded-full'></p>
          <p className='w-[128px] h-2 bg-beige-3 rounded-full'></p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)}> 
          <div className="grid grid-rows-3 gap-8 mb-7">
            <Controller
              name="fullName"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Full Name"
                  placeholder="Enter your Full Name"
                  error={!!errors.fullName}
                  helperText={errors.fullName?.message}
                  focused
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#BEB58F50",
                        borderRadius: 4
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontFamily: "ilight"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                    fontFamily: "ithin"
                  }}
                />
              )}
            />
             <Controller
              name="phoneNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneNumberInput
                  {...field} 
                  error={!!errors.phoneNumber}
                  helperText={errors.phoneNumber?.message}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <FormControl
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#BEB58F50",
                        borderRadius: 4,
                      },
                      "& .MuiInputBase-input": {
                        color: "white",
                        fontFamily: "ilight",
                      },
                      "& .MuiInputLabel-root": {
                        color: "white !important",
                      },
                      "& .MuiInputLabel-root.Mui-focused": {
                        color: "white !important",
                      },
                      "& fieldset": {
                        borderColor: "#BEB58F50",
                        borderRadius: 4,
                      },
                      "&:hover fieldset": {
                        borderColor: "#BEB58F50",
                      },
                    },
                  }}
                  focused
                  variant="outlined"
                >
                  <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                  <OutlinedInput
                    {...field}
                    placeholder="Enter your Password"
                    id="outlined-adornment-password"
                    type={showPassword ? 'text' : 'password'}
                    error={!!errors.password}
                    endAdornment={
                      <InputAdornment position="end">
                        <IconButton
                          aria-label={
                            showPassword ? 'hide the password' : 'display the password'
                          }
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          onMouseUp={handleMouseUpPassword}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    }
                    label="Password"
                  />
                  {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                  )}
                </FormControl>
              )}
            />
          </div>
          <div className="">
            <Controller
              name="gender"
              control={control}
              defaultValue="female" 
              render={({ field }) => (
                <RadioGroup
                  {...field}
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                >
                  <FormControlLabel
                    value="female"
                    control={
                      <Radio
                        sx={{
                          color: "#A7A7A7",
                          "&.Mui-checked": {
                            color: "#CEB13F",
                          },
                        }}
                      />
                    }
                    label="Female"
                  />
                  <FormControlLabel
                    value="male"
                    control={
                      <Radio
                        sx={{
                          color: "#A7A7A7",
                          "&.Mui-checked": {
                            color: "#CEB13F",
                          },
                        }}
                      />
                    }
                    label="Male"
                  />
                </RadioGroup>
              )}
            />
          </div>
          <div className="mt-4 mb-8 grid grid-rows-2 ">
            <h1 className='text-3xl font-[ibold]'>Enter registration data</h1>
            <p className='text-base text-beige-3'>You must meet the terms and conditions and any dispute will expose you to accountability.</p>
          </div>
          <div className="grid grid-rows-2 gap-8 mb-12">
            <Controller
              name="nationalId"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="National ID"
                  placeholder="Enter your National ID"
                  error={!!errors.nationalId}
                  helperText={errors.nationalId?.message}
                  focused
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#BEB58F50",
                        borderRadius: 4
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontFamily: "ilight"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                    fontFamily: "ithin"
                  }}
                />
              )}
            />
            <Controller
              name="machineNumber"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Machine number"
                  placeholder="Enter your Machine number"
                  error={!!errors.machineNumber}
                  helperText={errors.machineNumber?.message}
                  focused
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      "&.Mui-focused fieldset": {
                        borderColor: "#BEB58F50",
                        borderRadius: 4
                      },
                    },
                    "& .MuiInputBase-input": {
                      color: "white",
                      fontFamily: "ilight"
                    },
                    "& .MuiInputLabel-root.Mui-focused": {
                      color: "white",
                    },
                    fontFamily: "ithin"
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <QrCodeIcon style={{ color: 'white', cursor: 'pointer', marginRight: 10 }} />
                      </InputAdornment>
                    ),
                  }}
                />
              )}
            />
          </div>
          <div className="mt-5 mb-9 grid grid-cols-3 gap-8">
            <Controller
              name="day"
              control={control}
              defaultValue={1}
              render={({ field }) => (
                <FormControl fullWidth sx={{ width: "100px" }}>
                  <InputLabel variant="standard" htmlFor="days-select" sx={{ color: "white", fontSize: 20, }}>
                    Day
                  </InputLabel>
                  <NativeSelect
                    {...field}
                    sx={{
                      "& .MuiNativeSelect-select": {
                        color: "white",
                        marginTop: 2
                      },
                      "& .MuiNativeSelect-icon": {
                        color: "white",
                      },
                    }}
                    inputProps={{
                      name: "Day",
                      id: "days-select",
                    }}
                  >
                    {days.map((day) => (
                      <option key={day} value={day} style={{ color: "white", backgroundColor: "black" }}>
                        {day}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              )}
            />
            <Controller
              name="month"
              control={control}
              defaultValue={5}
              render={({ field }) => (
                <FormControl fullWidth sx={{ width: "100px" }}>
                  <InputLabel
                    variant="standard"
                    htmlFor="months-select"
                    sx={{ color: "white", fontSize: 20, }}
                  >
                    Month
                  </InputLabel>
                  <NativeSelect
                    {...field}
                    sx={{
                      "& .MuiNativeSelect-select": {
                        color: "white",
                        marginTop: 2,
                      },
                      "& .MuiNativeSelect-icon": {
                        color: "white",
                      },
                    }}
                    inputProps={{
                      name: "Month",
                      id: "months-select",
                    }}
                  >
                    {months.map((month) => (
                      <option key={month} value={month} style={{ color: "white", backgroundColor: "black" }}>
                        {month}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              )}
            />
            <Controller
              name="year"
              control={control}
              defaultValue={2023}
              render={({ field }) => (
                <FormControl fullWidth sx={{ width: "100px" }}>
                  <InputLabel
                    variant="standard"
                    htmlFor="years-select"
                    sx={{ color: "white", fontSize: 20, }}
                  >
                    Year
                  </InputLabel>
                  <NativeSelect
                    {...field}
                    sx={{
                      "& .MuiNativeSelect-select": {
                        color: "white",
                        marginTop: 2,
                      },
                      "& .MuiNativeSelect-icon": {
                        color: "white",
                      },
                    }}
                    inputProps={{
                      name: "Year",
                      id: "years-select",
                    }}
                  >
                    {years.map((year) => (
                      <option key={year} value={year} style={{ color: "white", backgroundColor: "black" }}>
                        {year}
                      </option>
                    ))}
                  </NativeSelect>
                </FormControl>
              )}
            />
          </div>
          <Button type="submit" variant="contained" sx={{ backgroundColor: "#D7B634", paddingX: 18, paddingY: .2, borderRadius: 3, fontSize: 23, fontWeight: 600, marginBottom: 5, textTransform: "capitalize", color: "black" }}>Continue</Button>
        </form>
        <p className='text-lg mb-8 text-center text-white'>Already have an account? <Link to={"/"} className='text-[#D7B634]'>login</Link> </p>
      </div>
    </div>
  );
};

export default SignDriver1;