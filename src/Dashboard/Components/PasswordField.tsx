import { FormControl, InputAdornment, InputLabel, IconButton, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';
import { useState } from 'react';

const commonTextFieldStyles = {
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "#BEB58F50",
      borderRadius: 4
    },
    "& fieldset": { borderColor: "#BEB58F50", borderRadius: 4 },
    "&:hover fieldset": { borderColor: "#BEB58F50" },
  },
  "& .MuiInputBase-input": {
    color: "white",
    fontFamily: "ilight"
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "white",
  },
  fontFamily: "ithin",
  width: "100%",
};

interface PasswordFieldProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  label: string;
  placeholder?: string;
}

export const PasswordField = <T extends FieldValues>({
  name,
  control,
  label,
  placeholder
}: PasswordFieldProps<T>) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Controller name={name} control={control} render={({ field, fieldState: { error } }) => (
            <FormControl sx={commonTextFieldStyles} focused variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">{label}</InputLabel>
            <TextField {...field} type={showPassword ? 'text' : 'password'}
                error={!!error}
                InputProps={{placeholder: placeholder,
                endAdornment: (
                    <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                    </InputAdornment>
                ),
                }}
            />
            {error && (
                <p className="text-red-500 text-sm">{error.message}</p>
            )}
            </FormControl>
      )}
    />
  );
}; 