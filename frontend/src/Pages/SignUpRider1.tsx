import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import {
  TextField, FormControl, InputLabel, InputAdornment,
  OutlinedInput, IconButton, Radio, RadioGroup,
  FormControlLabel, NativeSelect, Button
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import PhoneNumberInput from '../components/PhoneNumber';
import { Link } from 'react-router-dom';
import tailwindConfig from '../../tailwind.config';
import { m } from 'framer-motion';
import ResponsiveAppBar from '../components/Navbar';

const schema = z.object({
  fullName: z.string().min(3),
  phoneNumber: z.string().min(10),
  password: z.string().min(8),
  gender: z.enum(["female", "male"]),
  day: z.number().min(1).max(31),
  month: z.number().min(1).max(12),
  year: z.number().min(1930).max(2025),
});

type FormData = z.infer<typeof schema>;

const SignUpRider1: React.FC = () => {
  const colors=tailwindConfig.theme.extend.colors;
  const { control, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: FormData) => console.log('Form Data:', data);

  const sharedFieldStyle = {
    "& .MuiOutlinedInput-root": {
      "&.Mui-focused fieldset": { borderColor: colors.borderColorlight, borderRadius: 4, },
    },
    "& .MuiInputBase-input": { color: colors.textWhite, fontFamily: "ilight" },
    "& .MuiInputLabel-root.Mui-focused": { color: colors.textWhite },
    fontFamily: "ithin"
  };
 
  const range = (start: number, end: number) =>Array.from({ length: end - start + 1 }, (_, i) => i + start);
    
  

  return (
    <>
    <div className="px-4">
      <div className="w-full max-w-[38rem] bg-bg m-auto mt-20 mb-20 rounded-xl border border-gold-1 text-white py-3 px-7 shadow-md shadow-gold-1 hover:scale-105 duration-500">
        <div className="grid grid-cols-3 items-center mt-5 mb-10">
          <svg width="15" height="26" viewBox="0 0 15 26" fill="none"><path d="M12.5 25.5L0 13L12.5 0.5L14.7188 2.71875L4.4375 13L14.7188 23.2812L12.5 25.5Z" fill="#DFDFDF" /></svg>
          <p className='text-center text-2xl'>Sign up</p>
        </div>

        <div className="mb-6">
          <h1 className='text-3xl font-semibold'>Welcome to <span className='text-gold-1'>Motolink</span></h1>
          <p className='text-beige-3 text-lg'>Choose your role: Driver or Rider</p>
        </div>

        <div className="grid grid-cols-3 gap-1 mb-8">
          <div className='h-2 bg-gold-1 rounded-full'></div>
          <div className='h-2 bg-gold-1 rounded-full'></div>
          <div className='h-2 bg-beige-3 rounded-full'></div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
                sx={{...sharedFieldStyle, width: "100%", marginBottom: 2}}
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
                onChange={(value) => field.onChange(value)}
              />
            )}
          />

          <Controller
            name="password"
            control={control}
            defaultValue=""
            render={({ field }) => (
              <FormControl variant="outlined" focused sx={{...sharedFieldStyle, width: "100%", marginBottom: 2}}>
                <InputLabel>Password</InputLabel>
                <OutlinedInput
                  {...field}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your Password"
                  endAdornment={
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                        aria-label="toggle password visibility"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  }
                  label="Password"
                />
                {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
              </FormControl>
            )}
          />

          <Controller
            name="gender"
            control={control}
            defaultValue="female"
            render={({ field }) => (
              <RadioGroup {...field} row>
                {["female", "male"].map((g) => (
                  <FormControlLabel
                    key={g}
                    value={g}
                    control={<Radio sx={{ color: colors['beige-3'],my:1, "&.Mui-checked": { color: colors['gold-1'] } }} />}
                    label={g.charAt(0).toUpperCase() + g.slice(1)}
                  />
                ))}
              </RadioGroup>
            )}
          />

          <div className="grid pb-10 grid-cols-3 gap-4 ">
            {['day', 'month', 'year'].map((fieldName, i) => {
              const ranges = [[1, 31], [1, 12], [1930, 2025]];
              const labels = ["Day", "Month", "Year"];
              const defaultVals = [15, 5, 2023];
              const [min, max] = ranges[i];

              return (
                <Controller
                  key={fieldName}
                  name={fieldName as keyof FormData}
                  control={control}
                  defaultValue={defaultVals[i]}
                  render={({ field }) => (
                    <FormControl fullWidth>
                      <InputLabel variant="standard" sx={{ color: colors.textWhite, fontSize: 20 }}>{labels[i]}</InputLabel>
                      <NativeSelect
                        {...field}
                        sx={{
                          "& .MuiNativeSelect-select": { color: colors.textWhite, marginTop: 2 },
                          "& .MuiNativeSelect-icon": { color: colors.textWhite }

                        }}
                      >
                        {range(min, max).map(val => (
                          <option key={val} value={val} style={{ color: colors.textWhite, backgroundColor: colors.text }}>{val}</option>
                        ))}
                      </NativeSelect>
                    </FormControl>
                  )}
                />
              );
            })}
          </div>
          
          <Button type="submit" variant="contained"
            sx={{
              backgroundColor: colors.btn,
              px: 9,
              py: 1,
              borderRadius: 3,
              fontSize: 23,
              fontWeight: 600,
              textTransform: "capitalize",
              color: colors.text,
              width: "100%",
            
            }}>
            Continue
          </Button>
        
        </form>

        <p className='text-lg mt-10 mb-10 text-center text-white'>
          Already have an account? <Link to="/Login" className='text-[#D7B634]'>login</Link>
        </p>
      </div>
    </div>
    </>
  );
};

export default SignUpRider1;
